-- Drop existing policy for viewing all user profiles
DROP POLICY IF EXISTS "Admins can view all user profiles" ON public.user_profiles;

-- Create new policy that includes developer role
CREATE POLICY "Admins and developers can view all user profiles" 
ON public.user_profiles 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) AND 
  (get_current_user_role() = ANY (ARRAY['admin'::text, 'developer'::text]))
);