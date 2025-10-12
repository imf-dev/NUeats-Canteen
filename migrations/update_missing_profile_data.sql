-- Function to update existing profiles with missing email and phone data
-- This function will sync data from auth.users to profiles table

CREATE OR REPLACE FUNCTION public.update_missing_profile_data()
RETURNS TABLE(
  updated_count INTEGER,
  missing_email_count INTEGER,
  missing_phone_count INTEGER,
  total_profiles INTEGER
) AS $$
DECLARE
  email_updates INTEGER := 0;
  phone_updates INTEGER := 0;
  missing_emails INTEGER := 0;
  missing_phones INTEGER := 0;
  total_count INTEGER := 0;
BEGIN
  -- Count total profiles
  SELECT COUNT(*) INTO total_count FROM public.profiles;
  
  -- Count missing emails and phones
  SELECT COUNT(*) INTO missing_emails 
  FROM public.profiles p 
  WHERE p.email IS NULL OR p.email = '';
  
  SELECT COUNT(*) INTO missing_phones 
  FROM public.profiles p 
  WHERE p.phone IS NULL OR p.phone = '';
  
  -- Update missing emails from auth.users
  UPDATE public.profiles 
  SET 
    email = au.email
  FROM auth.users au
  WHERE profiles.id = au.id 
    AND (profiles.email IS NULL OR profiles.email = '')
    AND au.email IS NOT NULL;
  
  GET DIAGNOSTICS email_updates = ROW_COUNT;
  
  -- Update missing phones from auth.users metadata
  UPDATE public.profiles 
  SET 
    phone = COALESCE(au.raw_user_meta_data->>'phone', '')
  FROM auth.users au
  WHERE profiles.id = au.id 
    AND (profiles.phone IS NULL OR profiles.phone = '')
    AND au.raw_user_meta_data->>'phone' IS NOT NULL
    AND au.raw_user_meta_data->>'phone' != '';
  
  GET DIAGNOSTICS phone_updates = ROW_COUNT;
  
  -- Return statistics
  RETURN QUERY SELECT 
    email_updates + phone_updates as updated_count,
    missing_emails as missing_email_count,
    missing_phones as missing_phone_count,
    total_count as total_profiles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.update_missing_profile_data() TO postgres, service_role;

-- Also create a simpler function to just get statistics without updating
CREATE OR REPLACE FUNCTION public.get_profile_data_stats()
RETURNS TABLE(
  total_profiles INTEGER,
  profiles_with_email INTEGER,
  profiles_with_phone INTEGER,
  profiles_missing_email INTEGER,
  profiles_missing_phone INTEGER,
  profiles_missing_both INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_profiles,
    COUNT(CASE WHEN email IS NOT NULL AND email != '' THEN 1 END)::INTEGER as profiles_with_email,
    COUNT(CASE WHEN phone IS NOT NULL AND phone != '' THEN 1 END)::INTEGER as profiles_with_phone,
    COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END)::INTEGER as profiles_missing_email,
    COUNT(CASE WHEN phone IS NULL OR phone = '' THEN 1 END)::INTEGER as profiles_missing_phone,
    COUNT(CASE WHEN (email IS NULL OR email = '') AND (phone IS NULL OR phone = '') THEN 1 END)::INTEGER as profiles_missing_both
  FROM public.profiles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_profile_data_stats() TO postgres, service_role;
