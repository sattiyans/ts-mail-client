import { db } from "../db";

export type DraftInsert = {
  name: string;
  subject: string;
  content: string;
  variables: string[];
  headers: string[];
  rows: Record<string, string>[];
};

export async function createDraft(draft: DraftInsert) {
  const result = await db.query(
    `insert into drafts (name, subject, content, variables, headers, rows)
     values ($1, $2, $3, $4, $5, $6)
     returning id, name, subject, content, variables, headers, rows, created_at`,
    [
      draft.name,
      draft.subject,
      draft.content,
      draft.variables,
      draft.headers,
      JSON.stringify(draft.rows),
    ]
  );
  return result.rows[0];
}

export async function getDraft(id: string) {
  const result = await db.query(
    `select id, name, subject, content, variables, headers, rows, created_at
     from drafts where id = $1`,
    [id]
  );
  return result.rows[0] || null;
}


