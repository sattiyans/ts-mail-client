import { Router } from "express";
import { z } from "zod";
import { listCampaigns } from "../controllers/campaigns.controller";
import { listTemplates } from "../controllers/templates.controller";
import { listDomains } from "../controllers/domains.controller";
import { getOverview } from "../controllers/analytics.controller";

export const api = Router();

api.get("/v1/campaigns", listCampaigns);

api.get("/v1/templates", listTemplates);

api.get("/v1/domains", listDomains);

api.get("/v1/analytics", getOverview);

const DraftSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  content: z.string().min(1),
  variables: z.array(z.string()).default([]),
  headers: z.array(z.string()).default([]),
  rows: z.array(z.record(z.string(), z.string())).default([]),
});

// Temporary in-memory store until DB arrives
const memoryDrafts = new Map<string, z.infer<typeof DraftSchema> & { id: string; createdAt: string }>();

api.post("/v1/campaigns/drafts", async (req, res) => {
  const parse = DraftSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "INVALID_BODY", issues: parse.error.flatten() });
  }
  const draft = parse.data;
  const id = Date.now().toString();
  const payload = { id, ...draft, createdAt: new Date().toISOString() };
  memoryDrafts.set(id, payload);
  return res.status(201).json(payload);
});

api.get("/v1/campaigns/drafts/:id", async (req, res) => {
  const { id } = req.params as { id: string };
  const item = memoryDrafts.get(id);
  if (!item) return res.status(404).json({ error: "NOT_FOUND" });
  return res.json(item);
});


