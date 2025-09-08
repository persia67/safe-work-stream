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
    PostgrestVersion: "13.0.4"
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
          position?: string
          respiratory_function?: string | null
          status?: string | null
          updated_at?: string
          vision_test_result?: string | null
        }
        Relationships: []
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
            foreignKeyName: "incidents_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
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
            foreignKeyName: "risk_assessments_responsible_person_id_fkey"
            columns: ["responsible_person_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
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
        Relationships: []
      }
      user_profiles: {
        Row: {
          active: boolean | null
          created_at: string
          department: string | null
          email: string | null
          id: string
          last_login: string | null
          name: string
          phone: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          department?: string | null
          email?: string | null
          id?: string
          last_login?: string | null
          name: string
          phone?: string | null
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          department?: string | null
          email?: string | null
          id?: string
          last_login?: string | null
          name?: string
          phone?: string | null
          role?: string
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
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
