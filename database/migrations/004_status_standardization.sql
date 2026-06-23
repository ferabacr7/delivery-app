-- Session 10
-- Standardize workflow statuses

alter table public.orders
drop constraint if exists orders_status_check;

alter table public.quotes
drop constraint if exists quotes_status_check;

alter table public.deliveries
drop constraint if exists deliveries_status_check;

update public.orders
set status = upper(trim(status));

update public.quotes
set status = upper(trim(status));

update public.deliveries
set status = upper(trim(status));

alter table public.orders
add constraint orders_status_check
check (
  status in (
    'PENDING',
    'QUOTED',
    'ACCEPTED',
    'REJECTED',
    'IN_PROGRESS',
    'ON_ROUTE',
    'DELIVERED',
    'CANCELLED'
  )
);

alter table public.quotes
add constraint quotes_status_check
check (
  status in (
    'PENDING',
    'ACCEPTED',
    'REJECTED',
    'EXPIRED'
  )
);

alter table public.deliveries
add constraint deliveries_status_check
check (
  status in (
    'PENDING',
    'IN_PROGRESS',
    'ON_ROUTE',
    'DELIVERED',
    'CANCELLED'
  )
);