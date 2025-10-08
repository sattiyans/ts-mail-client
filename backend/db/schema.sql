-- PostgreSQL schema for ts-mail-client

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  created_at timestamptz not null default now()
);

create table if not exists domains (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  domain text not null,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  name text not null,
  subject text not null,
  content text not null,
  variables text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  name text not null,
  subject text not null,
  template_id uuid references templates(id) on delete set null,
  status text not null default 'draft',
  scheduled_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists email_logs (
  id bigserial primary key,
  campaign_id uuid references campaigns(id) on delete cascade,
  recipient_email text not null,
  status text not null,
  opened boolean not null default false,
  clicked boolean not null default false,
  bounced boolean not null default false,
  ts timestamptz not null default now()
);

create table if not exists drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  name text not null,
  subject text not null,
  content text not null,
  variables text[] not null default '{}',
  headers text[] not null default '{}',
  rows jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);


