-- Create default organization
INSERT INTO public.organizations (id, name, code, active)
VALUES ('00000000-0000-0000-0000-000000000001', 'شرکت اصلی', 'MAIN', true);

-- Assign all existing users to the default organization
UPDATE public.user_profiles 
SET organization_id = '00000000-0000-0000-0000-000000000001'
WHERE organization_id IS NULL;