-- Fix security vulnerabilities by strengthening RLS policies for sensitive data

-- 1. Strengthen user_profiles policies to explicitly require authentication
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.user_profiles;

-- Create more secure policies for user_profiles that explicitly check authentication
CREATE POLICY "Authenticated users can view their own profile" 
ON public.user_profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert their own profile" 
ON public.user_profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update their own profile" 
ON public.user_profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Only allow admins to delete profiles to prevent data loss
CREATE POLICY "Admins can delete user profiles" 
ON public.user_profiles 
FOR DELETE 
TO authenticated
USING (get_current_user_role() = 'admin' AND auth.uid() IS NOT NULL);

-- Admin users can view all profiles for user management
CREATE POLICY "Admins can view all user profiles" 
ON public.user_profiles 
FOR SELECT 
TO authenticated
USING (get_current_user_role() = 'admin' AND auth.uid() IS NOT NULL);

-- 2. Strengthen policies for ergonomic_assessments to add explicit authentication checks
DROP POLICY IF EXISTS "Safety officers and admins can view all ergonomic assessments" ON public.ergonomic_assessments;
DROP POLICY IF EXISTS "Safety officers and admins can insert ergonomic assessments" ON public.ergonomic_assessments;
DROP POLICY IF EXISTS "Safety officers and admins can update ergonomic assessments" ON public.ergonomic_assessments;
DROP POLICY IF EXISTS "Safety officers and admins can delete ergonomic assessments" ON public.ergonomic_assessments;

CREATE POLICY "Authorized staff can view ergonomic assessments" 
ON public.ergonomic_assessments 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = ANY (ARRAY['safety_officer'::text, 'admin'::text, 'supervisor'::text])
);

CREATE POLICY "Authorized staff can insert ergonomic assessments" 
ON public.ergonomic_assessments 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = ANY (ARRAY['safety_officer'::text, 'admin'::text, 'supervisor'::text])
);

CREATE POLICY "Authorized staff can update ergonomic assessments" 
ON public.ergonomic_assessments 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = ANY (ARRAY['safety_officer'::text, 'admin'::text, 'supervisor'::text])
);

CREATE POLICY "Admins can delete ergonomic assessments" 
ON public.ergonomic_assessments 
FOR DELETE 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
);

-- 3. Strengthen policies for incidents to add explicit authentication checks
DROP POLICY IF EXISTS "Safety officers and admins can view all incidents" ON public.incidents;
DROP POLICY IF EXISTS "Safety officers and admins can insert incidents" ON public.incidents;
DROP POLICY IF EXISTS "Safety officers and admins can update incidents" ON public.incidents;
DROP POLICY IF EXISTS "Safety officers and admins can delete incidents" ON public.incidents;

CREATE POLICY "Authorized staff can view incidents" 
ON public.incidents 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = ANY (ARRAY['safety_officer'::text, 'admin'::text, 'supervisor'::text])
);

CREATE POLICY "Authorized staff can insert incidents" 
ON public.incidents 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = ANY (ARRAY['safety_officer'::text, 'admin'::text, 'supervisor'::text])
);

CREATE POLICY "Authorized staff can update incidents" 
ON public.incidents 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = ANY (ARRAY['safety_officer'::text, 'admin'::text, 'supervisor'::text])
);

CREATE POLICY "Admins can delete incidents" 
ON public.incidents 
FOR DELETE 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
);

-- 4. Strengthen get_current_user_role function to handle edge cases
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT COALESCE(
    (SELECT role FROM public.user_profiles WHERE user_id = auth.uid() AND auth.uid() IS NOT NULL),
    'unauthorized'
  );
$function$;