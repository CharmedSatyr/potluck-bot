import "dotenv/config";
import { verifyKeyMiddleware } from "discord-interactions";
import express from "express";
import interactionsRouter from "./routes/interactions";

const app = express();

app.use(
	"/interactions",
	verifyKeyMiddleware(process.env.PUBLIC_KEY!),
	interactionsRouter
);

export default app;
