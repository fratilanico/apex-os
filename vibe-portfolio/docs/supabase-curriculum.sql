create table if not exists curriculum_modules (
  id text primary key,
  number text not null,
  title text not null,
  subtitle text not null,
  duration text not null,
  objective text not null,
  icon text not null,
  sections jsonb not null default '[]'::jsonb,
  key_takeaways jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists curriculum_modules_sort_order_idx
  on curriculum_modules (sort_order);

create or replace function update_curriculum_modules_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists curriculum_modules_updated_at on curriculum_modules;
create trigger curriculum_modules_updated_at
before update on curriculum_modules
for each row execute function update_curriculum_modules_updated_at();

alter table curriculum_modules enable row level security;

create policy "Curriculum modules are readable"
on curriculum_modules
for select
using (true);
