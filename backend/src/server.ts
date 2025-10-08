import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { api } from "./routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", api);

app.get("/api/v1/health", (_req: express.Request, res: express.Response) => {
  res.json({ ok: true, service: "ts-mail-client-backend" });
});

app.listen(process.env.PORT || 4000, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on :${process.env.PORT || 4000}`);
});


