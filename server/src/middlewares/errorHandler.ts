import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import { error } from "console";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({
    status: 500,
    message: "Internal server error",
    error: err.message,
  });
};

export default errorHandler;
