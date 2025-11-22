-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can insert safety trainings" ON public.safety_trainings;

-- Update INSERT policy to include developer role
DROP POLICY IF EXISTS "Authorized staff can insert safety trainings" ON public.safety_trainings;
CREATE POLICY "Authorized staff can insert safety trainings"
ON public.safety_trainings
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    has_role(auth.uid(), 'developer'::app_role) OR
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'safety_officer'::app_role) OR
    has_role(auth.uid(), 'supervisor'::app_role)
  )
);

-- Update UPDATE policy to include developer role
DROP POLICY IF EXISTS "Authorized staff can update safety trainings" ON public.safety_trainings;
CREATE POLICY "Authorized staff can update safety trainings"
ON public.safety_trainings
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    has_role(auth.uid(), 'developer'::app_role) OR
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'safety_officer'::app_role) OR
    has_role(auth.uid(), 'supervisor'::app_role)
  )
);

-- Update DELETE policy to include developer role
DROP POLICY IF EXISTS "Admins can delete safety trainings" ON public.safety_trainings;
CREATE POLICY "Admins and developers can delete safety trainings"
ON public.safety_trainings
FOR DELETE
TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    has_role(auth.uid(), 'developer'::app_role) OR
    has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Update SELECT policy to include developer role
DROP POLICY IF EXISTS "Authorized staff can view safety trainings" ON public.safety_trainings;
CREATE POLICY "Authorized staff can view safety trainings"
ON public.safety_trainings
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    has_role(auth.uid(), 'developer'::app_role) OR
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'safety_officer'::app_role) OR
    has_role(auth.uid(), 'supervisor'::app_role)
  )
);