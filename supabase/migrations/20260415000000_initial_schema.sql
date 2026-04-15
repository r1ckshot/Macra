-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users profile (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  goal_kcal integer not null default 2000,
  goal_protein_g integer not null default 150,
  goal_fat_g integer not null default 65,
  goal_carbs_g integer not null default 250,
  weight_kg numeric(5,2),
  height_cm integer,
  age integer,
  activity_level text check (activity_level in ('sedentary','light','moderate','active','very_active')),
  settings jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products (global + custom per user)
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  name text not null,
  brand text,
  barcode text,
  kcal_per_100g numeric(7,2) not null,
  protein_g numeric(6,2) not null default 0,
  fat_g numeric(6,2) not null default 0,
  carbs_g numeric(6,2) not null default 0,
  vitamins jsonb not null default '{}',
  is_custom boolean not null default false,
  source text not null default 'custom' check (source in ('open_food_facts','custom')),
  created_at timestamptz not null default now()
);

-- Diary days
create table public.diary_days (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  date date not null,
  carryover_kcal integer not null default 0,
  water_ml integer not null default 0,
  created_at timestamptz not null default now(),
  unique(user_id, date)
);

-- Meals
create table public.meals (
  id uuid primary key default uuid_generate_v4(),
  diary_day_id uuid references public.diary_days(id) on delete cascade not null,
  meal_type text not null check (meal_type in ('breakfast','lunch','dinner','snack_1','snack_2','snack_3')),
  logged_at timestamptz not null default now()
);

-- Food entries
create table public.food_entries (
  id uuid primary key default uuid_generate_v4(),
  meal_id uuid references public.meals(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete restrict not null,
  amount_g numeric(7,2) not null,
  unit text not null default 'g',
  kcal numeric(7,2) not null,
  protein_g numeric(6,2) not null,
  fat_g numeric(6,2) not null,
  carbs_g numeric(6,2) not null,
  created_at timestamptz not null default now()
);

-- Body measurements
create table public.body_measurements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  date date not null,
  weight_kg numeric(5,2),
  body_fat_pct numeric(4,1),
  chest_cm numeric(5,1),
  waist_cm numeric(5,1),
  hips_cm numeric(5,1),
  arms_cm numeric(5,1),
  legs_cm numeric(5,1),
  created_at timestamptz not null default now()
);

-- Indexes
create index on public.diary_days(user_id, date);
create index on public.meals(diary_day_id);
create index on public.food_entries(meal_id);
create index on public.products(user_id);
create index on public.products(barcode) where barcode is not null;
create index on public.body_measurements(user_id, date);

-- RLS: enable on all tables
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.diary_days enable row level security;
alter table public.meals enable row level security;
alter table public.food_entries enable row level security;
alter table public.body_measurements enable row level security;

-- RLS policies: users
create policy "Users can view own profile"
  on public.users for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.users for insert with check (auth.uid() = id);

-- RLS policies: products (own + global)
create policy "Users can view global and own products"
  on public.products for select using (user_id is null or auth.uid() = user_id);
create policy "Users can insert own products"
  on public.products for insert with check (auth.uid() = user_id);
create policy "Users can update own products"
  on public.products for update using (auth.uid() = user_id);
create policy "Users can delete own products"
  on public.products for delete using (auth.uid() = user_id);

-- RLS policies: diary_days
create policy "Users can manage own diary days"
  on public.diary_days for all using (auth.uid() = user_id);

-- RLS policies: meals (via diary_days)
create policy "Users can manage own meals"
  on public.meals for all using (
    exists (
      select 1 from public.diary_days
      where id = meals.diary_day_id and user_id = auth.uid()
    )
  );

-- RLS policies: food_entries (via meals → diary_days)
create policy "Users can manage own food entries"
  on public.food_entries for all using (
    exists (
      select 1 from public.meals m
      join public.diary_days d on d.id = m.diary_day_id
      where m.id = food_entries.meal_id and d.user_id = auth.uid()
    )
  );

-- RLS policies: body_measurements
create policy "Users can manage own measurements"
  on public.body_measurements for all using (auth.uid() = user_id);

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.users (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
