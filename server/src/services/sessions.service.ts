import { admin } from "googleapis/build/src/apis/admin";
import pool from "../config/db";
import bcrypt from "bcrypt";
import { Session } from "../models/session.model";
import { QueryResult } from "pg";
import { signJWT, verifyJWT } from "../utils/jwt.utils";
import logger from "../utils/logger";
import { findAdmin } from "./admin.service";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export async function createSession(admin_id: string): Promise<Session> {
  const session: QueryResult<Session> = await pool.query(
    "INSERT INTO sessions (admin_id) VALUES($1) RETURNING *",
    [admin_id]
  );
  console.log("Session: ", session.rows[0]);
  return session.rows[0];
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  console.log("Email: ", email);
  console.log("Password: ", password);

  const matchResult = await pool.query("SELECT * FROM admin WHERE email = $1", [
    email,
  ]);

  if (matchResult.rows.length === 0) {
    return false;
  }

  //retrieve the hash of the matched record
  const matchedResultHash: string = matchResult.rows[0].password_hash;

  const isValid: boolean = await bcrypt.compare(password, matchedResultHash);

  console.log("Is comparison valid: ", isValid);

  if (!isValid) {
    return false;
  }

  return {
    admin_id: matchResult.rows[0].admin_id,
    email: matchResult.rows[0].email,
  };
}

export async function findSessions(query: string): Promise<Session[] | false> {
  const adminId = query;
  const sessions = await pool.query(
    "SELECT * FROM sessions where admin_id = $1 AND is_valid = true",
    [adminId]
  );

  if (sessions.rows.length === 0) {
    return false;
  }

  return sessions.rows;
}

export async function findValidSession(sessionId: string) {
  const session = await pool.query(
    "SELECT * FROM sessions where session_id = $1 AND is_valid = true",
    [sessionId]
  );

  if (!session || session.rows.length === 0) {
    return false;
  }

  return session.rows[0];
}

export async function updateSession(
  query: string,
  update: boolean
): Promise<Session | boolean> {
  console.log("Query: ", query);
  console.log("Update: ", update);

  const updateResult = await pool.query(
    "UPDATE sessions SET is_valid = $1 WHERE session_id = $2",
    [update, query]
  );

  if (updateResult.rows.length === 0) {
    return false;
  }

  return updateResult.rows[0];
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}): Promise<string | false> {
  //verify if refresh token is valid
  const verifyResult = verifyJWT(refreshToken);

  if (!verifyResult) {
    logger.error("Error verifying refresh token");
    return false;
  }

  const { decoded } = verifyResult;

  if (!decoded || !decoded.session) {
    logger.error("Invalid session");
    return false;
  }

  console.log("Decoded session ID:", decoded.session);

  const session: QueryResult<Session> = await pool.query(
    "SELECT * FROM sessions WHERE session_id = $1",
    [decoded.session]
  );

  console.log("Query result: ", session.rows[0]);
  console.log("Query result: ", session.rows.length);

  if (session.rows.length === 0 || !session.rows[0].is_valid) {
    logger.error("Session is invalid or not found for this refresh token");
    return false;
  }

  const adminId = session.rows[0].admin_id;

  const admin = await findAdmin(adminId);

  if (!admin) {
    logger.error("Admin with refresh token not found.");
    return false;
  }

  //create new access token
  const accessToken = signJWT(
    { ...admin, session: session.rows[0].session_id },
    { expiresIn: process.env.ACCESS_TOKEN_TTL } as jwt.SignOptions //15 minutes
  );

  if (!accessToken) {
    logger.error("Error creating new access token");
    return false;
  }

  return accessToken;
}
