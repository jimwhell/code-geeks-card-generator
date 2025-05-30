import { Request, Response } from "express";
import {
  createSession,
  findSessions,
  updateSession,
  validatePassword,
} from "../services/sessions.service";
import { signJWT } from "../utils/jwt.utils";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { admin } from "googleapis/build/src/apis/admin";
import { Session } from "../models/session.model";

dotenv.config();

const accessTokenTTL = process.env.ACCESS_TOKEN_TTL;
const refreshTokenTTL = process.env.REFRESH_TOKEN_TTL;

export async function createAdminSession(req: Request, res: Response) {
  //validate input credentials
  console.log("Email: ", req.body.email);
  console.log("Password: ", req.body.password);

  const admin = await validatePassword(req.body);

  if (!admin) {
    res.status(401).send("Invalid email or password");
    return;
  }

  //create a session
  const adminId: string = admin.admin_id;

  if (!adminId) {
    res.status(404).send("Admin id not found.");
    return;
  }

  const session: Session = await createSession(adminId);

  //create an access token
  //and store admin details and session id in token
  const accessToken = signJWT(
    { ...admin, session: session.session_id },
    { expiresIn: accessTokenTTL } as jwt.SignOptions //15 minutes
  );

  //create a refresh token
  const refreshToken = signJWT(
    { ...admin, session: session.session_id },
    { expiresIn: refreshTokenTTL } as jwt.SignOptions //1 year
  );

  res.send({ accessToken, refreshToken });
}

export async function getAdminSessions(req: Request, res: Response) {
  const adminId = res.locals.admin.admin_id;

  const sessions = await findSessions(adminId);
  console.log("Sessions from controller: ", sessions);

  if (!sessions) {
    res.status(404).send("No sessions found for admin");
    return;
  }
  res.status(200).send(sessions);
}

export async function deleteAdminSession(req: Request, res: Response) {
  const sessionId = res.locals.admin.session;

  if (!sessionId) {
    res.status(401).send("Missing session ID.");
  }

  await updateSession(sessionId, false);

  res.status(200).send({
    accessToken: null,
    refreshToken: null,
  });
}
