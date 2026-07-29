-- Create course_satisfaction_surveys table for course feedback submissions

create extension if not exists pgcrypto;

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
