-- Add RLS policy to allow authenticated users to insert safety trainings
CREATE POLICY "Authenticated users can insert safety trainings"
ON public.safety_trainings
FOR INSERT
TO authenticated
WITH CHECK (true);