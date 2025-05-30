import pool from "../config/db";

export interface Admin {
  id: boolean;
  email: string;
  password: string;
}
