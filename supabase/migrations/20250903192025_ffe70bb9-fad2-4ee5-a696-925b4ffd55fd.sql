-- Create users/profiles table for additional user information
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  department TEXT,
  role TEXT NOT NULL DEFAULT 'safety_officer',
  last_login TIMESTAMP WITH TIME ZONE DEFAULT now(),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create incidents table
CREATE TABLE public.incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_date DATE NOT NULL,
  incident_time TIME NOT NULL,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'کم',
  status TEXT NOT NULL DEFAULT 'در حال بررسی',
  reporter_id UUID REFERENCES public.user_profiles(user_id),
  description TEXT,
  injured_person TEXT,
  witness_count INTEGER DEFAULT 0,
  immediate_action TEXT,
  root_cause TEXT,
  preventive_action TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ergonomic assessments table
CREATE TABLE public.ergonomic_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_name TEXT NOT NULL,
  department TEXT NOT NULL,
  position TEXT NOT NULL,
  assessment_type TEXT NOT NULL DEFAULT 'RULA',
  assessment_date DATE NOT NULL,
  assessor_id UUID REFERENCES public.user_profiles(user_id),
  workstation TEXT,
  shift_duration TEXT DEFAULT '8 ساعت',
  risk_level TEXT NOT NULL,
  final_score INTEGER NOT NULL,
  body_parts JSONB NOT NULL,
  recommendations TEXT[],
  status TEXT NOT NULL,
  follow_up_date DATE,
  ai_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create work permits table
CREATE TABLE public.work_permits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  permit_number TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  requester_id UUID REFERENCES public.user_profiles(user_id),
  permit_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'در انتظار تایید',
  valid_until DATE,
  work_description TEXT,
  hazards TEXT[],
  precautions TEXT[],
  approver_id UUID REFERENCES public.user_profiles(user_id),
  witnesses TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily reports table
CREATE TABLE public.daily_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_date DATE NOT NULL,
  officer_id UUID REFERENCES public.user_profiles(user_id),
  shift TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  weather TEXT,
  temperature TEXT,
  report_text TEXT,
  inspections INTEGER DEFAULT 0,
  training_sessions INTEGER DEFAULT 0,
  violations INTEGER DEFAULT 0,
  near_misses INTEGER DEFAULT 0,
  accidents INTEGER DEFAULT 0,
  ppe_distributed INTEGER DEFAULT 0,
  maintenance_requests INTEGER DEFAULT 0,
  suggestions TEXT,
  status TEXT DEFAULT 'ارسال شده',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create risk assessments table
CREATE TABLE public.risk_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id TEXT NOT NULL UNIQUE,
  area TEXT NOT NULL,
  process_name TEXT NOT NULL,
  hazard TEXT NOT NULL,
  hazard_category TEXT DEFAULT 'فیزیکی',
  probability TEXT NOT NULL,
  severity TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  existing_controls TEXT[],
  additional_controls TEXT,
  responsible_person_id UUID REFERENCES public.user_profiles(user_id),
  review_date DATE,
  status TEXT DEFAULT 'در حال بررسی',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ergonomic_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to access all data
CREATE POLICY "Users can view all data" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert profiles" ON public.user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update profiles" ON public.user_profiles FOR UPDATE USING (true);
CREATE POLICY "Users can delete profiles" ON public.user_profiles FOR DELETE USING (true);

CREATE POLICY "Users can view all incidents" ON public.incidents FOR SELECT USING (true);
CREATE POLICY "Users can insert incidents" ON public.incidents FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update incidents" ON public.incidents FOR UPDATE USING (true);
CREATE POLICY "Users can delete incidents" ON public.incidents FOR DELETE USING (true);

CREATE POLICY "Users can view all ergonomic assessments" ON public.ergonomic_assessments FOR SELECT USING (true);
CREATE POLICY "Users can insert ergonomic assessments" ON public.ergonomic_assessments FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update ergonomic assessments" ON public.ergonomic_assessments FOR UPDATE USING (true);
CREATE POLICY "Users can delete ergonomic assessments" ON public.ergonomic_assessments FOR DELETE USING (true);

CREATE POLICY "Users can view all work permits" ON public.work_permits FOR SELECT USING (true);
CREATE POLICY "Users can insert work permits" ON public.work_permits FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update work permits" ON public.work_permits FOR UPDATE USING (true);
CREATE POLICY "Users can delete work permits" ON public.work_permits FOR DELETE USING (true);

CREATE POLICY "Users can view all daily reports" ON public.daily_reports FOR SELECT USING (true);
CREATE POLICY "Users can insert daily reports" ON public.daily_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update daily reports" ON public.daily_reports FOR UPDATE USING (true);
CREATE POLICY "Users can delete daily reports" ON public.daily_reports FOR DELETE USING (true);

CREATE POLICY "Users can view all risk assessments" ON public.risk_assessments FOR SELECT USING (true);
CREATE POLICY "Users can insert risk assessments" ON public.risk_assessments FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update risk assessments" ON public.risk_assessments FOR UPDATE USING (true);
CREATE POLICY "Users can delete risk assessments" ON public.risk_assessments FOR DELETE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at
  BEFORE UPDATE ON public.incidents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ergonomic_assessments_updated_at
  BEFORE UPDATE ON public.ergonomic_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_work_permits_updated_at
  BEFORE UPDATE ON public.work_permits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_reports_updated_at
  BEFORE UPDATE ON public.daily_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_risk_assessments_updated_at
  BEFORE UPDATE ON public.risk_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();