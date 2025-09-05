-- Drop existing overly permissive RLS policies
DROP POLICY IF EXISTS "Users can delete profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view all data" ON public.user_profiles;

-- Create secure RLS policies that restrict access to authenticated users and their own data
CREATE POLICY "Users can view their own profile" 
ON public.user_profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.user_profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" 
ON public.user_profiles 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Optional: Allow admins to view all profiles (uncomment if needed)
-- CREATE POLICY "Admins can view all profiles" 
-- ON public.user_profiles 
-- FOR SELECT 
-- TO authenticated
-- USING (
--   EXISTS (
--     SELECT 1 FROM public.user_profiles 
--     WHERE user_id = auth.uid() 
--     AND role = 'admin'
--   )
-- );