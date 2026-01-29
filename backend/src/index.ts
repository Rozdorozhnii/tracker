import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

import entriesRouter from "./routes/entries";

const app = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/entries", entriesRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
