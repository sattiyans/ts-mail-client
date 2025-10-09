import { Request, Response } from "express";
import { z } from "zod";
import { 
  listDomainsSvc, 
  createDomainSvc, 
  getDomainByIdSvc, 
  updateDomainStatusSvc, 
  deleteDomainSvc 
} from "../services/domains.service";

export async function listDomains(_req: Request, res: Response) {
  const items = await listDomainsSvc();
  return res.json({ items });
}

const CreateDomainSchema = z.object({
  domain: z.string().min(1),
  status: z.string().default("pending"),
});

export async function createDomain(req: Request, res: Response) {
  const parsed = CreateDomainSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "INVALID_BODY", issues: parsed.error.flatten() });
  }
  
  const domain = await createDomainSvc(parsed.data);
  return res.json(domain);
}

export async function getDomain(req: Request, res: Response) {
  const { id } = req.params;
  const domain = await getDomainByIdSvc(id);
  if (!domain) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }
  return res.json(domain);
}

const UpdateDomainStatusSchema = z.object({
  status: z.string(),
  verifiedAt: z.string().optional(),
});

export async function updateDomainStatus(req: Request, res: Response) {
  const { id } = req.params;
  const parsed = UpdateDomainStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "INVALID_BODY", issues: parsed.error.flatten() });
  }
  
  const domain = await updateDomainStatusSvc(id, parsed.data.status, parsed.data.verifiedAt);
  if (!domain) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }
  return res.json(domain);
}

export async function deleteDomain(req: Request, res: Response) {
  const { id } = req.params;
  await deleteDomainSvc(id);
  return res.json({ success: true });
}


