-- ==========================================
-- 005_structured_quotes.sql
-- Refactor del modelo de cotizaciones
-- Agrega información estructurada al dominio
-- ==========================================

alter table public.quotes
add column if not exists service_type text,
add column if not exists zone text,
add column if not exists estimated_distance_km numeric(10,2),
add column if not exists quote_source text default 'AUTO',
add column if not exists calculation_version integer default 1,
add column if not exists customer_message text,
add column if not exists internal_notes text;