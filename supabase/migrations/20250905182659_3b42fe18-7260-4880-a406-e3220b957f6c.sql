-- Create a security definer function to get current user role to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.user_profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Fix incidents table RLS policies
DROP POLICY IF EXISTS "Users can view all incidents" ON public.incidents CASCADE;
DROP POLICY IF EXISTS "Users can insert incidents" ON public.incidents CASCADE;
DROP POLICY IF EXISTS "Users can update incidents" ON public.incidents CASCADE;
DROP POLICY IF EXISTS "Users can delete incidents" ON public.incidents CASCADE;

CREATE POLICY "Safety officers and admins can view all incidents" 
ON public.incidents 
FOR SELECT 
TO authenticated
USING (public.get_current_user_role() IN ('safety_officer', 'admin', 'supervisor'));

CREATE POLICY "Safety officers and admins can insert incidents" 
ON public.incidents 
FOR INSERT 
TO authenticated
WITH CHECK (public.get_current_user_role() IN ('safety_officer', 'admin', 'supervisor'));

CREATE POLICY "Safety officers and admins can update incidents" 
ON public.incidents 
FOR UPDATE 
TO authenticated
USING (public.get_current_user_role() IN ('safety_officer', 'admin', 'supervisor'));

CREATE POLICY "Safety officers and admins can delete incidents" 
ON public.incidents 
FOR DELETE 
TO authenticated
USING (public.get_current_user_role() IN ('safety_officer', 'admin'));

-- Fix ergonomic_assessments table RLS policies
DROP POLICY IF EXISTS "Users can view all ergonomic assessments" ON public.ergonomic_assessments CASCADE;
DROP POLICY IF EXISTS "Users can insert ergonomic assessments" ON public.ergonomic_assessments CASCADE;
DROP POLICY IF EXISTS "Users can update ergonomic assessments" ON public.ergonomic_assessments CASCADE;
DROP POLICY IF EXISTS "Users can delete ergonomic assessments" ON public.ergonomic_assessments CASCADE;

CREATE POLICY "Safety officers and admins can view all ergonomic assessments" 
ON public.ergonomic_assessments 
FOR SELECT 
TO authenticated
USING (public.get_current_user_role() IN ('safety_officer', 'admin', 'supervisor'));

CREATE POLICY "Safety officers and admins can insert ergonomic assessments" 
ON public.ergonomic_assessments 
FOR INSERT 
TO authenticated
WITH CHECK (public.get_current_user_role() IN ('safety_officer', 'admin', 'supervisor'));

CREATE POLICY "Safety officers and admins can update ergonomic assessments" 
ON public.ergonomic_assessments 
FOR UPDATE 
TO authenticated
USING (public.get_current_user_role() IN ('safety_officer', 'admin', 'supervisor'));

CREATE POLICY "Safety officers and admins can delete ergonomic assessments" 
ON public.ergonomic_assessments 
FOR DELETE 
TO authenticated
USING (public.get_current_user_role() IN ('safety_officer', 'admin'));

-- Fix daily_reports table RLS policies
DROP POLICY IF EXISTS "Users can view all daily reports" ON public.daily_reports CASCADE;
DROP POLICY IF EXISTS "Users can insert daily reports" ON public.daily_reports CASCADE;
DROP POLICY IF EXISTS "Users can update daily reports" ON public.daily_reports CASCADE;
DROP POLICY IF EXISTS "Users can delete daily reports" ON public.daily_reports CASCADE;

CREATE POLICY "Safety officers and admins can view all daily reports" 
ON public.daily_reports 
FOR SELECT 
TO authenticated
USING (public.get_current_user_role() IN ('safety_officer', 'admin', 'supervisor'));

CREATE POLICY "Safety officers and admins can insert daily reports" 
ON public.daily_reports 
FOR INSERT 
TO authenticated
WITH CHECK (public.get_current_user_role() IN ('safety_officer', 'admin', 'supervisor'));

CREATE POLICY "Safety officers and admins can update daily reports" 
ON public.daily_reports 
FOR UPDATE 
TO authenticated
USING (public.get_current_user_role() IN ('safety_officer', 'admin', 'supervisor'));

CREATE POLICY "Safety officers and admins can delete daily reports" 
ON public.daily_reports 
FOR DELETE 
TO authenticated
USING (public.get_current_user_role() IN ('safety_officer', 'admin'));

-- Fix risk_assessments table RLS policies
DROP POLICY IF EXISTS "Users can view all risk assessments" ON public.risk_assessments CASCADE;
DROP POLICY IF EXISTS "Users can insert risk assessments" ON public.risk_assessments CASCADE;
DROP POLICY IF EXISTS "Users can update risk assessments" ON public.risk_assessments CASCADE;
DROP POLICY IF EXISTS "Users can delete risk assessments" ON public.risk_assessments CASCADE;

CREATE POLICY "Safety officers and admins can view all risk assessments" 
ON public.risk_assessments 
FOR SELECT 
TO authenticated
USING (public.get_current_user_role() IN ('safety_officer', 'admin', 'supervisor'));

CREATE POLICY "Safety officers and admins can insert risk assessments" 
ON public.risk_assessments 
FOR INSERT 
TO authenticated
WITH CHECK (public.get_current_user_role() IN ('safety_officer', 'admin', 'supervisor'));

CREATE POLICY "Safety officers and admins can update risk assessments" 
ON public.risk_assessments 
FOR UPDATE 
TO authenticated
USING (public.get_current_user_role() IN ('safety_officer', 'admin', 'supervisor'));

CREATE POLICY "Safety officers and admins can delete risk assessments" 
ON public.risk_assessments 
FOR DELETE 
TO authenticated
USING (public.get_current_user_role() IN ('safety_officer', 'admin'));

-- Fix work_permits table RLS policies
DROP POLICY IF EXISTS "Users can view all work permits" ON public.work_permits CASCADE;
DROP POLICY IF EXISTS "Users can insert work permits" ON public.work_permits CASCADE;
DROP POLICY IF EXISTS "Users can update work permits" ON public.work_permits CASCADE;
DROP POLICY IF EXISTS "Users can delete work permits" ON public.work_permits CASCADE;

CREATE POLICY "Safety officers and admins can view all work permits" 
ON public.work_permits 
FOR SELECT 
TO authenticated
USING (public.get_current_user_role() IN ('safety_officer', 'admin', 'supervisor'));

CREATE POLICY "Safety officers and admins can insert work permits" 
ON public.work_permits 
FOR INSERT 
TO authenticated
WITH CHECK (public.get_current_user_role() IN ('safety_officer', 'admin', 'supervisor'));

CREATE POLICY "Safety officers and admins can update work permits" 
ON public.work_permits 
FOR UPDATE 
TO authenticated
USING (public.get_current_user_role() IN ('safety_officer', 'admin', 'supervisor'));

CREATE POLICY "Safety officers and admins can delete work permits" 
ON public.work_permits 
FOR DELETE 
TO authenticated
USING (public.get_current_user_role() IN ('safety_officer', 'admin'));