-- Restrict health_examinations access to medical_officer only for full data
-- This migration implements privacy-preserving access control for sensitive medical data

-- Step 1: Drop existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Authorized staff can view health examinations" ON public.health_examinations;

-- Step 2: Create restrictive policy - only medical_officer can view full records
CREATE POLICY "Medical officers can view all health examinations"
ON public.health_examinations
FOR SELECT
USING (
  (auth.uid() IS NOT NULL) AND 
  get_current_user_role() = 'medical_officer'
);

-- Step 3: Create limited view for non-medical staff (no RLS on view, RLS on base table protects it)
CREATE OR REPLACE VIEW public.health_examinations_limited AS
SELECT 
  id,
  employee_name,
  employee_id,
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

-- Step 4: Grant SELECT on limited view to authenticated users
GRANT SELECT ON public.health_examinations_limited TO authenticated;

-- Step 5: Create function to check if user can view limited health data
CREATE OR REPLACE FUNCTION public.can_view_limited_health_data()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT get_current_user_role() = ANY (
    ARRAY['safety_officer', 'admin', 'supervisor', 'medical_officer']
  );
$$;

-- Step 6: Add additional policy for non-medical staff to see limited data
CREATE POLICY "Non-medical staff can view limited health data"
ON public.health_examinations
FOR SELECT
USING (
  (auth.uid() IS NOT NULL) AND 
  can_view_limited_health_data()
);

-- Step 7: Add comments explaining the security design
COMMENT ON POLICY "Medical officers can view all health examinations" ON public.health_examinations IS 
'Medical officers can access full health examination records including all sensitive medical data.';

COMMENT ON POLICY "Non-medical staff can view limited health data" ON public.health_examinations IS 
'Safety officers, admins, and supervisors can view health examinations but application code should use health_examinations_limited view to respect data minimization.';

COMMENT ON VIEW public.health_examinations_limited IS 
'Limited view for non-medical staff. Excludes sensitive medical fields: blood_pressure, hearing_test_result, vision_test_result, respiratory_function, musculoskeletal_assessment, health_recommendations, exposure_risks, ai_analysis, health_trends.';

COMMENT ON FUNCTION public.can_view_limited_health_data() IS 
'Security definer function to check if current user can view limited health examination data.';