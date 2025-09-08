-- Create safety_trainings table
CREATE TABLE public.safety_trainings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  training_title TEXT NOT NULL,
  training_type TEXT NOT NULL,
  department TEXT NOT NULL,
  instructor_name TEXT NOT NULL,
  training_date DATE NOT NULL,
  duration_hours INTEGER NOT NULL DEFAULT 2,
  participants TEXT[] DEFAULT '{}',
  training_content TEXT,
  objectives TEXT[] DEFAULT '{}',
  assessment_method TEXT,
  pass_score INTEGER DEFAULT 70,
  certificate_issued BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'برنامه‌ریزی شده',
  attendance_count INTEGER DEFAULT 0,
  pass_count INTEGER DEFAULT 0,
  effectiveness_score INTEGER,
  follow_up_required BOOLEAN DEFAULT false,
  ai_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.safety_trainings ENABLE ROW LEVEL SECURITY;

-- Create policies for safety_trainings
CREATE POLICY "Authorized staff can view safety trainings" 
ON public.safety_trainings 
FOR SELECT 
USING ((auth.uid() IS NOT NULL) AND (get_current_user_role() = ANY (ARRAY['safety_officer'::text, 'admin'::text, 'supervisor'::text])));

CREATE POLICY "Authorized staff can insert safety trainings" 
ON public.safety_trainings 
FOR INSERT 
WITH CHECK ((auth.uid() IS NOT NULL) AND (get_current_user_role() = ANY (ARRAY['safety_officer'::text, 'admin'::text, 'supervisor'::text])));

CREATE POLICY "Authorized staff can update safety trainings" 
ON public.safety_trainings 
FOR UPDATE 
USING ((auth.uid() IS NOT NULL) AND (get_current_user_role() = ANY (ARRAY['safety_officer'::text, 'admin'::text, 'supervisor'::text])));

CREATE POLICY "Admins can delete safety trainings" 
ON public.safety_trainings 
FOR DELETE 
USING ((auth.uid() IS NOT NULL) AND (get_current_user_role() = 'admin'::text));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_safety_trainings_updated_at
BEFORE UPDATE ON public.safety_trainings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();