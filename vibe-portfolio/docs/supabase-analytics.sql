create table if not exists user_events (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists user_events_user_idx
  on user_events (user_id);

create index if not exists user_events_type_idx
  on user_events (event_type);

create table if not exists user_profiles (
  user_id text primary key,
  learning_style text,
  speed text,
  pain_points jsonb not null default '[]'::jsonb,
  engagement_score numeric not null default 0,
  module_affinity jsonb not null default '{}'::jsonb,
  completion_rate numeric not null default 0,
  dropoff_points jsonb not null default '[]'::jsonb,
  last_summary text,
  updated_at timestamptz not null default now()
);

create table if not exists user_journey_predictions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  suggestions jsonb not null default '[]'::jsonb,
  rationale text,
  confidence numeric not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists user_journey_predictions_user_idx
  on user_journey_predictions (user_id);

alter table user_events enable row level security;
alter table user_profiles enable row level security;
alter table user_journey_predictions enable row level security;

create policy "User events readable"
on user_events
for select
using (true);

create policy "User profiles readable"
on user_profiles
for select
using (true);

create policy "User predictions readable"
on user_journey_predictions
for select
using (true);
