import { Request, Response } from "express";
import { z } from "zod";
import { createCampaignSvc, getCampaignByIdSvc, listCampaignsSvc } from "../services/campaigns.service";

export async function listCampaigns(_req: Request, res: Response) {
  const items = await listCampaignsSvc();
  return res.json({ items });
}

const CreateCampaignSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  templateId: z.string().uuid().nullable().optional(),
  status: z.string().optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
});

export async function createCampaign(req: Request, res: Response) {
  const parsed = CreateCampaignSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_BODY", issues: parsed.error.flatten() });
  const created = await createCampaignSvc({
    name: parsed.data.name,
    subject: parsed.data.subject,
    templateId: parsed.data.templateId ?? null,
    status: parsed.data.status,
    scheduledAt: parsed.data.scheduledAt ?? null,
  });
  return res.status(201).json(created);
}

export async function getCampaignById(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const item = await getCampaignByIdSvc(id);
  if (!item) return res.status(404).json({ error: "NOT_FOUND" });
  return res.json(item);
}


