import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import logger from "./utils/logger";
import pool from "./config/db";
import sessionRoutes from "../src/routes/session.routes";
import errorHandler from "./middlewares/errorHandler";
import deserializeUser from "./middlewares/deserializeUser";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3000;

//Middlewares
app.use(express.json());
app.use(
  cors({
    exposedHeaders: ["x-access-token"],
  })
);

//routes
app.use("/api/sessions", sessionRoutes);

//TEST POSTGRE CONNECTION
// app.get("/", async (req: Request, res: Response) => {
//   const result = await pool.query("SELECT current_database()");
//   res.send(`The database name is: ${result.rows[0].current_database}`);
// });

//error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`App is listening at port: ${PORT}`);
});
