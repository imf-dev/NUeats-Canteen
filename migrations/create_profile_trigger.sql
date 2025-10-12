-- Create trigger to automatically create profile for new users
-- This trigger runs after a new user is inserted into auth.users

-- First, create a function that will be called by the trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    display_name,
    role,
    email,
    phone,
    created_at,
    avatar_url,
    is_suspended,
    security_settings
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')::role_type,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NOW(),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    false,
    COALESCE(NEW.raw_user_meta_data->'security_settings', '{}'::jsonb)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.profiles TO postgres, anon, authenticated, service_role;
