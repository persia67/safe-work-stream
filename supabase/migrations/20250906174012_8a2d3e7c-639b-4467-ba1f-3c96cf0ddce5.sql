-- Create table for periodic health examinations
CREATE TABLE public.health_examinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_name TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  department TEXT NOT NULL,
  position TEXT NOT NULL,
  examination_date DATE NOT NULL,
  examination_type TEXT NOT NULL DEFAULT 'دوره‌ای',
  examiner_name TEXT NOT NULL,
  
  -- Health metrics
  hearing_test_result TEXT, -- نرمال، کاهش خفیف، کاهش متوسط، کاهش شدید
  vision_test_result TEXT,
  blood_pressure TEXT,
  respiratory_function TEXT,
  musculoskeletal_assessment TEXT,
  
  -- Occupational health indicators
  exposure_risks JSONB, -- Array of exposure risks
  health_recommendations JSONB, -- Array of recommendations
  fitness_for_work TEXT NOT NULL DEFAULT 'مناسب', -- مناسب، مناسب با محدودیت، نامناسب
  
  -- Follow-up and analysis
  next_examination_date DATE,
  ai_analysis JSONB, -- AI analysis results
  health_trends JSONB, -- Trend analysis data
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'فعال',
  
  -- Indexes for better performance
  CONSTRAINT health_examinations_fitness_check CHECK (fitness_for_work IN ('مناسب', 'مناسب با محدودیت', 'نامناسب'))
);

-- Enable Row Level Security
ALTER TABLE public.health_examinations ENABLE ROW LEVEL SECURITY;

-- Create policies for health examinations
CREATE POLICY "Authorized staff can view health examinations"
ON public.health_examinations
FOR SELECT
USING ((auth.uid() IS NOT NULL) AND (get_current_user_role() = ANY (ARRAY['safety_officer'::text, 'admin'::text, 'supervisor'::text, 'medical_officer'::text])));

CREATE POLICY "Authorized staff can insert health examinations"
ON public.health_examinations
FOR INSERT
WITH CHECK ((auth.uid() IS NOT NULL) AND (get_current_user_role() = ANY (ARRAY['safety_officer'::text, 'admin'::text, 'supervisor'::text, 'medical_officer'::text])));

CREATE POLICY "Authorized staff can update health examinations"
ON public.health_examinations
FOR UPDATE
USING ((auth.uid() IS NOT NULL) AND (get_current_user_role() = ANY (ARRAY['safety_officer'::text, 'admin'::text, 'supervisor'::text, 'medical_officer'::text])));

CREATE POLICY "Admins can delete health examinations"
ON public.health_examinations
FOR DELETE
USING ((auth.uid() IS NOT NULL) AND (get_current_user_role() = 'admin'::text));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_health_examinations_updated_at
BEFORE UPDATE ON public.health_examinations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_health_examinations_department ON public.health_examinations(department);
CREATE INDEX idx_health_examinations_examination_date ON public.health_examinations(examination_date);
CREATE INDEX idx_health_examinations_employee_id ON public.health_examinations(employee_id);
CREATE INDEX idx_health_examinations_fitness ON public.health_examinations(fitness_for_work);