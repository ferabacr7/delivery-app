-- Session 10
-- Refactor quotes table from amount to subtotal/delivery_fee/total

alter table public.quotes
add column if not exists subtotal numeric(10,2),
add column if not exists delivery_fee numeric(10,2),
add column if not exists total numeric(10,2);

update public.quotes
set
  subtotal = coalesce(amount, 0),
  delivery_fee = 0,
  total = coalesce(amount, 0)
where subtotal is null
   or delivery_fee is null
   or total is null;

alter table public.quotes
drop column if exists amount;