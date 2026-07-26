-- Handstand Project — Supabase setup
-- Paste this whole file into: Supabase dashboard → SQL Editor → New query → Run.
-- Safe to run more than once.

create table if not exists public.training_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  state      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Row Level Security: every user can only ever see and write their own row.
-- This is what makes it safe to publish the anon key in a public repo.
alter table public.training_state enable row level security;

drop policy if exists "own row select" on public.training_state;
create policy "own row select" on public.training_state
  for select using (auth.uid() = user_id);

drop policy if exists "own row insert" on public.training_state;
create policy "own row insert" on public.training_state
  for insert with check (auth.uid() = user_id);

drop policy if exists "own row update" on public.training_state;
create policy "own row update" on public.training_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own row delete" on public.training_state;
create policy "own row delete" on public.training_state
  for delete using (auth.uid() = user_id);
