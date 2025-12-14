
-- Create comprehensive occupational health record table based on standard form
CREATE TABLE public.occupational_health_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  organization_id UUID REFERENCES public.organizations(id),
  created_by UUID,
  
  -- Section 1: Employee Personal Information (مشخصات فردی شاغل)
  father_name TEXT,
  gender TEXT NOT NULL DEFAULT 'مرد', -- مرد/زن
  marital_status TEXT, -- متاهل/مجرد
  children_count INTEGER DEFAULT 0,
  national_code TEXT,
  birth_year TEXT,
  military_status TEXT,
  military_service_type TEXT,
  medical_exemption BOOLEAN DEFAULT false,
  medical_exemption_reason TEXT,
  work_address TEXT,
  work_phone TEXT,
  
  -- Section 2: Employment History (سوابق شغلی)
  current_jobs JSONB DEFAULT '[]'::jsonb, -- [{title, duties, location, start_date, end_date, change_reason}]
  previous_jobs JSONB DEFAULT '[]'::jsonb,
  
  -- Section 3: Hazardous Factors Assessment (ارزیابی عوامل زیان‌آور)
  physical_hazards JSONB DEFAULT '{}'::jsonb, -- {noise: bool, vibration: bool, radiation: bool, heat_stress: bool, ...}
  chemical_hazards JSONB DEFAULT '{}'::jsonb, -- {dust: bool, fumes: bool, solvents: bool, acids: bool, gases: bool, ...}
  biological_hazards JSONB DEFAULT '{}'::jsonb, -- {bacteria: bool, virus: bool, parasite: bool, ...}
  ergonomic_hazards JSONB DEFAULT '{}'::jsonb, -- {prolonged_sitting: bool, prolonged_standing: bool, repetitive_work: bool, ...}
  psychological_hazards JSONB DEFAULT '{}'::jsonb, -- {shift_work: bool, work_stress: bool, ...}
  
  -- Section 4: Personal/Family/Medical History (سابقه شخصی و خانوادگی و پزشکی)
  has_prior_illness BOOLEAN,
  illness_worsens_with_environment_change BOOLEAN,
  coworkers_have_similar_symptoms BOOLEAN,
  symptoms_improve_on_leave BOOLEAN,
  has_allergies BOOLEAN,
  allergy_details TEXT,
  hospitalization_history BOOLEAN,
  hospitalization_details TEXT,
  surgery_history BOOLEAN,
  surgery_details TEXT,
  family_chronic_disease_cancer BOOLEAN,
  family_disease_details TEXT,
  current_medications BOOLEAN,
  medication_details TEXT,
  currently_smoking BOOLEAN,
  previous_smoking BOOLEAN,
  smoking_details TEXT,
  regular_exercise BOOLEAN,
  exercise_details TEXT,
  occupational_accident_history BOOLEAN,
  accident_details TEXT,
  work_absence_due_illness BOOLEAN,
  absence_details TEXT,
  lives_near_industrial_area BOOLEAN,
  industrial_area_details TEXT,
  medical_commission_referral BOOLEAN,
  commission_details TEXT,
  
  -- Section 5: Physical Examination (معاینات)
  examination_date DATE NOT NULL DEFAULT CURRENT_DATE,
  examination_type TEXT NOT NULL DEFAULT 'دوره‌ای', -- بدواستخدام، دوره‌ای، موردی
  height_cm DECIMAL(5,2),
  weight_kg DECIMAL(5,2),
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  pulse_rate INTEGER,
  bmi DECIMAL(4,2),
  
  -- General Symptoms (علائم عمومی)
  general_symptoms JSONB DEFAULT '{}'::jsonb, -- {weight_loss, appetite_loss, fatigue, sleep_disorder, excessive_sweating, heat_cold_intolerance, fever}
  
  -- Eye Symptoms (چشم)
  eye_symptoms JSONB DEFAULT '{}'::jsonb, -- {vision_reduction, blurred_vision, eye_fatigue, double_vision, burning, itching, light_sensitivity, tearing}
  
  -- Skin Symptoms (پوست)
  skin_symptoms JSONB DEFAULT '{}'::jsonb, -- {itching, hair_loss, redness, color_change, peeling, nail_color_change}
  
  -- ENT Symptoms (گوش و حلق و بینی)
  ent_symptoms JSONB DEFAULT '{}'::jsonb, -- {hearing_loss, tinnitus, vertigo, ear_pain, ear_discharge, hoarseness, throat_pain, nasal_discharge, smell_disorder}
  
  -- Neck (گردن)
  neck_symptoms JSONB DEFAULT '{}'::jsonb, -- {neck_pain, neck_mass}
  
  -- Respiratory Symptoms (ریه)
  respiratory_symptoms JSONB DEFAULT '{}'::jsonb, -- {cough, sputum, dyspnea, wheezing, chest_pain}
  respiratory_signs JSONB DEFAULT '{}'::jsonb, -- {abnormal_chest_appearance, hoarseness, wheezing, crackles, tachypnea, reduced_breath_sounds}
  
  -- Cardiovascular Symptoms (قلب و عروق)
  cardiovascular_symptoms JSONB DEFAULT '{}'::jsonb, -- {chest_pain, palpitation, nocturnal_dyspnea, orthopnea, cyanosis, syncope}
  cardiovascular_signs JSONB DEFAULT '{}'::jsonb, -- {arrhythmia, varicose_veins, edema, abnormal_heart_sounds}
  
  -- GI Symptoms (گوارش)
  gi_symptoms JSONB DEFAULT '{}'::jsonb, -- {loss_appetite, nausea, vomiting, abdominal_pain, heartburn, constipation, tarry_stool, bloody_stool}
  gi_signs JSONB DEFAULT '{}'::jsonb, -- {tenderness, rebound_tenderness, hepatomegaly, splenomegaly, ascites, mass, distension}
  
  -- Urinary Symptoms (ادراری)
  urinary_symptoms JSONB DEFAULT '{}'::jsonb, -- {dysuria, frequency, hematuria, flank_pain, pelvic_heaviness}
  urinary_signs JSONB DEFAULT '{}'::jsonb, -- {cva_tenderness, varicocele}
  
  -- Musculoskeletal Symptoms (عضلانی اسکلتی)
  musculoskeletal_symptoms JSONB DEFAULT '{}'::jsonb, -- {joint_stiffness, back_pain, knee_pain, shoulder_pain, other_joint_pain}
  musculoskeletal_signs JSONB DEFAULT '{}'::jsonb, -- {limited_rom, weakness_upper, weakness_lower, scoliosis, amputation}
  
  -- Neurological Symptoms (عصبی)
  neurological_symptoms JSONB DEFAULT '{}'::jsonb, -- {headache, dizziness, tremor, memory_problems, seizure_history, finger_paresthesia}
  neurological_signs JSONB DEFAULT '{}'::jsonb, -- {abnormal_knee_reflex, abnormal_achilles_reflex, abnormal_romberg, tremor, sensory_deficit, positive_tinel}
  
  -- Psychological Symptoms (روانی)
  psychological_symptoms JSONB DEFAULT '{}'::jsonb, -- {excessive_anger, aggression, anxiety, low_mood, reduced_motivation}
  psychological_signs JSONB DEFAULT '{}'::jsonb, -- {delusion, hallucination, disorientation}
  
  -- Section 6: Laboratory Tests (آزمایشات)
  lab_tests JSONB DEFAULT '{}'::jsonb, -- {wbc, rbc, hb, hct, plt, protein, glucose, fbs, cholesterol, ldl, hdl, tg, bun, cr, alt, ast, alk_ph, psa, hbs_ag, stool_exam, ppd}
  specialized_tests JSONB DEFAULT '[]'::jsonb, -- [{type, date, result}]
  vaccination_records JSONB DEFAULT '[]'::jsonb, -- [{type, date, result}]
  
  -- Section 7: Paraclinical Tests (پاراکلینیک)
  -- Optometry (اپتومتری)
  vision_test_date DATE,
  vision_acuity_left TEXT,
  vision_acuity_right TEXT,
  vision_acuity_left_corrected TEXT,
  vision_acuity_right_corrected TEXT,
  color_vision_left TEXT,
  color_vision_right TEXT,
  visual_field_left TEXT,
  visual_field_right TEXT,
  depth_perception TEXT,
  
  -- Audiometry (ادیومتری)
  audiometry_date DATE,
  audiometry_results JSONB DEFAULT '{}'::jsonb, -- {freq_500, freq_1000, freq_2000, freq_3000, freq_4000, freq_6000, freq_8000, srt, sds}
  audiometry_interpretation TEXT,
  
  -- Spirometry (اسپیرومتری)
  spirometry_date DATE,
  spirometry_results JSONB DEFAULT '{}'::jsonb, -- {fev1, fev1_percent, fvc, fvc_percent, fev1_fvc_ratio, fef_25_75, pef, vext}
  spirometry_interpretation TEXT,
  
  -- Other Paraclinical (سایر اقدامات پاراکلینیک)
  cxr_date DATE,
  cxr_findings TEXT,
  ecg_date DATE,
  ecg_findings TEXT,
  other_imaging TEXT,
  
  -- Section 8: Consultations (مشاوره‌ها)
  consultations JSONB DEFAULT '[]'::jsonb, -- [{specialty, date, reason, result}]
  
  -- Section 9: Final Opinion (نظریه نهایی)
  examiner_name TEXT,
  fitness_status TEXT NOT NULL DEFAULT 'مناسب', -- مناسب، مشروط، عدم صلاحیت
  fitness_conditions TEXT,
  unfitness_reasons TEXT,
  medical_recommendations TEXT,
  final_opinion_date DATE,
  final_opinion_physician TEXT,
  occupational_health_code TEXT,
  
  -- AI Analysis
  ai_analysis JSONB,
  health_risk_score INTEGER,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.occupational_health_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Medical officers can view all occupational health records"
ON public.occupational_health_records
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'medical_officer'
  AND (organization_id = get_user_organization() OR organization_id IS NULL)
);

CREATE POLICY "Non-medical staff can view limited health data"
ON public.occupational_health_records
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND can_view_limited_health_data()
  AND (organization_id = get_user_organization() OR organization_id IS NULL)
);

CREATE POLICY "Authorized staff can insert occupational health records"
ON public.occupational_health_records
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() IN ('safety_officer', 'admin', 'supervisor', 'medical_officer')
  AND organization_id = get_user_organization()
);

CREATE POLICY "Authorized staff can update occupational health records"
ON public.occupational_health_records
FOR UPDATE
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() IN ('safety_officer', 'admin', 'supervisor', 'medical_officer')
);

CREATE POLICY "Admins can delete occupational health records"
ON public.occupational_health_records
FOR DELETE
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
);

-- Trigger for updated_at
CREATE TRIGGER update_occupational_health_records_updated_at
  BEFORE UPDATE ON public.occupational_health_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_occupational_health_employee_id ON public.occupational_health_records(employee_id);
CREATE INDEX idx_occupational_health_organization ON public.occupational_health_records(organization_id);
CREATE INDEX idx_occupational_health_exam_date ON public.occupational_health_records(examination_date);
CREATE INDEX idx_occupational_health_fitness ON public.occupational_health_records(fitness_status);
