import { Request, Response } from "express";

export async function listTemplates(_req: Request, res: Response) {
  return res.json({ items: [] });
}


