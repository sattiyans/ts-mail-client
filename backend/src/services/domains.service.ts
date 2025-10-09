import { db } from "../db";

export type DomainInsert = {
  domain: string;
  status: string;
  verifiedAt?: string | null;
};

export async function listDomainsSvc() {
  const r = await db.query(`
    select id, domain, status, verified_at as "verifiedAt", created_at as "createdAt"
    from domains
    order by created_at desc
  `);
  return r.rows;
}

export async function createDomainSvc(d: DomainInsert) {
  const r = await db.query(
    `insert into domains (domain, status, verified_at)
     values ($1, $2, $3)
     returning id, domain, status, verified_at as "verifiedAt", created_at as "createdAt"`,
    [d.domain, d.status, d.verifiedAt ?? null]
  );
  return r.rows[0];
}

export async function getDomainByIdSvc(id: string) {
  const r = await db.query(
    `select id, domain, status, verified_at as "verifiedAt", created_at as "createdAt"
     from domains
     where id = $1`,
    [id]
  );
  return r.rows[0] || null;
}

export async function updateDomainStatusSvc(id: string, status: string, verifiedAt?: string | null) {
  const r = await db.query(
    `update domains 
     set status = $2, verified_at = $3
     where id = $1
     returning id, domain, status, verified_at as "verifiedAt", created_at as "createdAt"`,
    [id, status, verifiedAt ?? null]
  );
  return r.rows[0] || null;
}

export async function deleteDomainSvc(id: string) {
  await db.query(`delete from domains where id = $1`, [id]);
  return true;
}
