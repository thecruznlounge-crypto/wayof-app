-- WAYOF v8 — Supabase schema. Run once in Supabase → SQL Editor (safe to re-run).
-- Every table has Row Level Security: users only ever see their own rows, except
-- (a) group leaderboards via group_board(), which respects each member's share settings, and
-- (b) trainer links, where the secret token grants read access to the plan and recent totals only.

create extension if not exists pgcrypto;

-- ---------- core ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text default '',
  created_at timestamptz default now()
);
-- Shared project with Pedalz: Pedalz also has a profiles table (name, handle, grp…). Add WAYOF's column without touching theirs.
alter table public.profiles add column if not exists display_name text default '';
alter table public.profiles add column if not exists created_at timestamptz default now();
-- Pedalz columns too, so the three schemas can run in any order (all nullable, no effect on WAYOF).
alter table public.profiles add column if not exists name text;
alter table public.profiles add column if not exists handle text;
alter table public.profiles add column if not exists gender text default 'x';
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists genres text[] default '{}';
alter table public.profiles add column if not exists grp text;
alter table public.profiles add column if not exists vis text default 'group';
alter table public.profiles add column if not exists radius numeric default 0.8;
create table if not exists public.app_state (
  user_id uuid primary key references auth.users on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);
create table if not exists public.daily_logs (
  user_id uuid references auth.users on delete cascade,
  day date not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now(),
  primary key (user_id, day)
);
create table if not exists public.health_summaries (            -- read by Kayaos.space (same project)
  user_id uuid primary key references auth.users on delete cascade,
  summary jsonb not null,
  updated_at timestamptz default now()
);
create table if not exists public.coach_usage (
  user_id uuid references auth.users on delete cascade,
  day date not null default current_date,
  count int not null default 0,
  primary key (user_id, day)
);
create table if not exists public.push_subscriptions (
  id bigserial primary key,
  user_id uuid references auth.users on delete cascade,
  endpoint text unique not null,
  p256dh text not null,
  auth text not null,
  tz text default 'America/New_York',
  prefs jsonb default '{}'::jsonb,
  sent_day date,
  sent_today int default 0,
  last_sent_at timestamptz,
  created_at timestamptz default now()
);

-- ---------- groups & partners ----------
create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 40),
  kind text not null default 'group' check (kind in ('partner','group')),
  invite_code text unique not null,
  owner uuid references auth.users on delete set null,
  created_at timestamptz default now()
);
create table if not exists public.group_members (
  group_id uuid references public.groups on delete cascade,
  user_id uuid references auth.users on delete cascade,
  display_name text default '',
  share jsonb not null default '{"steps":true,"workouts":true,"water":true,"active_min":true,"post_workouts":false}'::jsonb,
  joined_at timestamptz default now(),
  primary key (group_id, user_id)
);
create table if not exists public.group_feed (
  id bigserial primary key,
  group_id uuid references public.groups on delete cascade,
  user_id uuid references auth.users on delete cascade,
  display_name text default '',
  kind text not null default 'checkin' check (kind in ('checkin','cheer','workout')),
  text text not null check (char_length(text) <= 280),
  created_at timestamptz default now()
);

-- ---------- trainers ----------
create table if not exists public.trainer_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  token text unique not null,
  trainer_name text default '',
  active boolean default true,
  created_at timestamptz default now()
);
create table if not exists public.trainer_notes (
  id uuid primary key default gen_random_uuid(),
  link_id uuid references public.trainer_links on delete cascade,
  user_id uuid references auth.users on delete cascade,
  note text check (char_length(note) <= 4000),
  plan_patch jsonb,
  read boolean default false,
  created_at timestamptz default now()
);

-- ---------- RLS ----------
alter table public.profiles enable row level security;
alter table public.app_state enable row level security;
alter table public.daily_logs enable row level security;
alter table public.health_summaries enable row level security;
alter table public.coach_usage enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_feed enable row level security;
alter table public.trainer_links enable row level security;
alter table public.trainer_notes enable row level security;

create or replace function public.wayof_is_member(p_group uuid) returns boolean
language sql security definer set search_path = public stable as $$
  select exists (select 1 from group_members where group_id = p_group and user_id = auth.uid());
$$;

do $$ begin
  -- own-row tables
  drop policy if exists wayof_own_profiles on public.profiles;       create policy wayof_own_profiles on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());
  drop policy if exists own_state on public.app_state;               create policy own_state on public.app_state for all using (user_id = auth.uid()) with check (user_id = auth.uid());
  drop policy if exists own_logs on public.daily_logs;               create policy own_logs on public.daily_logs for all using (user_id = auth.uid()) with check (user_id = auth.uid());
  drop policy if exists own_health on public.health_summaries;       create policy own_health on public.health_summaries for all using (user_id = auth.uid()) with check (user_id = auth.uid());
  drop policy if exists own_usage on public.coach_usage;             create policy own_usage on public.coach_usage for select using (user_id = auth.uid());
  drop policy if exists own_push on public.push_subscriptions;       create policy own_push on public.push_subscriptions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
  -- groups
  drop policy if exists member_groups on public.groups;              create policy member_groups on public.groups for select using (public.wayof_is_member(id));
  drop policy if exists member_rows on public.group_members;         create policy member_rows on public.group_members for select using (public.wayof_is_member(group_id));
  drop policy if exists own_member_update on public.group_members;   create policy own_member_update on public.group_members for update using (user_id = auth.uid()) with check (user_id = auth.uid());
  drop policy if exists own_member_delete on public.group_members;   create policy own_member_delete on public.group_members for delete using (user_id = auth.uid());
  drop policy if exists member_feed_read on public.group_feed;       create policy member_feed_read on public.group_feed for select using (public.wayof_is_member(group_id));
  drop policy if exists member_feed_write on public.group_feed;      create policy member_feed_write on public.group_feed for insert with check (user_id = auth.uid() and public.wayof_is_member(group_id));
  -- trainers (owner side; trainer side uses token RPCs below)
  drop policy if exists own_links on public.trainer_links;           create policy own_links on public.trainer_links for select using (user_id = auth.uid());
  drop policy if exists own_links_upd on public.trainer_links;       create policy own_links_upd on public.trainer_links for update using (user_id = auth.uid()) with check (user_id = auth.uid());
  drop policy if exists own_notes on public.trainer_notes;           create policy own_notes on public.trainer_notes for select using (user_id = auth.uid());
  drop policy if exists own_notes_upd on public.trainer_notes;       create policy own_notes_upd on public.trainer_notes for update using (user_id = auth.uid()) with check (user_id = auth.uid());
end $$;

-- profile row on sign-up
create or replace function public.wayof_handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'display_name', '')) on conflict do nothing;
  return new;
end $$;
drop trigger if exists wayof_on_auth_user_created on auth.users;
create trigger wayof_on_auth_user_created after insert on auth.users for each row execute function public.wayof_handle_new_user();

-- ---------- group RPCs ----------
create or replace function public.wayof_gen_code() returns text language sql volatile as $$
  select string_agg(substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 1 + floor(random() * 32)::int, 1), '') from generate_series(1, 6);
$$;

create or replace function public.create_group(p_name text, p_kind text) returns uuid
language plpgsql security definer set search_path = public as $$
declare gid uuid; code text; nm text;
begin
  if auth.uid() is null then raise exception 'Sign in first'; end if;
  if (select count(*) from group_members where user_id = auth.uid()) >= 20 then raise exception 'You can be in up to 20 groups'; end if;
  loop code := wayof_gen_code(); exit when not exists (select 1 from groups where invite_code = code); end loop;
  insert into groups (name, kind, invite_code, owner) values (left(trim(p_name), 40), case when p_kind = 'partner' then 'partner' else 'group' end, code, auth.uid()) returning id into gid;
  select display_name into nm from profiles where id = auth.uid();
  insert into group_members (group_id, user_id, display_name) values (gid, auth.uid(), coalesce(nm, ''));
  return gid;
end $$;

create or replace function public.join_group(p_code text, p_display_name text) returns uuid
language plpgsql security definer set search_path = public as $$
declare g groups; n int;
begin
  if auth.uid() is null then raise exception 'Sign in first'; end if;
  select * into g from groups where invite_code = upper(trim(p_code));
  if g.id is null then raise exception 'Invite code not found'; end if;
  select count(*) into n from group_members where group_id = g.id;
  if g.kind = 'partner' and n >= 2 and not exists (select 1 from group_members where group_id = g.id and user_id = auth.uid()) then raise exception 'This partnership already has two people'; end if;
  if n >= 50 then raise exception 'This group is full'; end if;
  insert into group_members (group_id, user_id, display_name)
    values (g.id, auth.uid(), coalesce(nullif(trim(p_display_name), ''), (select display_name from profiles where id = auth.uid()), ''))
    on conflict (group_id, user_id) do nothing;
  return g.id;
end $$;

create or replace function public.my_groups() returns table (id uuid, name text, kind text, invite_code text, members int, share jsonb)
language sql security definer set search_path = public stable as $$
  select g.id, g.name, g.kind, g.invite_code, (select count(*)::int from group_members m2 where m2.group_id = g.id), m.share
  from groups g join group_members m on m.group_id = g.id and m.user_id = auth.uid()
  order by g.created_at;
$$;

create or replace function public.group_board(p_group uuid, p_since date)
returns table (user_id uuid, display_name text, is_me boolean, steps int, workouts int, water int, active_min int)
language plpgsql security definer set search_path = public stable as $$
begin
  if not wayof_is_member(p_group) then raise exception 'Not a member of this group'; end if;
  return query
  select m.user_id, m.display_name, m.user_id = auth.uid(),
    case when (m.share->>'steps')::boolean is not false then coalesce(sum((l.data->>'steps')::int), 0)::int end,
    case when (m.share->>'workouts')::boolean is not false then coalesce(sum(jsonb_array_length(coalesce(l.data->'workouts', '[]'::jsonb))), 0)::int end,
    case when (m.share->>'water')::boolean is not false then coalesce(sum((l.data->>'water')::int), 0)::int end,
    case when (m.share->>'active_min')::boolean is not false then coalesce(sum((select coalesce(sum((w->>'minutes')::int), 0) from jsonb_array_elements(coalesce(l.data->'workouts', '[]'::jsonb)) w)), 0)::int end
  from group_members m
  left join daily_logs l on l.user_id = m.user_id and l.day >= greatest(p_since, current_date - 31) and l.day <= current_date
  where m.group_id = p_group
  group by m.user_id, m.display_name, m.share;
end $$;

-- ---------- trainer RPCs ----------
create or replace function public.create_trainer_link(p_trainer_name text) returns text
language plpgsql security definer set search_path = public as $$
declare t text;
begin
  if auth.uid() is null then raise exception 'Sign in first'; end if;
  if (select count(*) from trainer_links where user_id = auth.uid() and active) >= 5 then raise exception 'Revoke an old link first (max 5 active)'; end if;
  t := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
  insert into trainer_links (user_id, token, trainer_name) values (auth.uid(), t, left(coalesce(p_trainer_name, ''), 60));
  return t;
end $$;

create or replace function public.trainer_view(p_token text) returns jsonb
language plpgsql security definer set search_path = public stable as $$
declare lk trainer_links; st jsonb; nm text;
begin
  select * into lk from trainer_links where token = p_token and active;
  if lk.id is null then raise exception 'This link is invalid or was revoked'; end if;
  select data into st from app_state where user_id = lk.user_id;
  select display_name into nm from profiles where id = lk.user_id;
  return jsonb_build_object(
    'client_name', coalesce(nullif(st->'profile'->>'name', ''), nm, 'Client'),
    'trainer_name', lk.trainer_name,
    'units', st->'profile'->>'units',
    'goals', jsonb_build_object('plan_goal', st->'plan'->>'goal', 'level', st->'plan'->>'level', 'days', st->'plan'->>'days', 'minutes', st->'plan'->>'minutes', 'steps', st->'profile'->>'steps', 'kcal', st->'profile'->>'kcal', 'protein', st->'profile'->>'protein'),
    'focus', coalesce(st->'body'->'focus', '[]'::jsonb),
    'equipment', coalesce(st->'equipment', '[]'::jsonb),
    'plan', coalesce(st->'plan'->'week', '[]'::jsonb),
    'recent', coalesce((select jsonb_agg(jsonb_build_object(
        'day', l.day, 'steps', l.data->'steps', 'water', l.data->'water', 'sleep', l.data->'sleep',
        'kcal', (select coalesce(sum((m->>'kcal')::int), 0) from jsonb_array_elements(coalesce(l.data->'meals', '[]'::jsonb)) m),
        'protein', (select coalesce(sum((m->>'p')::int), 0) from jsonb_array_elements(coalesce(l.data->'meals', '[]'::jsonb)) m),
        'workouts', (select coalesce(jsonb_agg(jsonb_build_object('title', w->'title', 'minutes', w->'minutes', 'rpe', w->'rpe', 'reps', w->'reps', 'tips', w->'tips')), '[]'::jsonb) from jsonb_array_elements(coalesce(l.data->'workouts', '[]'::jsonb)) w)
      ) order by l.day desc) from daily_logs l where l.user_id = lk.user_id and l.day >= current_date - 14), '[]'::jsonb),
    'notes', coalesce((select jsonb_agg(jsonb_build_object('note', n.note, 'created_at', n.created_at, 'read', n.read) order by n.created_at desc) from trainer_notes n where n.link_id = lk.id), '[]'::jsonb)
  );
end $$;

create or replace function public.trainer_send(p_token text, p_note text, p_plan jsonb) returns boolean
language plpgsql security definer set search_path = public as $$
declare lk trainer_links;
begin
  select * into lk from trainer_links where token = p_token and active;
  if lk.id is null then raise exception 'This link is invalid or was revoked'; end if;
  if (select count(*) from trainer_notes where link_id = lk.id and created_at > now() - interval '1 day') >= 30 then raise exception 'Daily note limit reached'; end if;
  if coalesce(trim(p_note), '') = '' and p_plan is null then raise exception 'Write a note or change the plan'; end if;
  insert into trainer_notes (link_id, user_id, note, plan_patch) values (lk.id, lk.user_id, left(coalesce(p_note, ''), 4000), case when p_plan is not null and jsonb_typeof(p_plan->'week') = 'array' then p_plan end);
  return true;
end $$;

-- ---------- AI usage counter (called by the coach Edge Function with the service role) ----------
create or replace function public.bump_coach_usage(p_user uuid) returns int
language sql security definer set search_path = public as $$
  insert into coach_usage (user_id, day, count) values (p_user, current_date, 1)
  on conflict (user_id, day) do update set count = coach_usage.count + 1
  returning count;
$$;

revoke all on function public.bump_coach_usage(uuid) from public, anon, authenticated;
revoke all on function public.wayof_gen_code() from public, anon, authenticated;
grant execute on function public.create_group(text, text), public.join_group(text, text), public.my_groups(), public.group_board(uuid, date), public.create_trainer_link(text) to authenticated;
grant execute on function public.trainer_view(text), public.trainer_send(text, text, jsonb) to anon, authenticated;

-- ---------- private storage for progress photos ----------
insert into storage.buckets (id, name, public) values ('progress-photos', 'progress-photos', false) on conflict (id) do nothing;
do $$ begin
  drop policy if exists "own progress photos read" on storage.objects;
  create policy "own progress photos read" on storage.objects for select using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);
  drop policy if exists "own progress photos write" on storage.objects;
  create policy "own progress photos write" on storage.objects for insert with check (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);
  drop policy if exists "own progress photos update" on storage.objects;
  create policy "own progress photos update" on storage.objects for update using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);
  drop policy if exists "own progress photos delete" on storage.objects;
  create policy "own progress photos delete" on storage.objects for delete using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);
end $$;
