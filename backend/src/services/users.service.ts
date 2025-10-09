import { db } from "../db";

export type UserInsert = {
  email: string;
  firstName: string;
  lastName: string;
  password?: string; // Optional for magic link auth
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
};

export async function createUserSvc(user: UserInsert) {
  const r = await db.query(
    `insert into users (email, first_name, last_name)
     values ($1, $2, $3)
     returning id, email, first_name as "firstName", last_name as "lastName", created_at as "createdAt", updated_at as "updatedAt"`,
    [user.email, user.firstName, user.lastName]
  );
  return r.rows[0];
}

export async function getUserByEmailSvc(email: string) {
  const r = await db.query(
    `select id, email, first_name as "firstName", last_name as "lastName", created_at as "createdAt", updated_at as "updatedAt"
     from users
     where email = $1`,
    [email]
  );
  return r.rows[0] || null;
}

export async function getUserByIdSvc(id: string) {
  const r = await db.query(
    `select id, email, first_name as "firstName", last_name as "lastName", created_at as "createdAt", updated_at as "updatedAt"
     from users
     where id = $1`,
    [id]
  );
  return r.rows[0] || null;
}

export async function updateUserSvc(id: string, updates: Partial<UserInsert>) {
  const fields = [];
  const values = [];
  let paramCount = 1;

  if (updates.firstName) {
    fields.push(`first_name = $${paramCount}`);
    values.push(updates.firstName);
    paramCount++;
  }
  if (updates.lastName) {
    fields.push(`last_name = $${paramCount}`);
    values.push(updates.lastName);
    paramCount++;
  }
  if (updates.email) {
    fields.push(`email = $${paramCount}`);
    values.push(updates.email);
    paramCount++;
  }

  if (fields.length === 0) {
    return getUserByIdSvc(id);
  }

  values.push(id);
  const query = `
    update users 
    set ${fields.join(', ')}, updated_at = now()
    where id = $${paramCount}
    returning id, email, first_name as "firstName", last_name as "lastName", created_at as "createdAt", updated_at as "updatedAt"
  `;

  const r = await db.query(query, values);
  return r.rows[0] || null;
}
