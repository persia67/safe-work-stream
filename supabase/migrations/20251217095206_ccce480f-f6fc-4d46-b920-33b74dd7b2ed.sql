-- Add RLS policies for organization management (admin and developer only)

-- Policy for INSERT
CREATE POLICY "Admins and developers can create organizations" 
ON public.organizations 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'developer'::app_role))
);

-- Policy for UPDATE
CREATE POLICY "Admins and developers can update organizations" 
ON public.organizations 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'developer'::app_role))
);

-- Policy for DELETE
CREATE POLICY "Admins and developers can delete organizations" 
ON public.organizations 
FOR DELETE 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'developer'::app_role))
);

-- Also add SELECT policy for admin/developer to see all organizations
CREATE POLICY "Admins and developers can view all organizations" 
ON public.organizations 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'developer'::app_role))
);