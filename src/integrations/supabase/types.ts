export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      daily_reports: {
        Row: {
          accidents: number | null
          created_at: string
          end_time: string
          id: string
          inspections: number | null
          maintenance_requests: number | null
          near_misses: number | null
          officer_id: string | null
          organization_id: string | null
          ppe_distributed: number | null
          report_date: string
          report_text: string | null
          shift: string
          start_time: string
          status: string | null
          suggestions: string | null
          temperature: string | null
          training_sessions: number | null
          updated_at: string
          violations: number | null
          weather: string | null
        }
        Insert: {
          accidents?: number | null
          created_at?: string
          end_time: string
          id?: string
          inspections?: number | null
          maintenance_requests?: number | null
          near_misses?: number | null
          officer_id?: string | null
          organization_id?: string | null
          ppe_distributed?: number | null
          report_date: string
          report_text?: string | null
          shift: string
          start_time: string
          status?: string | null
          suggestions?: string | null
          temperature?: string | null
          training_sessions?: number | null
          updated_at?: string
          violations?: number | null
          weather?: string | null
        }
        Update: {
          accidents?: number | null
          created_at?: string
          end_time?: string
          id?: string
          inspections?: number | null
          maintenance_requests?: number | null
          near_misses?: number | null
          officer_id?: string | null
          organization_id?: string | null
          ppe_distributed?: number | null
          report_date?: string
          report_text?: string | null
          shift?: string
          start_time?: string
          status?: string | null
          suggestions?: string | null
          temperature?: string | null
          training_sessions?: number | null
          updated_at?: string
          violations?: number | null
          weather?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_reports_officer_id_fkey"
            columns: ["officer_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "daily_reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ergonomic_assessments: {
        Row: {
          ai_analysis: Json | null
          assessment_date: string
          assessment_type: string
          assessor_id: string | null
          body_parts: Json
          created_at: string
          department: string
          employee_name: string
          final_score: number
          follow_up_date: string | null
          id: string
          organization_id: string | null
          position: string
          recommendations: string[] | null
          risk_level: string
          shift_duration: string | null
          status: string
          updated_at: string
          workstation: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          assessment_date: string
          assessment_type?: string
          assessor_id?: string | null
          body_parts: Json
          created_at?: string
          department: string
          employee_name: string
          final_score: number
          follow_up_date?: string | null
          id?: string
          organization_id?: string | null
          position: string
          recommendations?: string[] | null
          risk_level: string
          shift_duration?: string | null
          status: string
          updated_at?: string
          workstation?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          assessment_date?: string
          assessment_type?: string
          assessor_id?: string | null
          body_parts?: Json
          created_at?: string
          department?: string
          employee_name?: string
          final_score?: number
          follow_up_date?: string | null
          id?: string
          organization_id?: string | null
          position?: string
          recommendations?: string[] | null
          risk_level?: string
          shift_duration?: string | null
          status?: string
          updated_at?: string
          workstation?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ergonomic_assessments_assessor_id_fkey"
            columns: ["assessor_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ergonomic_assessments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      health_examinations: {
        Row: {
          ai_analysis: Json | null
          blood_pressure: string | null
          created_at: string
          created_by: string | null
          department: string
          employee_id: string
          employee_name: string
          examination_date: string
          examination_type: string
          examiner_name: string
          exposure_risks: Json | null
          fitness_for_work: string
          health_recommendations: Json | null
          health_trends: Json | null
          hearing_test_result: string | null
          id: string
          musculoskeletal_assessment: string | null
          next_examination_date: string | null
          organization_id: string | null
          position: string
          respiratory_function: string | null
          status: string | null
          updated_at: string
          vision_test_result: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          blood_pressure?: string | null
          created_at?: string
          created_by?: string | null
          department: string
          employee_id: string
          employee_name: string
          examination_date: string
          examination_type?: string
          examiner_name: string
          exposure_risks?: Json | null
          fitness_for_work?: string
          health_recommendations?: Json | null
          health_trends?: Json | null
          hearing_test_result?: string | null
          id?: string
          musculoskeletal_assessment?: string | null
          next_examination_date?: string | null
          organization_id?: string | null
          position: string
          respiratory_function?: string | null
          status?: string | null
          updated_at?: string
          vision_test_result?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          blood_pressure?: string | null
          created_at?: string
          created_by?: string | null
          department?: string
          employee_id?: string
          employee_name?: string
          examination_date?: string
          examination_type?: string
          examiner_name?: string
          exposure_risks?: Json | null
          fitness_for_work?: string
          health_recommendations?: Json | null
          health_trends?: Json | null
          hearing_test_result?: string | null
          id?: string
          musculoskeletal_assessment?: string | null
          next_examination_date?: string | null
          organization_id?: string | null
          position?: string
          respiratory_function?: string | null
          status?: string | null
          updated_at?: string
          vision_test_result?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_examinations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          created_at: string
          description: string | null
          id: string
          immediate_action: string | null
          incident_date: string
          incident_time: string
          injured_person: string | null
          location: string
          organization_id: string | null
          preventive_action: string | null
          reporter_id: string | null
          root_cause: string | null
          severity: string
          status: string
          type: string
          updated_at: string
          witness_count: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          immediate_action?: string | null
          incident_date: string
          incident_time: string
          injured_person?: string | null
          location: string
          organization_id?: string | null
          preventive_action?: string | null
          reporter_id?: string | null
          root_cause?: string | null
          severity?: string
          status?: string
          type: string
          updated_at?: string
          witness_count?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          immediate_action?: string | null
          incident_date?: string
          incident_time?: string
          injured_person?: string | null
          location?: string
          organization_id?: string | null
          preventive_action?: string | null
          reporter_id?: string | null
          root_cause?: string | null
          severity?: string
          status?: string
          type?: string
          updated_at?: string
          witness_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      occupational_health_records: {
        Row: {
          absence_details: string | null
          accident_details: string | null
          ai_analysis: Json | null
          allergy_details: string | null
          audiometry_date: string | null
          audiometry_interpretation: string | null
          audiometry_results: Json | null
          biological_hazards: Json | null
          birth_year: string | null
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          bmi: number | null
          cardiovascular_signs: Json | null
          cardiovascular_symptoms: Json | null
          chemical_hazards: Json | null
          children_count: number | null
          color_vision_left: string | null
          color_vision_right: string | null
          commission_details: string | null
          consultations: Json | null
          coworkers_have_similar_symptoms: boolean | null
          created_at: string
          created_by: string | null
          current_jobs: Json | null
          current_medications: boolean | null
          currently_smoking: boolean | null
          cxr_date: string | null
          cxr_findings: string | null
          depth_perception: string | null
          ecg_date: string | null
          ecg_findings: string | null
          employee_id: string
          employee_name: string
          ent_symptoms: Json | null
          ergonomic_hazards: Json | null
          examination_date: string
          examination_type: string
          examiner_name: string | null
          exercise_details: string | null
          eye_symptoms: Json | null
          family_chronic_disease_cancer: boolean | null
          family_disease_details: string | null
          father_name: string | null
          final_opinion_date: string | null
          final_opinion_physician: string | null
          fitness_conditions: string | null
          fitness_status: string
          gender: string
          general_symptoms: Json | null
          gi_signs: Json | null
          gi_symptoms: Json | null
          has_allergies: boolean | null
          has_prior_illness: boolean | null
          health_risk_score: number | null
          height_cm: number | null
          hospitalization_details: string | null
          hospitalization_history: boolean | null
          id: string
          illness_worsens_with_environment_change: boolean | null
          industrial_area_details: string | null
          lab_tests: Json | null
          lives_near_industrial_area: boolean | null
          marital_status: string | null
          medical_commission_referral: boolean | null
          medical_exemption: boolean | null
          medical_exemption_reason: string | null
          medical_recommendations: string | null
          medication_details: string | null
          military_service_type: string | null
          military_status: string | null
          musculoskeletal_signs: Json | null
          musculoskeletal_symptoms: Json | null
          national_code: string | null
          neck_symptoms: Json | null
          neurological_signs: Json | null
          neurological_symptoms: Json | null
          occupational_accident_history: boolean | null
          occupational_health_code: string | null
          organization_id: string | null
          other_imaging: string | null
          physical_hazards: Json | null
          previous_jobs: Json | null
          previous_smoking: boolean | null
          psychological_hazards: Json | null
          psychological_signs: Json | null
          psychological_symptoms: Json | null
          pulse_rate: number | null
          regular_exercise: boolean | null
          respiratory_signs: Json | null
          respiratory_symptoms: Json | null
          skin_symptoms: Json | null
          smoking_details: string | null
          specialized_tests: Json | null
          spirometry_date: string | null
          spirometry_interpretation: string | null
          spirometry_results: Json | null
          surgery_details: string | null
          surgery_history: boolean | null
          symptoms_improve_on_leave: boolean | null
          unfitness_reasons: string | null
          updated_at: string
          urinary_signs: Json | null
          urinary_symptoms: Json | null
          vaccination_records: Json | null
          vision_acuity_left: string | null
          vision_acuity_left_corrected: string | null
          vision_acuity_right: string | null
          vision_acuity_right_corrected: string | null
          vision_test_date: string | null
          visual_field_left: string | null
          visual_field_right: string | null
          weight_kg: number | null
          work_absence_due_illness: boolean | null
          work_address: string | null
          work_phone: string | null
        }
        Insert: {
          absence_details?: string | null
          accident_details?: string | null
          ai_analysis?: Json | null
          allergy_details?: string | null
          audiometry_date?: string | null
          audiometry_interpretation?: string | null
          audiometry_results?: Json | null
          biological_hazards?: Json | null
          birth_year?: string | null
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          bmi?: number | null
          cardiovascular_signs?: Json | null
          cardiovascular_symptoms?: Json | null
          chemical_hazards?: Json | null
          children_count?: number | null
          color_vision_left?: string | null
          color_vision_right?: string | null
          commission_details?: string | null
          consultations?: Json | null
          coworkers_have_similar_symptoms?: boolean | null
          created_at?: string
          created_by?: string | null
          current_jobs?: Json | null
          current_medications?: boolean | null
          currently_smoking?: boolean | null
          cxr_date?: string | null
          cxr_findings?: string | null
          depth_perception?: string | null
          ecg_date?: string | null
          ecg_findings?: string | null
          employee_id: string
          employee_name: string
          ent_symptoms?: Json | null
          ergonomic_hazards?: Json | null
          examination_date?: string
          examination_type?: string
          examiner_name?: string | null
          exercise_details?: string | null
          eye_symptoms?: Json | null
          family_chronic_disease_cancer?: boolean | null
          family_disease_details?: string | null
          father_name?: string | null
          final_opinion_date?: string | null
          final_opinion_physician?: string | null
          fitness_conditions?: string | null
          fitness_status?: string
          gender?: string
          general_symptoms?: Json | null
          gi_signs?: Json | null
          gi_symptoms?: Json | null
          has_allergies?: boolean | null
          has_prior_illness?: boolean | null
          health_risk_score?: number | null
          height_cm?: number | null
          hospitalization_details?: string | null
          hospitalization_history?: boolean | null
          id?: string
          illness_worsens_with_environment_change?: boolean | null
          industrial_area_details?: string | null
          lab_tests?: Json | null
          lives_near_industrial_area?: boolean | null
          marital_status?: string | null
          medical_commission_referral?: boolean | null
          medical_exemption?: boolean | null
          medical_exemption_reason?: string | null
          medical_recommendations?: string | null
          medication_details?: string | null
          military_service_type?: string | null
          military_status?: string | null
          musculoskeletal_signs?: Json | null
          musculoskeletal_symptoms?: Json | null
          national_code?: string | null
          neck_symptoms?: Json | null
          neurological_signs?: Json | null
          neurological_symptoms?: Json | null
          occupational_accident_history?: boolean | null
          occupational_health_code?: string | null
          organization_id?: string | null
          other_imaging?: string | null
          physical_hazards?: Json | null
          previous_jobs?: Json | null
          previous_smoking?: boolean | null
          psychological_hazards?: Json | null
          psychological_signs?: Json | null
          psychological_symptoms?: Json | null
          pulse_rate?: number | null
          regular_exercise?: boolean | null
          respiratory_signs?: Json | null
          respiratory_symptoms?: Json | null
          skin_symptoms?: Json | null
          smoking_details?: string | null
          specialized_tests?: Json | null
          spirometry_date?: string | null
          spirometry_interpretation?: string | null
          spirometry_results?: Json | null
          surgery_details?: string | null
          surgery_history?: boolean | null
          symptoms_improve_on_leave?: boolean | null
          unfitness_reasons?: string | null
          updated_at?: string
          urinary_signs?: Json | null
          urinary_symptoms?: Json | null
          vaccination_records?: Json | null
          vision_acuity_left?: string | null
          vision_acuity_left_corrected?: string | null
          vision_acuity_right?: string | null
          vision_acuity_right_corrected?: string | null
          vision_test_date?: string | null
          visual_field_left?: string | null
          visual_field_right?: string | null
          weight_kg?: number | null
          work_absence_due_illness?: boolean | null
          work_address?: string | null
          work_phone?: string | null
        }
        Update: {
          absence_details?: string | null
          accident_details?: string | null
          ai_analysis?: Json | null
          allergy_details?: string | null
          audiometry_date?: string | null
          audiometry_interpretation?: string | null
          audiometry_results?: Json | null
          biological_hazards?: Json | null
          birth_year?: string | null
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          bmi?: number | null
          cardiovascular_signs?: Json | null
          cardiovascular_symptoms?: Json | null
          chemical_hazards?: Json | null
          children_count?: number | null
          color_vision_left?: string | null
          color_vision_right?: string | null
          commission_details?: string | null
          consultations?: Json | null
          coworkers_have_similar_symptoms?: boolean | null
          created_at?: string
          created_by?: string | null
          current_jobs?: Json | null
          current_medications?: boolean | null
          currently_smoking?: boolean | null
          cxr_date?: string | null
          cxr_findings?: string | null
          depth_perception?: string | null
          ecg_date?: string | null
          ecg_findings?: string | null
          employee_id?: string
          employee_name?: string
          ent_symptoms?: Json | null
          ergonomic_hazards?: Json | null
          examination_date?: string
          examination_type?: string
          examiner_name?: string | null
          exercise_details?: string | null
          eye_symptoms?: Json | null
          family_chronic_disease_cancer?: boolean | null
          family_disease_details?: string | null
          father_name?: string | null
          final_opinion_date?: string | null
          final_opinion_physician?: string | null
          fitness_conditions?: string | null
          fitness_status?: string
          gender?: string
          general_symptoms?: Json | null
          gi_signs?: Json | null
          gi_symptoms?: Json | null
          has_allergies?: boolean | null
          has_prior_illness?: boolean | null
          health_risk_score?: number | null
          height_cm?: number | null
          hospitalization_details?: string | null
          hospitalization_history?: boolean | null
          id?: string
          illness_worsens_with_environment_change?: boolean | null
          industrial_area_details?: string | null
          lab_tests?: Json | null
          lives_near_industrial_area?: boolean | null
          marital_status?: string | null
          medical_commission_referral?: boolean | null
          medical_exemption?: boolean | null
          medical_exemption_reason?: string | null
          medical_recommendations?: string | null
          medication_details?: string | null
          military_service_type?: string | null
          military_status?: string | null
          musculoskeletal_signs?: Json | null
          musculoskeletal_symptoms?: Json | null
          national_code?: string | null
          neck_symptoms?: Json | null
          neurological_signs?: Json | null
          neurological_symptoms?: Json | null
          occupational_accident_history?: boolean | null
          occupational_health_code?: string | null
          organization_id?: string | null
          other_imaging?: string | null
          physical_hazards?: Json | null
          previous_jobs?: Json | null
          previous_smoking?: boolean | null
          psychological_hazards?: Json | null
          psychological_signs?: Json | null
          psychological_symptoms?: Json | null
          pulse_rate?: number | null
          regular_exercise?: boolean | null
          respiratory_signs?: Json | null
          respiratory_symptoms?: Json | null
          skin_symptoms?: Json | null
          smoking_details?: string | null
          specialized_tests?: Json | null
          spirometry_date?: string | null
          spirometry_interpretation?: string | null
          spirometry_results?: Json | null
          surgery_details?: string | null
          surgery_history?: boolean | null
          symptoms_improve_on_leave?: boolean | null
          unfitness_reasons?: string | null
          updated_at?: string
          urinary_signs?: Json | null
          urinary_symptoms?: Json | null
          vaccination_records?: Json | null
          vision_acuity_left?: string | null
          vision_acuity_left_corrected?: string | null
          vision_acuity_right?: string | null
          vision_acuity_right_corrected?: string | null
          vision_test_date?: string | null
          visual_field_left?: string | null
          visual_field_right?: string | null
          weight_kg?: number | null
          work_absence_due_illness?: boolean | null
          work_address?: string | null
          work_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "occupational_health_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          active: boolean | null
          code: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      risk_assessments: {
        Row: {
          additional_controls: string | null
          area: string
          assessment_id: string
          created_at: string
          existing_controls: string[] | null
          hazard: string
          hazard_category: string | null
          id: string
          organization_id: string | null
          probability: string
          process_name: string
          responsible_person_id: string | null
          review_date: string | null
          risk_level: string
          risk_score: number
          severity: string
          status: string | null
          updated_at: string
        }
        Insert: {
          additional_controls?: string | null
          area: string
          assessment_id: string
          created_at?: string
          existing_controls?: string[] | null
          hazard: string
          hazard_category?: string | null
          id?: string
          organization_id?: string | null
          probability: string
          process_name: string
          responsible_person_id?: string | null
          review_date?: string | null
          risk_level: string
          risk_score: number
          severity: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          additional_controls?: string | null
          area?: string
          assessment_id?: string
          created_at?: string
          existing_controls?: string[] | null
          hazard?: string
          hazard_category?: string | null
          id?: string
          organization_id?: string | null
          probability?: string
          process_name?: string
          responsible_person_id?: string | null
          review_date?: string | null
          risk_level?: string
          risk_score?: number
          severity?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_assessments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_assessments_responsible_person_id_fkey"
            columns: ["responsible_person_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      role_audit_log: {
        Row: {
          action: string
          changed_at: string
          changed_by: string
          id: string
          ip_address: unknown
          role_changed: Database["public"]["Enums"]["app_role"]
          target_user_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          changed_at?: string
          changed_by: string
          id?: string
          ip_address?: unknown
          role_changed: Database["public"]["Enums"]["app_role"]
          target_user_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          changed_at?: string
          changed_by?: string
          id?: string
          ip_address?: unknown
          role_changed?: Database["public"]["Enums"]["app_role"]
          target_user_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      safety_trainings: {
        Row: {
          ai_analysis: Json | null
          assessment_method: string | null
          attendance_count: number | null
          certificate_issued: boolean | null
          created_at: string
          department: string
          duration_hours: number
          effectiveness_score: number | null
          follow_up_required: boolean | null
          id: string
          instructor_name: string
          objectives: string[] | null
          organization_id: string | null
          participants: string[] | null
          pass_count: number | null
          pass_score: number | null
          status: string
          training_content: string | null
          training_date: string
          training_title: string
          training_type: string
          updated_at: string
        }
        Insert: {
          ai_analysis?: Json | null
          assessment_method?: string | null
          attendance_count?: number | null
          certificate_issued?: boolean | null
          created_at?: string
          department: string
          duration_hours?: number
          effectiveness_score?: number | null
          follow_up_required?: boolean | null
          id?: string
          instructor_name: string
          objectives?: string[] | null
          organization_id?: string | null
          participants?: string[] | null
          pass_count?: number | null
          pass_score?: number | null
          status?: string
          training_content?: string | null
          training_date: string
          training_title: string
          training_type: string
          updated_at?: string
        }
        Update: {
          ai_analysis?: Json | null
          assessment_method?: string | null
          attendance_count?: number | null
          certificate_issued?: boolean | null
          created_at?: string
          department?: string
          duration_hours?: number
          effectiveness_score?: number | null
          follow_up_required?: boolean | null
          id?: string
          instructor_name?: string
          objectives?: string[] | null
          organization_id?: string | null
          participants?: string[] | null
          pass_count?: number | null
          pass_score?: number | null
          status?: string
          training_content?: string | null
          training_date?: string
          training_title?: string
          training_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "safety_trainings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          active: boolean | null
          created_at: string
          department: string | null
          display_name: string | null
          email: string | null
          id: string
          last_login: string | null
          name: string
          organization_id: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          last_login?: string | null
          name: string
          organization_id?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          last_login?: string | null
          name?: string
          organization_id?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      work_permits: {
        Row: {
          approver_id: string | null
          created_at: string
          end_time: string
          hazards: string[] | null
          id: string
          organization_id: string | null
          permit_date: string
          permit_number: string
          precautions: string[] | null
          requester_id: string | null
          start_time: string
          status: string
          type: string
          updated_at: string
          valid_until: string | null
          witnesses: string[] | null
          work_description: string | null
        }
        Insert: {
          approver_id?: string | null
          created_at?: string
          end_time: string
          hazards?: string[] | null
          id?: string
          organization_id?: string | null
          permit_date: string
          permit_number: string
          precautions?: string[] | null
          requester_id?: string | null
          start_time: string
          status?: string
          type: string
          updated_at?: string
          valid_until?: string | null
          witnesses?: string[] | null
          work_description?: string | null
        }
        Update: {
          approver_id?: string | null
          created_at?: string
          end_time?: string
          hazards?: string[] | null
          id?: string
          organization_id?: string | null
          permit_date?: string
          permit_number?: string
          precautions?: string[] | null
          requester_id?: string | null
          start_time?: string
          status?: string
          type?: string
          updated_at?: string
          valid_until?: string | null
          witnesses?: string[] | null
          work_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_permits_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "work_permits_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_permits_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      health_examinations_limited: {
        Row: {
          created_at: string | null
          department: string | null
          employee_id: string | null
          employee_name: string | null
          examination_date: string | null
          examination_type: string | null
          examiner_name: string | null
          fitness_for_work: string | null
          id: string | null
          next_examination_date: string | null
          position: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          employee_id?: string | null
          employee_name?: string | null
          examination_date?: string | null
          examination_type?: string | null
          examiner_name?: string | null
          fitness_for_work?: string | null
          id?: string | null
          next_examination_date?: string | null
          position?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          employee_id?: string | null
          employee_name?: string | null
          examination_date?: string | null
          examination_type?: string | null
          examiner_name?: string | null
          fitness_for_work?: string | null
          id?: string | null
          next_examination_date?: string | null
          position?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_view_limited_health_data: { Args: never; Returns: boolean }
      get_current_user_role: { Args: never; Returns: string }
      get_user_organization: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "developer"
        | "admin"
        | "senior_manager"
        | "supervisor"
        | "safety_officer"
        | "medical_officer"
        | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "developer",
        "admin",
        "senior_manager",
        "supervisor",
        "safety_officer",
        "medical_officer",
        "viewer",
      ],
    },
  },
} as const
