import { db } from "../db";

export type CampaignInsert = {
  name: string;
  subject: string;
  templateId: string | null;
  status?: string | undefined;
  scheduledAt?: string | null | undefined;
};

export async function listCampaignsSvc() {
  const r = await db.query(
    `select id, name, subject, template_id as "templateId", status, scheduled_at as "scheduledAt", created_at as "createdAt"
     from campaigns order by created_at desc limit 100`
  );
  return r.rows;
}

export async function createCampaignSvc(c: CampaignInsert) {
  const r = await db.query(
    `insert into campaigns (name, subject, template_id, status, scheduled_at)
     values ($1, $2, $3, coalesce($4, 'draft'), $5)
     returning id, name, subject, template_id as "templateId", status, scheduled_at as "scheduledAt", created_at as "createdAt"`,
    [c.name, c.subject, c.templateId, c.status ?? null, c.scheduledAt ?? null]
  );
  return r.rows[0];
}

export async function getCampaignByIdSvc(id: string) {
  const r = await db.query(
    `select id, name, subject, template_id as "templateId", status, scheduled_at as "scheduledAt", created_at as "createdAt"
     from campaigns where id = $1`,
    [id]
  );
  return r.rows[0] || null;
}


