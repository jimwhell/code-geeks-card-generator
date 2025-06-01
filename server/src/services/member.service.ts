import { QueryResult } from "pg";
import pool from "../config/db";
import { Member } from "../models/member.model";
import log from "../utils/logger";

//Retrieve all member data along with their card_IDs
export async function getAllMembers(): Promise<Member[] | null> {
  const members: QueryResult<Member> = await pool.query(`
    SELECT 
      m.*,
      CASE
        WHEN m.card_id IS NOT NULL THEN TRUE
        ELSE FALSE
      END AS has_card
      FROM 
        members m
        LEFT JOIN cards c ON c.card_id = m.card_id;
    `);

  if (!members) {
    log.error("Error in retrieving members");
    return null;
  }

  if (members.rows.length === 0) {
    log.info("No members found");
    return null;
  }

  return members.rows;
}
