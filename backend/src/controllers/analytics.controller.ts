import { Request, Response } from "express";

export async function getOverview(_req: Request, res: Response) {
  return res.json({ overview: { sent: 0, opened: 0, clicked: 0, bounces: 0 } });
}


