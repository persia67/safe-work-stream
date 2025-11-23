-- Create organizations table for multi-tenancy
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Add organization_id to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

-- Add organization_id to all data tables
ALTER TABLE public.safety_trainings 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

ALTER TABLE public.health_examinations 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

ALTER TABLE public.incidents 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

ALTER TABLE public.risk_assessments 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

ALTER TABLE public.ergonomic_assessments 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

ALTER TABLE public.daily_reports 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

ALTER TABLE public.work_permits 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

-- Create function to get user's organization
CREATE OR REPLACE FUNCTION public.get_user_organization()
RETURNS UUID
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id 
  FROM public.user_profiles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
$$;

-- RLS policies for organizations
CREATE POLICY "Users can view their organization"
ON public.organizations FOR SELECT
USING (id = get_user_organization());

-- Update RLS policies for safety_trainings
DROP POLICY IF EXISTS "Authorized staff can view safety trainings" ON public.safety_trainings;
CREATE POLICY "Authorized staff can view safety trainings"
ON public.safety_trainings FOR SELECT
USING (
  (auth.uid() IS NOT NULL) AND 
  (has_role(auth.uid(), 'developer'::app_role) OR 
   has_role(auth.uid(), 'admin'::app_role) OR 
   has_role(auth.uid(), 'safety_officer'::app_role) OR 
   has_role(auth.uid(), 'supervisor'::app_role)) AND
  (organization_id = get_user_organization() OR organization_id IS NULL)
);

DROP POLICY IF EXISTS "Authorized staff can insert safety trainings" ON public.safety_trainings;
CREATE POLICY "Authorized staff can insert safety trainings"
ON public.safety_trainings FOR INSERT
WITH CHECK (
  (auth.uid() IS NOT NULL) AND 
  (has_role(auth.uid(), 'developer'::app_role) OR 
   has_role(auth.uid(), 'admin'::app_role) OR 
   has_role(auth.uid(), 'safety_officer'::app_role) OR 
   has_role(auth.uid(), 'supervisor'::app_role)) AND
  (organization_id = get_user_organization())
);

DROP POLICY IF EXISTS "Authorized staff can update safety trainings" ON public.safety_trainings;
CREATE POLICY "Authorized staff can update safety trainings"
ON public.safety_trainings FOR UPDATE
USING (
  (auth.uid() IS NOT NULL) AND 
  (has_role(auth.uid(), 'developer'::app_role) OR 
   has_role(auth.uid(), 'admin'::app_role) OR 
   has_role(auth.uid(), 'safety_officer'::app_role) OR 
   has_role(auth.uid(), 'supervisor'::app_role)) AND
  (organization_id = get_user_organization())
);

-- Update RLS policies for health_examinations
DROP POLICY IF EXISTS "Medical officers can view all health examinations" ON public.health_examinations;
CREATE POLICY "Medical officers can view all health examinations"
ON public.health_examinations FOR SELECT
USING (
  (auth.uid() IS NOT NULL) AND 
  (get_current_user_role() = 'medical_officer') AND
  (organization_id = get_user_organization() OR organization_id IS NULL)
);

DROP POLICY IF EXISTS "Non-medical staff can view limited health data" ON public.health_examinations;
CREATE POLICY "Non-medical staff can view limited health data"
ON public.health_examinations FOR SELECT
USING (
  (auth.uid() IS NOT NULL) AND 
  can_view_limited_health_data() AND
  (organization_id = get_user_organization() OR organization_id IS NULL)
);

DROP POLICY IF EXISTS "Authorized staff can insert health examinations" ON public.health_examinations;
CREATE POLICY "Authorized staff can insert health examinations"
ON public.health_examinations FOR INSERT
WITH CHECK (
  (auth.uid() IS NOT NULL) AND 
  (get_current_user_role() = ANY (ARRAY['safety_officer', 'admin', 'supervisor', 'medical_officer'])) AND
  (organization_id = get_user_organization())
);

-- Update RLS policies for incidents
DROP POLICY IF EXISTS "Authorized staff can view incidents" ON public.incidents;
CREATE POLICY "Authorized staff can view incidents"
ON public.incidents FOR SELECT
USING (
  (auth.uid() IS NOT NULL) AND 
  (get_current_user_role() = ANY (ARRAY['safety_officer', 'admin', 'supervisor'])) AND
  (organization_id = get_user_organization() OR organization_id IS NULL)
);

DROP POLICY IF EXISTS "Authorized staff can insert incidents" ON public.incidents;
CREATE POLICY "Authorized staff can insert incidents"
ON public.incidents FOR INSERT
WITH CHECK (
  (auth.uid() IS NOT NULL) AND 
  (get_current_user_role() = ANY (ARRAY['safety_officer', 'admin', 'supervisor'])) AND
  (organization_id = get_user_organization())
);

-- Update RLS policies for risk_assessments
DROP POLICY IF EXISTS "Safety officers and admins can view all risk assessments" ON public.risk_assessments;
CREATE POLICY "Safety officers and admins can view all risk assessments"
ON public.risk_assessments FOR SELECT
USING (
  (get_current_user_role() = ANY (ARRAY['safety_officer', 'admin', 'supervisor'])) AND
  (organization_id = get_user_organization() OR organization_id IS NULL)
);

DROP POLICY IF EXISTS "Safety officers and admins can insert risk assessments" ON public.risk_assessments;
CREATE POLICY "Safety officers and admins can insert risk assessments"
ON public.risk_assessments FOR INSERT
WITH CHECK (
  (get_current_user_role() = ANY (ARRAY['safety_officer', 'admin', 'supervisor'])) AND
  (organization_id = get_user_organization())
);

-- Update RLS policies for ergonomic_assessments
DROP POLICY IF EXISTS "Authorized staff can view ergonomic assessments" ON public.ergonomic_assessments;
CREATE POLICY "Authorized staff can view ergonomic assessments"
ON public.ergonomic_assessments FOR SELECT
USING (
  (auth.uid() IS NOT NULL) AND 
  (get_current_user_role() = ANY (ARRAY['safety_officer', 'admin', 'supervisor'])) AND
  (organization_id = get_user_organization() OR organization_id IS NULL)
);

DROP POLICY IF EXISTS "Authorized staff can insert ergonomic assessments" ON public.ergonomic_assessments;
CREATE POLICY "Authorized staff can insert ergonomic assessments"
ON public.ergonomic_assessments FOR INSERT
WITH CHECK (
  (auth.uid() IS NOT NULL) AND 
  (get_current_user_role() = ANY (ARRAY['safety_officer', 'admin', 'supervisor'])) AND
  (organization_id = get_user_organization())
);

-- Update RLS policies for daily_reports
DROP POLICY IF EXISTS "Safety officers and admins can view all daily reports" ON public.daily_reports;
CREATE POLICY "Safety officers and admins can view all daily reports"
ON public.daily_reports FOR SELECT
USING (
  (get_current_user_role() = ANY (ARRAY['safety_officer', 'admin', 'supervisor'])) AND
  (organization_id = get_user_organization() OR organization_id IS NULL)
);

DROP POLICY IF EXISTS "Safety officers and admins can insert daily reports" ON public.daily_reports;
CREATE POLICY "Safety officers and admins can insert daily reports"
ON public.daily_reports FOR INSERT
WITH CHECK (
  (get_current_user_role() = ANY (ARRAY['safety_officer', 'admin', 'supervisor'])) AND
  (organization_id = get_user_organization())
);

-- Update RLS policies for work_permits
DROP POLICY IF EXISTS "Authorized staff can view work permits" ON public.work_permits;
CREATE POLICY "Authorized staff can view work permits"
ON public.work_permits FOR SELECT
USING (
  (auth.uid() IS NOT NULL) AND 
  (has_role(auth.uid(), 'safety_officer'::app_role) OR 
   has_role(auth.uid(), 'admin'::app_role) OR 
   has_role(auth.uid(), 'supervisor'::app_role) OR 
   has_role(auth.uid(), 'developer'::app_role)) AND
  (organization_id = get_user_organization() OR organization_id IS NULL)
);

DROP POLICY IF EXISTS "Authorized staff can insert work permits" ON public.work_permits;
CREATE POLICY "Authorized staff can insert work permits"
ON public.work_permits FOR INSERT
WITH CHECK (
  (auth.uid() IS NOT NULL) AND 
  (has_role(auth.uid(), 'safety_officer'::app_role) OR 
   has_role(auth.uid(), 'admin'::app_role) OR 
   has_role(auth.uid(), 'supervisor'::app_role) OR 
   has_role(auth.uid(), 'developer'::app_role)) AND
  (organization_id = get_user_organization())
);

-- Create trigger for updated_at on organizations
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();