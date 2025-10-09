import { Request, Response } from "express";
import { z } from "zod";
import { createTemplateSvc, getTemplateByIdSvc, listTemplatesSvc } from "../services/templates.service";

export async function listTemplates(_req: Request, res: Response) {
  const items = await listTemplatesSvc();
  return res.json({ items });
}

const CreateTemplateSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  content: z.string().min(1),
  variables: z.array(z.string()).default([]),
});

export async function createTemplate(req: Request, res: Response) {
  const parsed = CreateTemplateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_BODY", issues: parsed.error.flatten() });
  const created = await createTemplateSvc(parsed.data);
  return res.status(201).json(created);
}

export async function getTemplateById(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "MISSING_ID" });
  }
  
  const item = await getTemplateByIdSvc(id);
  if (!item) return res.status(404).json({ error: "NOT_FOUND" });
  return res.json(item);
}


