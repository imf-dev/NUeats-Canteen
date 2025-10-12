-- Fix the admin policy for order_cancellations to match the app's admin check pattern

-- Drop the incorrect admin policy
DROP POLICY IF EXISTS order_cancellations_admin_select ON public.order_cancellations;

-- Create the correct admin policy that checks user_metadata.role
CREATE POLICY order_cancellations_admin_select ON public.order_cancellations
FOR SELECT TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Also add policies for admins to insert, update, and delete (for full admin control)
DROP POLICY IF EXISTS order_cancellations_admin_insert ON public.order_cancellations;
CREATE POLICY order_cancellations_admin_insert ON public.order_cancellations
FOR INSERT TO authenticated
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

DROP POLICY IF EXISTS order_cancellations_admin_update ON public.order_cancellations;
CREATE POLICY order_cancellations_admin_update ON public.order_cancellations
FOR UPDATE TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

DROP POLICY IF EXISTS order_cancellations_admin_delete ON public.order_cancellations;
CREATE POLICY order_cancellations_admin_delete ON public.order_cancellations
FOR DELETE TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'order_cancellations'
ORDER BY policyname;

