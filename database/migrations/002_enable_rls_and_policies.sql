-- =====================================================
-- DELIVERY APP
-- Migration: 002_enable_rls_and_policies.sql
-- =====================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
DROP POLICY IF EXISTS "Users can read their own profile"
ON public.profiles;

CREATE POLICY "Users can read their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
    auth.uid() = id
);

-- Policy: Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile"
ON public.profiles;

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = id
);

-- Policy: Users can update their own profile
DROP POLICY IF EXISTS "Users can update their own profile"
ON public.profiles;

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
    auth.uid() = id
)
WITH CHECK (
    auth.uid() = id
);

-- =====================================================
-- ADDRESSES POLICIES
-- =====================================================

ALTER TABLE public.addresses
ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their own addresses"
ON public.addresses;

CREATE POLICY "Users can read their own addresses"
ON public.addresses
FOR SELECT
TO authenticated
USING (
    auth.uid() = profile_id
);

DROP POLICY IF EXISTS "Users can insert their own addresses"
ON public.addresses;

CREATE POLICY "Users can insert their own addresses"
ON public.addresses
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = profile_id
);

DROP POLICY IF EXISTS "Users can update their own addresses"
ON public.addresses;

CREATE POLICY "Users can update their own addresses"
ON public.addresses
FOR UPDATE
TO authenticated
USING (
    auth.uid() = profile_id
)
WITH CHECK (
    auth.uid() = profile_id
);

DROP POLICY IF EXISTS "Users can delete their own addresses"
ON public.addresses;

CREATE POLICY "Users can delete their own addresses"
ON public.addresses
FOR DELETE
TO authenticated
USING (
    auth.uid() = profile_id
);

-- =====================================================
-- ORDERS POLICIES
-- =====================================================

ALTER TABLE public.orders
ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their own orders"
ON public.orders;

CREATE POLICY "Users can read their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
    auth.uid() = profile_id
);

DROP POLICY IF EXISTS "Users can insert their own orders"
ON public.orders;

CREATE POLICY "Users can insert their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = profile_id
);

DROP POLICY IF EXISTS "Users can update their own orders"
ON public.orders;

CREATE POLICY "Users can update their own orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (
    auth.uid() = profile_id
)
WITH CHECK (
    auth.uid() = profile_id
);

-- =====================================================
-- QUOTES POLICIES
-- =====================================================

ALTER TABLE public.quotes
ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read quotes for their own orders"
ON public.quotes;

CREATE POLICY "Users can read quotes for their own orders"
ON public.quotes
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.orders
        WHERE orders.id = quotes.order_id
        AND orders.profile_id = auth.uid()
    )
);

-- =====================================================
-- DELIVERIES POLICIES
-- =====================================================

ALTER TABLE public.deliveries
ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read deliveries for their own orders"
ON public.deliveries;

CREATE POLICY "Users can read deliveries for their own orders"
ON public.deliveries
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.orders
        WHERE orders.id = deliveries.order_id
        AND orders.profile_id = auth.uid()
    )
);