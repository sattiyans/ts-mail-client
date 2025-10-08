import { db } from "../db";

export type TemplateInsert = {
  name: string;
  subject: string;
  content: string;
  variables: string[];
};

export async function listTemplatesSvc() {
  const r = await db.query(
    `select id, name, subject, content, variables, created_at from templates order by created_at desc limit 100`
  );
  return r.rows;
}

export async function createTemplateSvc(t: TemplateInsert) {
  const r = await db.query(
    `insert into templates (name, subject, content, variables)
     values ($1, $2, $3, $4)
     returning id, name, subject, content, variables, created_at`,
    [t.name, t.subject, t.content, t.variables]
  );
  return r.rows[0];
}

export async function getTemplateByIdSvc(id: string) {
  const r = await db.query(
    `select id, name, subject, content, variables, created_at from templates where id = $1`,
    [id]
  );
  return r.rows[0] || null;
}


