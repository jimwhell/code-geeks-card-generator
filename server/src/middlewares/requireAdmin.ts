import { NextFunction, Request, Response } from "express";

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const admin = res.locals.admin;

  if (!admin) {
    res.status(403);
    return;
  }

  next();
};

export default requireAdmin;
