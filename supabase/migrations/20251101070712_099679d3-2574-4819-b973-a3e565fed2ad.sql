-- Fix the log_role_changes trigger to handle system-created roles
CREATE OR REPLACE FUNCTION public.log_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.role_audit_log (user_id, target_user_id, role_changed, action, changed_by)
    VALUES (
      COALESCE(auth.uid(), NEW.user_id), -- Use NEW.user_id if auth.uid() is null (system created)
      NEW.user_id, 
      NEW.role, 
      'granted', 
      COALESCE(auth.uid(), NEW.user_id) -- Use NEW.user_id if auth.uid() is null
    );
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO public.role_audit_log (user_id, target_user_id, role_changed, action, changed_by)
    VALUES (
      COALESCE(auth.uid(), OLD.user_id),
      OLD.user_id, 
      OLD.role, 
      'revoked', 
      COALESCE(auth.uid(), OLD.user_id)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Now run the main migration
-- Step 1: Create trigger function to automatically create user profile and assign role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into user_profiles
  INSERT INTO public.user_profiles (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email
  );
  
  -- Assign default role (viewer for regular users)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer'::app_role);
  
  RETURN NEW;
END;
$$;

-- Step 2: Create trigger to call the function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Insert profile and role for existing user
INSERT INTO public.user_profiles (user_id, name, email, department)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'name', SPLIT_PART(email, '@', 1)),
  email,
  'Management'
FROM auth.users
WHERE email = 'rafiyanhamid1989@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name;

-- Step 4: Assign developer role to existing user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'developer'::app_role
FROM auth.users
WHERE email = 'rafiyanhamid1989@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 5: Add RLS policies for users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Step 6: Allow users to insert viewer role for themselves
CREATE POLICY "Users can insert viewer role for themselves"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND role = 'viewer'::app_role
);