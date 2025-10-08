-- Create role enum with new roles including developer, senior_manager, and viewer
CREATE TYPE public.app_role AS ENUM ('developer', 'admin', 'senior_manager', 'supervisor', 'safety_officer', 'medical_officer', 'viewer');

-- Create user_roles table for proper role management
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update get_current_user_role function to use user_roles table
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role::text FROM public.user_roles WHERE user_id = auth.uid() AND auth.uid() IS NOT NULL LIMIT 1),
    'viewer'
  );
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Developers and admins can view all roles"
ON public.user_roles
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND
  (public.has_role(auth.uid(), 'developer') OR public.has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Developers can manage all roles"
ON public.user_roles
FOR ALL
USING (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'developer'));

-- Update existing RLS policies to include new roles
-- Update all existing policies to allow developer access

-- Drop old role column from user_profiles if it exists and add new structure
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS role;
ALTER TABLE public.user_profiles ADD COLUMN display_name text;

-- Create trigger for updating user_roles updated_at
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();