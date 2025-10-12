-- Fix RLS policies for order_cancellations table using is_admin() function
-- This should allow admins to view all cancellation records

-- First, let's see what policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'order_cancellations';

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "order_cancellations_insert_own" ON public.order_cancellations;
DROP POLICY IF EXISTS "order_cancellations_select_own" ON public.order_cancellations;
DROP POLICY IF EXISTS "order_cancellations_admin_select" ON public.order_cancellations;
DROP POLICY IF EXISTS "Admins can view all order cancellations" ON public.order_cancellations;
DROP POLICY IF EXISTS "Admins can insert order cancellations" ON public.order_cancellations;
DROP POLICY IF EXISTS "Admins can update order cancellations" ON public.order_cancellations;
DROP POLICY IF EXISTS "Admins can delete order cancellations" ON public.order_cancellations;
DROP POLICY IF EXISTS "admin_select_all_cancellations" ON public.order_cancellations;
DROP POLICY IF EXISTS "admin_insert_cancellations" ON public.order_cancellations;
DROP POLICY IF EXISTS "admin_update_cancellations" ON public.order_cancellations;
DROP POLICY IF EXISTS "admin_delete_cancellations" ON public.order_cancellations;

-- Create policies using the is_admin() function
CREATE POLICY "admin_select_all_cancellations" ON public.order_cancellations
FOR SELECT TO authenticated
USING (is_admin());

CREATE POLICY "admin_insert_cancellations" ON public.order_cancellations
FOR INSERT TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "admin_update_cancellations" ON public.order_cancellations
FOR UPDATE TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "admin_delete_cancellations" ON public.order_cancellations
FOR DELETE TO authenticated
USING (is_admin());

-- Show the new policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'order_cancellations'
ORDER BY policyname;
