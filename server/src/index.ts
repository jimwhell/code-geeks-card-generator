import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import logger from "./utils/logger";
import pool from "./config/db";
import routes from "./routes/routes";
dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3000;

//Middlewares
app.use(express.json());
app.use(cors());

//TEST POSTGRE CONNECTION
app.get("/", async (req: Request, res: Response) => {
  const result = await pool.query("SELECT current_database()");
  res.send(`The database name is: ${result.rows[0].current_database}`);
});

app.listen(PORT, () => {
  logger.info(`App is listening at port: ${PORT}`);

  routes(app);
});
