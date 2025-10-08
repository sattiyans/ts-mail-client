import { Request, Response } from "express";

export async function listDomains(_req: Request, res: Response) {
  return res.json({ items: [] });
}


