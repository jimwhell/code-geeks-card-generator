import pkg from "pg";
import logger from "../utils/logger";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool: pkg.Pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

pool.on("connect", () => {
  logger.info("Connection pool established with Database");
});

export default pool;
