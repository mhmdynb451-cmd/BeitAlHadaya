-- بيت الهدايا - غاوي خسارة — Supabase schema
-- Run in the Supabase SQL editor. Idempotent: safe to re-run.
-- Column names are camelCase (quoted) to match the app's REST field names.

create table if not exists categories (
  id text primary key,
  name text not null,
  parent text,
  icon text,
  tint text,
  "createdAt" timestamptz default now()
);

create table if not exists products (
  id text primary key,
  name text not null,
  desc text,
  price numeric not null check (price > 0),
  "oldPrice" numeric,
  stock integer not null default 0 check (stock >= 0),
  "weightKg" numeric not null default 1 check ("weightKg" > 0),
  "categoryId" text references categories (id),
  icon text,
  tint text,
  deleted boolean default false,
  rating numeric default 4.5,
  sold integer default 0,
  "createdAt" timestamptz default now()
);

create table if not exists regions (
  id text primary key,
  name text not null,
  fee numeric not null default 0
);

create table if not exists carriers (
  id text primary key,
  name text not null,
  "baseFee" numeric not null default 45 check ("baseFee" >= 0),
  "perKgFee" numeric not null default 8 check ("perKgFee" >= 0),
  "minFee" numeric not null default 45 check ("minFee" >= 0),
  active boolean default true,
  "createdAt" timestamptz default now()
);

create table if not exists orders (
  id text primary key,
  email text,
  items jsonb not null default '[]'::jsonb,
  total numeric not null default 0,
  "shippingFee" numeric not null default 0,
  region text,
  carrier text,
  "weightKg" numeric,
  "customerName" text not null,
  phone text not null,
  address text not null,
  "payMethod" text,
  "paymentStatus" text,
  status text default 'بانتظار دفع الشحن',
  "createdAt" timestamptz default now()
);

-- Dynamic shipping rate: base fee covers the first kg, per-kg applies to extra weight.
create or replace function shipping_fee(base_fee numeric, per_kg_fee numeric, min_fee numeric, weight_kg numeric)
returns numeric language sql immutable as $$
  select greatest(min_fee, base_fee + greatest(weight_kg - 1, 0) * per_kg_fee);
$$;

-- Default carriers (Egyptian Post first, alternatives after).
insert into carriers (id, name, "baseFee", "perKgFee", "minFee", active) values
  ('cr1', 'بريد مصر', 45, 8, 45, true),
  ('cr2', 'أرامكس', 65, 12, 65, true),
  ('cr3', 'بوسطة إكسبرس', 55, 10, 55, true)
on conflict (id) do nothing;

-- Demo-grade anon access for the REST client.
-- Tighten with auth.uid() policies before production.
alter table categories enable row level security;
alter table products enable row level security;
alter table regions enable row level security;
alter table carriers enable row level security;
alter table orders enable row level security;

do $$
declare t text;
begin
  foreach t in array array['categories','products','regions','carriers','orders'] loop
    execute format('drop policy if exists anon_all on %I', t);
    execute format('create policy anon_all on %I for all to anon using (true) with check (true)', t);
  end loop;
end $$;
"}}]