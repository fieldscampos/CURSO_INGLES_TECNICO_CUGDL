-- Supabase/PostgreSQL schema para Curso Python GDG Guadalajara x CUGDL

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key,
  email text unique not null,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

create table if not exists public.pre_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  status text not null default 'pending_questionnaire',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id)
);

drop trigger if exists trg_pre_registrations_updated_at on public.pre_registrations;
create trigger trg_pre_registrations_updated_at
before update on public.pre_registrations
for each row
execute function public.set_updated_at();

create table if not exists public.questionnaire_questions (
  id int primary key,
  text text not null,
  answer_type text not null default 'texto_libre',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists trg_questionnaire_questions_updated_at on public.questionnaire_questions;
create trigger trg_questionnaire_questions_updated_at
before update on public.questionnaire_questions
for each row
execute function public.set_updated_at();

create table if not exists public.questionnaire_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  question_id int not null references public.questionnaire_questions(id),
  answer text not null,
  created_at timestamptz default now(),
  unique (user_id, question_id)
);

create index if not exists idx_pre_registrations_user_id on public.pre_registrations(user_id);
create index if not exists idx_responses_user_id on public.questionnaire_responses(user_id);
create index if not exists idx_responses_question_id on public.questionnaire_responses(question_id);

-- RLS base
alter table public.users enable row level security;
alter table public.pre_registrations enable row level security;
alter table public.questionnaire_questions enable row level security;
alter table public.questionnaire_responses enable row level security;

-- Si el backend usa SERVICE_ROLE, bypass de RLS sucede por defecto.
-- Estas políticas permiten lectura pública limitada de preguntas y
-- autogestión por usuario autenticado si en el futuro se usa auth de Supabase.

drop policy if exists questions_public_read on public.questionnaire_questions;
create policy questions_public_read
on public.questionnaire_questions
for select
to anon, authenticated
using (true);

drop policy if exists users_self_access on public.users;
create policy users_self_access
on public.users
for all
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists prereg_self_access on public.pre_registrations;
create policy prereg_self_access
on public.pre_registrations
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists responses_self_access on public.questionnaire_responses;
create policy responses_self_access
on public.questionnaire_responses
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create table if not exists public.course_satisfaction_surveys (
  id uuid primary key default gen_random_uuid(),
  pre_registration_id uuid references public.pre_registrations(id) on delete set null,
  institutional_email text not null unique,
  overall_satisfaction smallint not null check (overall_satisfaction between 1 and 5),
  content_clarity smallint not null check (content_clarity between 1 and 5),
  teaching_quality smallint not null check (teaching_quality between 1 and 5),
  exercises_usefulness smallint not null check (exercises_usefulness between 1 and 5),
  pace_balance smallint not null check (pace_balance between 1 and 5),
  recommendation_likelihood smallint not null check (recommendation_likelihood between 1 and 5),
  liked_most text not null,
  improvement_suggestions text not null,
  proposed_courses text not null,
  proposed_projects text not null,
  wants_organization_participation boolean not null default false,
  organization_support_areas text,
  organization_availability text,
  final_comments text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_course_satisfaction_surveys_pre_registration_id
  on public.course_satisfaction_surveys(pre_registration_id);

drop trigger if exists trg_course_satisfaction_surveys_updated_at on public.course_satisfaction_surveys;
create trigger trg_course_satisfaction_surveys_updated_at
before update on public.course_satisfaction_surveys
for each row
execute function public.set_updated_at();

alter table public.course_satisfaction_surveys enable row level security;
