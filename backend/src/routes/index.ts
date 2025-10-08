import { Router } from "express";
import { z } from "zod";
import { listCampaigns, createCampaign, getCampaignById } from "../controllers/campaigns.controller";
import { listTemplates, createTemplate, getTemplateById } from "../controllers/templates.controller";
import { listDomains } from "../controllers/domains.controller";
import { getOverview } from "../controllers/analytics.controller";
import { createDraft, getDraft } from "../services/drafts.service";
import { sendMail } from "../services/mailer";
import { logEmail } from "../services/email-logs.service";

export const api = Router();

api.get("/v1/campaigns", listCampaigns);
api.post("/v1/campaigns", createCampaign);
api.get("/v1/campaigns/:id", getCampaignById);

api.get("/v1/templates", listTemplates);
api.post("/v1/templates", createTemplate);
api.get("/v1/templates/:id", getTemplateById);

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
  try {
    const saved = await createDraft({
      name: draft.name,
      subject: draft.subject,
      content: draft.content,
      variables: draft.variables,
      headers: draft.headers,
      rows: draft.rows,
    });
    return res.status(201).json(saved);
  } catch (e) {
    // fallback to memory if DB unavailable
    const id = Date.now().toString();
    const payload = { id, ...draft, createdAt: new Date().toISOString() };
    memoryDrafts.set(id, payload);
    return res.status(201).json(payload);
  }
});

api.get("/v1/campaigns/drafts/:id", async (req, res) => {
  const { id } = req.params as { id: string };
  try {
    const found = await getDraft(id);
    if (found) return res.json(found);
  } catch {}
  const mem = memoryDrafts.get(id);
  if (!mem) return res.status(404).json({ error: "NOT_FOUND" });
  return res.json(mem);
});

const SendPayload = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1),
  campaignId: z.string().uuid().nullable().optional(),
  attachments: z
    .array(
      z.object({ filename: z.string(), contentBase64: z.string(), contentType: z.string().optional() })
    )
    .optional(),
});

api.post("/v1/send", async (req, res) => {
  const parsed = SendPayload.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_BODY", issues: parsed.error.flatten() });
  const p = parsed.data;
  try {
    const attachments = (p.attachments || []).map((a) => ({
      filename: a.filename,
      content: Buffer.from(a.contentBase64, "base64"),
      contentType: a.contentType,
    }));
    await sendMail({ to: p.to, subject: p.subject, html: p.html, attachments });
    await logEmail({ campaignId: p.campaignId ?? null, recipientEmail: p.to, status: "sent" });
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    await logEmail({ campaignId: p.campaignId ?? null, recipientEmail: p.to, status: "error" });
    return res.status(500).json({ error: "SEND_FAILED", message: e?.message || "unknown" });
  }
});


