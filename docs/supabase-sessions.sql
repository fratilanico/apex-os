create table if not exists user_curriculum_progress (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  module_id text,
  section_id text,
  last_view text,
  progress_percent integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists user_curriculum_progress_user_idx
  on user_curriculum_progress (user_id);

create table if not exists terminal_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  mode text not null,
  messages jsonb not null default '[]'::jsonb,
  last_active_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists terminal_sessions_user_idx
  on terminal_sessions (user_id);

create unique index if not exists terminal_sessions_user_mode_idx
  on terminal_sessions (user_id, mode);

alter table user_curriculum_progress enable row level security;
alter table terminal_sessions enable row level security;

create policy "User curriculum progress readable"
on user_curriculum_progress
for select
using (true);

create policy "Terminal sessions readable"
on terminal_sessions
for select
using (true);
