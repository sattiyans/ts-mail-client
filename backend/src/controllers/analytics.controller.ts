import { Request, Response } from "express";
import { getAnalyticsOverviewSvc } from "../services/analytics.service";

export async function getOverview(_req: Request, res: Response) {
  const analytics = await getAnalyticsOverviewSvc();
  return res.json(analytics);
}


