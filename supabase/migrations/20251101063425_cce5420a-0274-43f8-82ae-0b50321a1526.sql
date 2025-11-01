-- Enable RLS on all tables that don't have it enabled
ALTER TABLE public.work_permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ergonomic_assessments ENABLE ROW LEVEL SECURITY;

-- Create audit log table for role changes
CREATE TABLE IF NOT EXISTS public.role_audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user_id uuid NOT NULL,
  role_changed app_role NOT NULL,
  action text NOT NULL CHECK (action IN ('granted', 'revoked')),
  changed_by uuid NOT NULL REFERENCES auth.users(id),
  changed_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_address inet,
  user_agent text
);

ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS policy for audit logs (only developers and admins can read)
CREATE POLICY "Developers and admins can view audit logs"
ON public.role_audit_log
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND 
  (has_role(auth.uid(), 'developer') OR has_role(auth.uid(), 'admin'))
);

-- Trigger function to log role changes
CREATE OR REPLACE FUNCTION public.log_role_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.role_audit_log (user_id, target_user_id, role_changed, action, changed_by)
    VALUES (auth.uid(), NEW.user_id, NEW.role, 'granted', auth.uid());
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO public.role_audit_log (user_id, target_user_id, role_changed, action, changed_by)
    VALUES (auth.uid(), OLD.user_id, OLD.role, 'revoked', auth.uid());
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Attach trigger to user_roles table
DROP TRIGGER IF EXISTS role_changes_audit_trigger ON public.user_roles;
CREATE TRIGGER role_changes_audit_trigger
AFTER INSERT OR DELETE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.log_role_changes();

-- RLS Policies for existing tables

-- work_permits policies
DROP POLICY IF EXISTS "Safety officers and admins can view all work permits" ON public.work_permits;
DROP POLICY IF EXISTS "Safety officers and admins can insert work permits" ON public.work_permits;
DROP POLICY IF EXISTS "Safety officers and admins can update work permits" ON public.work_permits;
DROP POLICY IF EXISTS "Safety officers and admins can delete work permits" ON public.work_permits;

CREATE POLICY "Authorized staff can view work permits"
ON public.work_permits FOR SELECT
USING (
  auth.uid() IS NOT NULL AND 
  (has_role(auth.uid(), 'safety_officer') OR has_role(auth.uid(), 'admin') OR 
   has_role(auth.uid(), 'supervisor') OR has_role(auth.uid(), 'developer'))
);

CREATE POLICY "Authorized staff can insert work permits"
ON public.work_permits FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  (has_role(auth.uid(), 'safety_officer') OR has_role(auth.uid(), 'admin') OR 
   has_role(auth.uid(), 'supervisor') OR has_role(auth.uid(), 'developer'))
);

CREATE POLICY "Authorized staff can update work permits"
ON public.work_permits FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND 
  (has_role(auth.uid(), 'safety_officer') OR has_role(auth.uid(), 'admin') OR 
   has_role(auth.uid(), 'supervisor') OR has_role(auth.uid(), 'developer'))
);

CREATE POLICY "Admins and developers can delete work permits"
ON public.work_permits FOR DELETE
USING (
  auth.uid() IS NOT NULL AND 
  (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'developer'))
);