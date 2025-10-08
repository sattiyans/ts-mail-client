import { Request, Response } from "express";

export async function listCampaigns(_req: Request, res: Response) {
  return res.json({ items: [] });
}


