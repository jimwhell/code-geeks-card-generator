import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwt.utils";
import {
  findSessions,
  findValidSession,
  reIssueAccessToken,
} from "../services/sessions.service";
import { doesNotMatch } from "assert";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;
  console.log("authorization header: ", authorizationHeader);
  if (!authorizationHeader) {
    res.status(401).send("Unauthorized access");
    return;
  }

  //retrieve the access token and the refresh token from the headers
  const accessToken = authorizationHeader.replace(/^Bearer\s/, "");
  const refreshToken = req.headers["x-refresh"];

  const jwtResult = verifyJWT(accessToken);

  if (!jwtResult) {
    res.status(401).send("Invalid access token");
    return;
  }

  const { decoded, expired } = jwtResult;

  console.log("expired: ", expired);
  console.log("decoded: ", decoded);

  if (!decoded && !refreshToken) {
    res.status(401).send("Unauthorized access.");
    return;
  }

  //if access token is expired, verify refreshToken then create a new one.
  if (expired && refreshToken && typeof refreshToken === "string") {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (!newAccessToken) {
      res.status(401).send("Invalid session");
      return;
    }
    //set new access token to header
    res.setHeader("x-access-token", newAccessToken);

    //verify new access token
    const result = verifyJWT(newAccessToken);

    if (!result) {
      res.status(401).send("Invalid access token");
      return;
    }

    //if token is valid:
    //include admin details to res.locals
    res.locals.admin = result.decoded;
    next();
  }

  if (decoded === null) {
    res.status(401).send("Unauthorized access.");
    return;
  }

  const sessionId = decoded.session;

  const session = await findValidSession(sessionId);

  if (!session) {
    res.status(401).send("Session revoked. Authentication required.");
  }


  //if token is valid:
  //include admin details to res.locals
  res.locals.admin = decoded;
  next();
};

export default deserializeUser;
