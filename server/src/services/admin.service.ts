import { QueryResult } from "pg";
import pool from "../config/db";
import { Admin } from "../models/admin.model";
import logger from "../utils/logger";

export async function findAdmin(query: string): Promise<Admin | false> {
  const adminResult: QueryResult<Admin> = await pool.query(
    "SELECT admin_id, email FROM admin WHERE admin_id = $1",
    [query]
  );

  if (adminResult.rows.length === 0) {
    logger.error("Admin not found");
    return false;
  }

  return adminResult.rows[0];
}
