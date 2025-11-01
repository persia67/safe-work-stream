import { z } from 'zod';

// Risk Assessment validation schema
export const riskAssessmentSchema = z.object({
  assessment_id: z.string().trim().min(1, 'Assessment ID is required').max(50, 'Assessment ID too long'),
  assessment_type: z.enum(['FMEA', 'HAZOP', 'JSA', 'LOPA', 'BOW_TIE', 'WHAT_IF'], {
    errorMap: () => ({ message: 'Invalid assessment type' })
  }).optional(),
  area: z.string().trim().min(1, 'Area is required').max(100, 'Area name too long'),
  process_name: z.string().trim().min(1, 'Process name is required').max(100, 'Process name too long'),
  hazard: z.string().trim().min(1, 'Hazard description is required').max(500, 'Hazard description too long'),
  hazard_category: z.string().trim().max(50, 'Category too long').optional(),
  probability: z.string().trim().min(1, 'Probability is required'),
  severity: z.string().trim().min(1, 'Severity is required'),
  risk_level: z.string().trim().min(1, 'Risk level is required'),
  risk_score: z.number().int().min(0).max(100, 'Risk score must be between 0 and 100'),
  existing_controls: z.array(z.string().max(200, 'Control description too long')).max(20, 'Too many controls'),
  additional_controls: z.string().max(1000, 'Additional controls description too long').optional(),
  review_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  status: z.string().trim().max(50, 'Status too long').optional(),
});

// Safety Training validation schema
export const safetyTrainingSchema = z.object({
  training_title: z.string().trim().min(1, 'Title is required').max(200, 'Title too long'),
  training_type: z.string().trim().min(1, 'Type is required').max(100, 'Type too long'),
  training_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  department: z.string().trim().min(1, 'Department is required').max(100, 'Department name too long'),
  instructor_name: z.string().trim().min(1, 'Instructor name is required').max(100, 'Name too long'),
  duration_hours: z.number().int().min(0).max(24, 'Duration must be between 0 and 24 hours'),
  participants: z.array(z.string().max(100, 'Participant name too long')).max(100, 'Too many participants'),
  training_content: z.string().max(5000, 'Content too long').optional(),
  objectives: z.array(z.string().max(500, 'Objective too long')).max(20, 'Too many objectives'),
  assessment_method: z.string().max(200, 'Assessment method too long').optional(),
  pass_score: z.number().int().min(0).max(100, 'Pass score must be between 0 and 100').optional(),
  status: z.string().trim().max(50, 'Status too long').optional(),
});

// Health Examination validation schema
export const healthExaminationSchema = z.object({
  employee_name: z.string().trim().min(1, 'Employee name is required').max(100, 'Name too long'),
  employee_id: z.string().trim().min(1, 'Employee ID is required').max(50, 'ID too long'),
  department: z.string().trim().min(1, 'Department is required').max(100, 'Department name too long'),
  position: z.string().trim().min(1, 'Position is required').max(100, 'Position too long'),
  examination_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  examination_type: z.string().trim().max(100, 'Type too long').optional(),
  examiner_name: z.string().trim().min(1, 'Examiner name is required').max(100, 'Name too long'),
  hearing_test_result: z.string().max(200, 'Result too long').optional(),
  vision_test_result: z.string().max(200, 'Result too long').optional(),
  blood_pressure: z.string().max(50, 'Value too long').optional(),
  respiratory_function: z.string().max(200, 'Result too long').optional(),
  musculoskeletal_assessment: z.string().max(500, 'Assessment too long').optional(),
  fitness_for_work: z.string().trim().max(50, 'Status too long').optional(),
  status: z.string().trim().max(50, 'Status too long').optional(),
});

// Incident validation schema
export const incidentSchema = z.object({
  incident_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  incident_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Invalid time format'),
  type: z.string().trim().min(1, 'Type is required').max(100, 'Type too long'),
  location: z.string().trim().min(1, 'Location is required').max(200, 'Location too long'),
  severity: z.string().trim().min(1, 'Severity is required').max(50, 'Severity too long'),
  status: z.string().trim().max(50, 'Status too long').optional(),
  description: z.string().max(2000, 'Description too long').optional(),
  injured_person: z.string().max(100, 'Name too long').optional(),
  witness_count: z.number().int().min(0).max(100, 'Invalid witness count').optional(),
  immediate_action: z.string().max(1000, 'Action description too long').optional(),
  root_cause: z.string().max(1000, 'Root cause too long').optional(),
  preventive_action: z.string().max(1000, 'Preventive action too long').optional(),
});

// Work Permit validation schema
export const workPermitSchema = z.object({
  permit_number: z.string().trim().min(1, 'Permit number is required').max(50, 'Permit number too long'),
  type: z.string().trim().min(1, 'Type is required').max(100, 'Type too long'),
  permit_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  start_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Invalid time format'),
  end_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Invalid time format'),
  valid_until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  work_description: z.string().max(1000, 'Description too long').optional(),
  hazards: z.array(z.string().max(200, 'Hazard description too long')).max(20, 'Too many hazards').optional(),
  precautions: z.array(z.string().max(200, 'Precaution too long')).max(20, 'Too many precautions').optional(),
  witnesses: z.array(z.string().max(100, 'Witness name too long')).max(10, 'Too many witnesses').optional(),
  status: z.string().trim().max(50, 'Status too long').optional(),
});

// Daily Report validation schema
export const dailyReportSchema = z.object({
  report_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  shift: z.string().trim().min(1, 'Shift is required').max(50, 'Shift too long'),
  start_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Invalid time format'),
  end_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Invalid time format'),
  weather: z.string().max(50, 'Weather description too long').optional(),
  temperature: z.string().max(20, 'Temperature value too long').optional(),
  inspections: z.number().int().min(0).max(1000, 'Invalid inspections count').optional(),
  training_sessions: z.number().int().min(0).max(100, 'Invalid training sessions count').optional(),
  violations: z.number().int().min(0).max(1000, 'Invalid violations count').optional(),
  near_misses: z.number().int().min(0).max(1000, 'Invalid near misses count').optional(),
  accidents: z.number().int().min(0).max(100, 'Invalid accidents count').optional(),
  ppe_distributed: z.number().int().min(0).max(10000, 'Invalid PPE count').optional(),
  maintenance_requests: z.number().int().min(0).max(1000, 'Invalid maintenance requests count').optional(),
  report_text: z.string().max(5000, 'Report text too long').optional(),
  suggestions: z.string().max(2000, 'Suggestions too long').optional(),
  status: z.string().trim().max(50, 'Status too long').optional(),
});
