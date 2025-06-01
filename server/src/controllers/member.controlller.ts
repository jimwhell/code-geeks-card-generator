import { Request, Response, NextFunction } from "express";
import { getAllMembers } from "../services/member.service";
import { Member } from "../models/member.model";
import log from "../utils/logger";

export async function getAllMembersHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const members: Member[] | null = await getAllMembers();

    if (!members) {
      res.status(500).json({ message: "Failed to retrieve members" });
      return;
    }

    if (members === null) {
      res.status(404).json({ message: "No members found" });
      return;
    }

    res.status(200).json({ members: members });
  } catch (error) {
    log.error("Error in retrieving members: ", error);
    next(error);
  }
}
