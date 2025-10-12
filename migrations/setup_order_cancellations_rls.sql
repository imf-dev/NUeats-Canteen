-- Setup RLS policies for order_cancellations table
-- Allows admins to read all cancellation records

-- Enable RLS on order_cancellations table
ALTER TABLE order_cancellations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all order cancellations" ON order_cancellations;
DROP POLICY IF EXISTS "Admins can insert order cancellations" ON order_cancellations;
DROP POLICY IF EXISTS "Admins can update order cancellations" ON order_cancellations;
DROP POLICY IF EXISTS "Admins can delete order cancellations" ON order_cancellations;

-- Allow admins to view all order cancellations
CREATE POLICY "Admins can view all order cancellations"
ON order_cancellations
FOR SELECT
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Allow admins to insert order cancellations
CREATE POLICY "Admins can insert order cancellations"
ON order_cancellations
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Allow admins to update order cancellations
CREATE POLICY "Admins can update order cancellations"
ON order_cancellations
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Allow admins to delete order cancellations
CREATE POLICY "Admins can delete order cancellations"
ON order_cancellations
FOR DELETE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Grant usage to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON order_cancellations TO authenticated;

-- Show the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'order_cancellations';

