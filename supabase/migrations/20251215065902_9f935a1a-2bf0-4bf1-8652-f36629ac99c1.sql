-- ==============================================
-- FIX 1: user_profiles - restrict by organization
-- ==============================================

-- Drop the existing policy that allows viewing all profiles without org restriction
DROP POLICY IF EXISTS "Admins and developers can view all user profiles" ON public.user_profiles;

-- Create new policy that restricts admins/developers to their organization only
CREATE POLICY "Admins and developers can view organization profiles" 
ON public.user_profiles 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) AND 
  (get_current_user_role() = ANY (ARRAY['admin'::text, 'developer'::text])) AND
  (organization_id = get_user_organization() OR organization_id IS NULL)
);

-- ==============================================
-- FIX 2: health_examinations - fix the can_view_limited_health_data function
-- This function currently allows non-medical staff to access full health data
-- We need to update it so non-medical staff can ONLY access the limited view
-- ==============================================

-- Update the function to exclude medical_officer (they have their own policy for full access)
-- This function is used for LIMITED data access only
CREATE OR REPLACE FUNCTION public.can_view_limited_health_data()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT get_current_user_role() = ANY (
    ARRAY['safety_officer', 'admin', 'supervisor']
  );
$function$;

-- ==============================================
-- FIX 3: health_examinations_limited - add RLS policies
-- This is a VIEW, not a table, so we need to handle it differently
-- Views inherit security from underlying tables
-- But we should ensure proper access control
-- ==============================================

-- First, let's check if RLS is enabled on the view (views don't support RLS directly)
-- The view already selects from health_examinations which has RLS
-- We need to modify client code to use this view for non-medical staff

-- No migration needed for the view - it inherits from health_examinations table
-- The issue is that non-medical staff should query health_examinations_limited view
-- not the health_examinations table directly

-- Actually, let's ensure the view is properly secured by recreating it with proper security
DROP VIEW IF EXISTS public.health_examinations_limited;

CREATE VIEW public.health_examinations_limited 
WITH (security_invoker = true)
AS SELECT 
  id,
  employee_id,
  employee_name,
  department,
  position,
  examination_date,
  examination_type,
  examiner_name,
  fitness_for_work,
  next_examination_date,
  status,
  created_at,
  updated_at
FROM public.health_examinations;

-- Grant access to the view
GRANT SELECT ON public.health_examinations_limited TO authenticated;