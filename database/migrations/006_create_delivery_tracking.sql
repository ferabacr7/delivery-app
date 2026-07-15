create table public.delivery_tracking (
  id uuid primary key default gen_random_uuid(),

  delivery_id uuid not null
    references public.deliveries(id)
    on delete cascade,

  latitude double precision not null,

  longitude double precision not null,

  heading real,

  speed real,

  accuracy real,

  recorded_at timestamptz not null default now(),

  created_at timestamptz not null default now()
);

create index delivery_tracking_delivery_id_idx
on public.delivery_tracking(delivery_id);

create index delivery_tracking_delivery_recorded_at_idx
on public.delivery_tracking(delivery_id, recorded_at desc);

alter table public.delivery_tracking
enable row level security;

create policy "Authenticated users can read delivery tracking"
on public.delivery_tracking
for select
to authenticated
using (true);

create policy "Authenticated users can insert delivery tracking"
on public.delivery_tracking
for insert
to authenticated
with check (true);

alter publication supabase_realtime
add table public.delivery_tracking;