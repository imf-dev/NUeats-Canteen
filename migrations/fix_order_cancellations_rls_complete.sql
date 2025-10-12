-- Fix RLS policies for order_cancellations table
-- Admins can see all cancellations, users can see their own

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

-- SELECT policies: Admins can see all, users can see their own
CREATE POLICY "admin_select_all_cancellations" ON public.order_cancellations
FOR SELECT TO authenticated
USING (is_admin());

CREATE POLICY "users_select_own_cancellations" ON public.order_cancellations
FOR SELECT TO authenticated
USING (user_id = auth.uid() AND NOT is_admin());

-- INSERT policies: Admins can insert any, users can insert their own
CREATE POLICY "admin_insert_cancellations" ON public.order_cancellations
FOR INSERT TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "users_insert_own_cancellations" ON public.order_cancellations
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND NOT is_admin());

-- UPDATE policies: Admins can update any, users can update their own
CREATE POLICY "admin_update_cancellations" ON public.order_cancellations
FOR UPDATE TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "users_update_own_cancellations" ON public.order_cancellations
FOR UPDATE TO authenticated
USING (user_id = auth.uid() AND NOT is_admin())
WITH CHECK (user_id = auth.uid() AND NOT is_admin());

-- DELETE policies: Admins can delete any, users can delete their own
CREATE POLICY "admin_delete_cancellations" ON public.order_cancellations
FOR DELETE TO authenticated
USING (is_admin());

CREATE POLICY "users_delete_own_cancellations" ON public.order_cancellations
FOR DELETE TO authenticated
USING (user_id = auth.uid() AND NOT is_admin());

-- Show the new policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'order_cancellations'
ORDER BY policyname;
