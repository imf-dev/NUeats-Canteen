-- Add admin SELECT policy for order_cancellations
-- This allows admins to view all cancellation records

DROP POLICY IF EXISTS order_cancellations_admin_select ON public.order_cancellations;

CREATE POLICY order_cancellations_admin_select ON public.order_cancellations
FOR SELECT TO authenticated
USING ((auth.jwt() ->> 'is_admin')::boolean IS TRUE);

