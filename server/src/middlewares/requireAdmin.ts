import { NextFunction, Request, Response } from "express";
import { Admin } from "../models/admin.model";

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const admin: Omit<Admin, "password_hash"> = res.locals.admin;

  if (!admin) {
    res.status(403);
    return;
  }

  next();
};

export default requireAdmin;
