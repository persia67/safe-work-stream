import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, Briefcase, AlertTriangle, FileText, Stethoscope, 
  FlaskConical, Eye, Ear, Activity, Brain, ClipboardCheck,
  Save, ChevronRight, ChevronLeft, Heart, Bone, Wind
} from 'lucide-react';

interface OccupationalHealthRecordFormProps {
  employeeId?: string;
  employeeName?: string;
  onSave?: () => void;
  onCancel?: () => void;
  existingRecord?: any;
}

const OccupationalHealthRecordForm: React.FC<OccupationalHealthRecordFormProps> = ({
  employeeId = '',
  employeeName = '',
  onSave,
  onCancel,
  existingRecord
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    // Section 1: Personal Information
    employee_id: employeeId,
    employee_name: employeeName,
    father_name: '',
    gender: 'مرد',
    marital_status: 'مجرد',
    children_count: 0,
    national_code: '',
    birth_year: '',
    military_status: '',
    military_service_type: '',
    medical_exemption: false,
    medical_exemption_reason: '',
    work_address: '',
    work_phone: '',
    
    // Section 2: Employment History
    current_jobs: [] as any[],
    previous_jobs: [] as any[],
    
    // Section 3: Hazardous Factors
    physical_hazards: {
      noise: false,
      vibration: false,
      ionizing_radiation: false,
      non_ionizing_radiation: false,
      heat_stress: false
    },
    chemical_hazards: {
      dust: false,
      metal_fumes: false,
      solvents: false,
      acids_bases: false,
      gases: false,
      pesticides: false
    },
    biological_hazards: {
      bacteria: false,
      virus: false,
      parasite: false,
      bites: false
    },
    ergonomic_hazards: {
      prolonged_sitting: false,
      prolonged_standing: false,
      repetitive_work: false,
      heavy_lifting: false,
      awkward_posture: false
    },
    psychological_hazards: {
      shift_work: false,
      work_stress: false
    },
    
    // Section 4: Medical History Questions
    has_prior_illness: false,
    illness_worsens_with_environment_change: false,
    coworkers_have_similar_symptoms: false,
    symptoms_improve_on_leave: false,
    has_allergies: false,
    allergy_details: '',
    hospitalization_history: false,
    hospitalization_details: '',
    surgery_history: false,
    surgery_details: '',
    family_chronic_disease_cancer: false,
    family_disease_details: '',
    current_medications: false,
    medication_details: '',
    currently_smoking: false,
    previous_smoking: false,
    smoking_details: '',
    regular_exercise: false,
    exercise_details: '',
    occupational_accident_history: false,
    accident_details: '',
    work_absence_due_illness: false,
    absence_details: '',
    lives_near_industrial_area: false,
    industrial_area_details: '',
    medical_commission_referral: false,
    commission_details: '',
    
    // Section 5: Physical Examination
    examination_type: 'دوره‌ای',
    height_cm: '',
    weight_kg: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    pulse_rate: '',
    
    // Symptoms
    general_symptoms: {
      weight_loss: false,
      appetite_loss: false,
      fatigue: false,
      sleep_disorder: false,
      excessive_sweating: false,
      heat_cold_intolerance: false,
      fever: false
    },
    eye_symptoms: {
      vision_reduction: false,
      blurred_vision: false,
      eye_fatigue: false,
      double_vision: false,
      burning: false,
      itching: false,
      light_sensitivity: false,
      tearing: false
    },
    skin_symptoms: {
      itching: false,
      hair_loss: false,
      redness: false,
      color_change: false,
      peeling: false,
      nail_color_change: false
    },
    ent_symptoms: {
      hearing_loss: false,
      tinnitus: false,
      vertigo: false,
      ear_pain: false,
      ear_discharge: false,
      hoarseness: false,
      throat_pain: false,
      nasal_discharge: false,
      smell_disorder: false
    },
    neck_symptoms: {
      neck_pain: false,
      neck_mass: false
    },
    respiratory_symptoms: {
      cough: false,
      sputum: false,
      dyspnea: false,
      wheezing: false,
      chest_pain: false
    },
    cardiovascular_symptoms: {
      chest_pain: false,
      palpitation: false,
      nocturnal_dyspnea: false,
      orthopnea: false,
      cyanosis: false,
      syncope: false
    },
    gi_symptoms: {
      loss_appetite: false,
      nausea: false,
      vomiting: false,
      abdominal_pain: false,
      heartburn: false,
      constipation: false,
      tarry_stool: false,
      bloody_stool: false
    },
    urinary_symptoms: {
      dysuria: false,
      frequency: false,
      hematuria: false,
      flank_pain: false,
      pelvic_heaviness: false
    },
    musculoskeletal_symptoms: {
      joint_stiffness: false,
      back_pain: false,
      knee_pain: false,
      shoulder_pain: false,
      other_joint_pain: false
    },
    neurological_symptoms: {
      headache: false,
      dizziness: false,
      tremor: false,
      memory_problems: false,
      seizure_history: false,
      finger_paresthesia: false
    },
    psychological_symptoms: {
      excessive_anger: false,
      aggression: false,
      anxiety: false,
      low_mood: false,
      reduced_motivation: false
    },
    
    // Section 6: Lab Tests
    lab_tests: {
      wbc: '',
      rbc: '',
      hb: '',
      hct: '',
      plt: '',
      protein: '',
      glucose: '',
      fbs: '',
      cholesterol: '',
      ldl: '',
      hdl: '',
      tg: '',
      bun: '',
      cr: '',
      alt: '',
      ast: '',
      alk_ph: '',
      psa: '',
      hbs_ag: '',
      stool_exam: '',
      ppd: ''
    },
    specialized_tests: [] as any[],
    
    // Section 7: Paraclinical
    vision_acuity_left: '',
    vision_acuity_right: '',
    vision_acuity_left_corrected: '',
    vision_acuity_right_corrected: '',
    color_vision_left: '',
    color_vision_right: '',
    visual_field_left: '',
    visual_field_right: '',
    depth_perception: '',
    
    audiometry_results: {
      freq_500: '',
      freq_1000: '',
      freq_2000: '',
      freq_3000: '',
      freq_4000: '',
      freq_6000: '',
      freq_8000: '',
      srt: '',
      sds: ''
    },
    audiometry_interpretation: '',
    
    spirometry_results: {
      fev1: '',
      fev1_percent: '',
      fvc: '',
      fvc_percent: '',
      fev1_fvc_ratio: '',
      fef_25_75: '',
      pef: '',
      vext: ''
    },
    spirometry_interpretation: '',
    
    cxr_findings: '',
    ecg_findings: '',
    other_imaging: '',
    
    // Section 8: Consultations
    consultations: [] as any[],
    
    // Section 9: Final Opinion
    examiner_name: '',
    fitness_status: 'مناسب',
    fitness_conditions: '',
    unfitness_reasons: '',
    medical_recommendations: '',
    final_opinion_physician: '',
    occupational_health_code: ''
  });

  useEffect(() => {
    if (existingRecord) {
      setFormData(prev => ({
        ...prev,
        ...existingRecord,
        physical_hazards: existingRecord.physical_hazards || prev.physical_hazards,
        chemical_hazards: existingRecord.chemical_hazards || prev.chemical_hazards,
        biological_hazards: existingRecord.biological_hazards || prev.biological_hazards,
        ergonomic_hazards: existingRecord.ergonomic_hazards || prev.ergonomic_hazards,
        psychological_hazards: existingRecord.psychological_hazards || prev.psychological_hazards,
        general_symptoms: existingRecord.general_symptoms || prev.general_symptoms,
        eye_symptoms: existingRecord.eye_symptoms || prev.eye_symptoms,
        skin_symptoms: existingRecord.skin_symptoms || prev.skin_symptoms,
        ent_symptoms: existingRecord.ent_symptoms || prev.ent_symptoms,
        neck_symptoms: existingRecord.neck_symptoms || prev.neck_symptoms,
        respiratory_symptoms: existingRecord.respiratory_symptoms || prev.respiratory_symptoms,
        cardiovascular_symptoms: existingRecord.cardiovascular_symptoms || prev.cardiovascular_symptoms,
        gi_symptoms: existingRecord.gi_symptoms || prev.gi_symptoms,
        urinary_symptoms: existingRecord.urinary_symptoms || prev.urinary_symptoms,
        musculoskeletal_symptoms: existingRecord.musculoskeletal_symptoms || prev.musculoskeletal_symptoms,
        neurological_symptoms: existingRecord.neurological_symptoms || prev.neurological_symptoms,
        psychological_symptoms: existingRecord.psychological_symptoms || prev.psychological_symptoms,
        lab_tests: existingRecord.lab_tests || prev.lab_tests,
        audiometry_results: existingRecord.audiometry_results || prev.audiometry_results,
        spirometry_results: existingRecord.spirometry_results || prev.spirometry_results
      }));
    }
  }, [existingRecord]);

  const handleSave = async () => {
    if (!formData.employee_id || !formData.employee_name) {
      toast({
        title: 'خطا',
        description: 'نام و کد پرسنلی کارگر الزامی است',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

      // Calculate BMI
      const height = parseFloat(formData.height_cm as string);
      const weight = parseFloat(formData.weight_kg as string);
      const bmi = height && weight ? (weight / ((height / 100) ** 2)).toFixed(2) : null;

      const dataToSave = {
        ...formData,
        organization_id: profileData?.organization_id,
        created_by: user.id,
        bmi: bmi ? parseFloat(bmi) : null,
        height_cm: height || null,
        weight_kg: weight || null,
        blood_pressure_systolic: formData.blood_pressure_systolic ? parseInt(formData.blood_pressure_systolic as string) : null,
        blood_pressure_diastolic: formData.blood_pressure_diastolic ? parseInt(formData.blood_pressure_diastolic as string) : null,
        pulse_rate: formData.pulse_rate ? parseInt(formData.pulse_rate as string) : null,
        examination_date: new Date().toISOString().split('T')[0],
        final_opinion_date: new Date().toISOString().split('T')[0]
      };

      if (existingRecord?.id) {
        const { error } = await supabase
          .from('occupational_health_records')
          .update(dataToSave as any)
          .eq('id', existingRecord.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('occupational_health_records')
          .insert([dataToSave as any]);
        if (error) throw error;
      }

      toast({
        title: 'موفقیت',
        description: 'پرونده سلامت شغلی ذخیره شد'
      });

      onSave?.();
    } catch (error) {
      console.error('Error saving record:', error);
      toast({
        title: 'خطا در ذخیره',
        description: 'امکان ذخیره پرونده وجود ندارد',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const updateNestedField = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as object),
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'personal', label: 'مشخصات فردی', icon: User },
    { id: 'employment', label: 'سوابق شغلی', icon: Briefcase },
    { id: 'hazards', label: 'عوامل زیان‌آور', icon: AlertTriangle },
    { id: 'history', label: 'سوابق پزشکی', icon: FileText },
    { id: 'examination', label: 'معاینات', icon: Stethoscope },
    { id: 'symptoms', label: 'علائم بالینی', icon: Activity },
    { id: 'lab', label: 'آزمایشات', icon: FlaskConical },
    { id: 'paraclinical', label: 'پاراکلینیک', icon: Eye },
    { id: 'final', label: 'نظریه نهایی', icon: ClipboardCheck }
  ];

  const currentTabIndex = tabs.findIndex(t => t.id === activeTab);

  const goToNextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  const goToPrevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
  };

  const CheckboxField = ({
    label,
    section,
    field
  }: {
    label: string;
    section: string;
    field: string;
  }) => {
    const sectionData = formData[section as keyof typeof formData] as Record<string, boolean>;
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          id={`${section}-${field}`}
          checked={sectionData?.[field] || false}
          onCheckedChange={(checked) => updateNestedField(section, field, checked)}
        />
        <Label htmlFor={`${section}-${field}`} className="text-sm cursor-pointer">
          {label}
        </Label>
      </div>
    );
  };

  const QuestionField = ({
    label,
    field,
    detailField
  }: {
    label: string;
    field: keyof typeof formData;
    detailField?: keyof typeof formData;
  }) => (
    <div className="p-3 border rounded-lg space-y-2">
      <div className="flex items-center gap-2">
        <Checkbox
          id={field as string}
          checked={formData[field] as boolean}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, [field]: checked }))}
        />
        <Label htmlFor={field as string} className="text-sm cursor-pointer flex-1">
          {label}
        </Label>
      </div>
      {detailField && formData[field] && (
        <Textarea
          placeholder="توضیحات..."
          value={formData[detailField] as string}
          onChange={(e) => setFormData(prev => ({ ...prev, [detailField]: e.target.value }))}
          className="mt-2"
        />
      )}
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-primary" />
          پرونده سلامت شغلی - فرم معاینات طب کار
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline">{formData.examination_type}</Badge>
          <Badge variant="secondary">
            {formData.employee_name || 'کارگر جدید'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <ScrollArea className="w-full">
            <TabsList className="w-full justify-start gap-1 h-auto flex-wrap p-1">
              {tabs.map((tab, index) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-1 text-xs px-2 py-1.5"
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{index + 1}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>

          {/* Section 1: Personal Information */}
          <TabsContent value="personal" className="space-y-4 mt-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              ۱- مشخصات فردی شاغل
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>نام و نام خانوادگی *</Label>
                <Input
                  value={formData.employee_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, employee_name: e.target.value }))}
                  placeholder="نام کامل"
                />
              </div>
              <div>
                <Label>نام پدر</Label>
                <Input
                  value={formData.father_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, father_name: e.target.value }))}
                />
              </div>
              <div>
                <Label>جنس</Label>
                <Select value={formData.gender} onValueChange={(v) => setFormData(prev => ({ ...prev, gender: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مرد">مرد</SelectItem>
                    <SelectItem value="زن">زن</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>وضعیت تأهل</Label>
                <Select value={formData.marital_status} onValueChange={(v) => setFormData(prev => ({ ...prev, marital_status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مجرد">مجرد</SelectItem>
                    <SelectItem value="متأهل">متأهل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>تعداد فرزند</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.children_count}
                  onChange={(e) => setFormData(prev => ({ ...prev, children_count: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label>کد ملی</Label>
                <Input
                  value={formData.national_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, national_code: e.target.value }))}
                />
              </div>
              <div>
                <Label>شماره استخدامی / کد پرسنلی *</Label>
                <Input
                  value={formData.employee_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, employee_id: e.target.value }))}
                />
              </div>
              <div>
                <Label>سال تولد</Label>
                <Input
                  value={formData.birth_year}
                  onChange={(e) => setFormData(prev => ({ ...prev, birth_year: e.target.value }))}
                  placeholder="مثال: 1370"
                />
              </div>
              <div>
                <Label>وضعیت خدمت (آقایان)</Label>
                <Select value={formData.military_status} onValueChange={(v) => setFormData(prev => ({ ...prev, military_status: v }))}>
                  <SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="کارت پایان خدمت">کارت پایان خدمت</SelectItem>
                    <SelectItem value="معافیت">معافیت</SelectItem>
                    <SelectItem value="در حال خدمت">در حال خدمت</SelectItem>
                    <SelectItem value="نامشمول">نامشمول</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Checkbox
                  id="medical_exemption"
                  checked={formData.medical_exemption}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, medical_exemption: !!checked }))}
                />
                <Label htmlFor="medical_exemption">معافیت پزشکی</Label>
              </div>
              {formData.medical_exemption && (
                <div className="md:col-span-2">
                  <Label>علت معافیت پزشکی</Label>
                  <Textarea
                    value={formData.medical_exemption_reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, medical_exemption_reason: e.target.value }))}
                  />
                </div>
              )}
              <div className="md:col-span-2">
                <Label>آدرس و تلفن محل کار</Label>
                <Textarea
                  value={formData.work_address}
                  onChange={(e) => setFormData(prev => ({ ...prev, work_address: e.target.value }))}
                />
              </div>
              <div>
                <Label>تلفن</Label>
                <Input
                  value={formData.work_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, work_phone: e.target.value }))}
                />
              </div>
            </div>
          </TabsContent>

          {/* Section 2: Employment History */}
          <TabsContent value="employment" className="space-y-4 mt-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              ۲- سوابق شغلی
            </h3>
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">مشاغل فعلی</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Input placeholder="عنوان / سمت" />
                    <Input placeholder="محل وظیفه" />
                    <Input placeholder="تاریخ شروع" />
                    <Input placeholder="تاریخ پایان" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">مشاغل قبلی</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Input placeholder="عنوان / سمت" />
                    <Input placeholder="محل وظیفه" />
                    <Input placeholder="تاریخ شروع" />
                    <Input placeholder="علت تغییر شغل" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Section 3: Hazardous Factors */}
          <TabsContent value="hazards" className="space-y-4 mt-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              ۳- ارزیابی عوامل زیان‌آور شغلی
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Physical Hazards */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-blue-600">عوامل فیزیکی</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CheckboxField label="سر و صدا" section="physical_hazards" field="noise" />
                  <CheckboxField label="ارتعاش" section="physical_hazards" field="vibration" />
                  <CheckboxField label="اشعه یونیزان" section="physical_hazards" field="ionizing_radiation" />
                  <CheckboxField label="اشعه غیر یونیزان" section="physical_hazards" field="non_ionizing_radiation" />
                  <CheckboxField label="استرس حرارتی" section="physical_hazards" field="heat_stress" />
                </CardContent>
              </Card>

              {/* Chemical Hazards */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-orange-600">عوامل شیمیایی</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CheckboxField label="گرد و غبار" section="chemical_hazards" field="dust" />
                  <CheckboxField label="دمه فلزات" section="chemical_hazards" field="metal_fumes" />
                  <CheckboxField label="حلال‌ها" section="chemical_hazards" field="solvents" />
                  <CheckboxField label="اسید و بازها" section="chemical_hazards" field="acids_bases" />
                  <CheckboxField label="گازها" section="chemical_hazards" field="gases" />
                  <CheckboxField label="آفت‌کش‌ها" section="chemical_hazards" field="pesticides" />
                </CardContent>
              </Card>

              {/* Biological Hazards */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-green-600">عوامل بیولوژیک</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CheckboxField label="باکتری" section="biological_hazards" field="bacteria" />
                  <CheckboxField label="ویروس" section="biological_hazards" field="virus" />
                  <CheckboxField label="انگل" section="biological_hazards" field="parasite" />
                  <CheckboxField label="گزش" section="biological_hazards" field="bites" />
                </CardContent>
              </Card>

              {/* Ergonomic Hazards */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-purple-600">عوامل ارگونومی</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CheckboxField label="نشستن طولانی" section="ergonomic_hazards" field="prolonged_sitting" />
                  <CheckboxField label="ایستادن طولانی" section="ergonomic_hazards" field="prolonged_standing" />
                  <CheckboxField label="کار تکراری" section="ergonomic_hazards" field="repetitive_work" />
                  <CheckboxField label="حمل و نقل بار سنگین" section="ergonomic_hazards" field="heavy_lifting" />
                  <CheckboxField label="وضعیت نامناسب بدن" section="ergonomic_hazards" field="awkward_posture" />
                </CardContent>
              </Card>

              {/* Psychological Hazards */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-red-600">عوامل روانی</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CheckboxField label="نوبت‌کاری" section="psychological_hazards" field="shift_work" />
                  <CheckboxField label="استرس‌های شغلی" section="psychological_hazards" field="work_stress" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Section 4: Medical History */}
          <TabsContent value="history" className="space-y-4 mt-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              ۴- سابقه شخصی، خانوادگی و پزشکی
            </h3>
            <p className="text-sm text-muted-foreground">
              (بر اساس پاسخ شاغل تکمیل شوند)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuestionField 
                label="۱- آیا سابقه بیماری دارید؟"
                field="has_prior_illness"
              />
              <QuestionField 
                label="۲- آیا در صورت تغییر محیط کار علائم بیماری شما بهتر می‌شود؟"
                field="illness_worsens_with_environment_change"
              />
              <QuestionField 
                label="۳- آیا همکاران شما در محل کار علائم مشابه دارند؟"
                field="coworkers_have_similar_symptoms"
              />
              <QuestionField 
                label="۴- آیا در زمان مرخصی و تعطیلات علائم شما بهتر می‌شود؟"
                field="symptoms_improve_on_leave"
              />
              <QuestionField 
                label="۵- آیا حساسیت خاصی به ماده، غذا یا دارو دارید؟"
                field="has_allergies"
                detailField="allergy_details"
              />
              <QuestionField 
                label="۶- آیا سابقه بستری در بیمارستان دارید؟"
                field="hospitalization_history"
                detailField="hospitalization_details"
              />
              <QuestionField 
                label="۷- آیا سابقه عمل جراحی دارید؟"
                field="surgery_history"
                detailField="surgery_details"
              />
              <QuestionField 
                label="۸- آیا در خانواده سابقه سرطان یا بیماری مزمن دارید؟"
                field="family_chronic_disease_cancer"
                detailField="family_disease_details"
              />
              <QuestionField 
                label="۹- آیا داروی خاصی مصرف می‌کنید؟"
                field="current_medications"
                detailField="medication_details"
              />
              <QuestionField 
                label="۱۰- آیا اکنون سیگار می‌کشید؟"
                field="currently_smoking"
                detailField="smoking_details"
              />
              <QuestionField 
                label="۱۱- آیا سابقه مصرف سیگار قبلی دارید؟"
                field="previous_smoking"
              />
              <QuestionField 
                label="۱۲- آیا مشغول ورزش یا سرگرمی خاصی هستید؟"
                field="regular_exercise"
                detailField="exercise_details"
              />
              <QuestionField 
                label="۱۳- آیا تاکنون دچار حادثه شغلی شده‌اید؟"
                field="occupational_accident_history"
                detailField="accident_details"
              />
              <QuestionField 
                label="۱۴- آیا سابقه غیبت از کار به دلیل بیماری دارید؟"
                field="work_absence_due_illness"
                detailField="absence_details"
              />
              <QuestionField 
                label="۱۵- آیا منزل شما در مجاورت مرکز صنعتی قرار دارد؟"
                field="lives_near_industrial_area"
                detailField="industrial_area_details"
              />
              <QuestionField 
                label="۱۶- آیا سابقه معرفی به کمیسیون پزشکی دارید؟"
                field="medical_commission_referral"
                detailField="commission_details"
              />
            </div>
          </TabsContent>

          {/* Section 5: Physical Examination */}
          <TabsContent value="examination" className="space-y-4 mt-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Stethoscope className="w-5 h-5" />
              ۵- معاینات
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>نوع معاینات</Label>
                <Select value={formData.examination_type} onValueChange={(v) => setFormData(prev => ({ ...prev, examination_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="بدواستخدام">بدواستخدام</SelectItem>
                    <SelectItem value="دوره‌ای">دوره‌ای</SelectItem>
                    <SelectItem value="موردی">موردی</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>قد (سانتی‌متر)</Label>
                <Input
                  type="number"
                  value={formData.height_cm}
                  onChange={(e) => setFormData(prev => ({ ...prev, height_cm: e.target.value }))}
                />
              </div>
              <div>
                <Label>وزن (کیلوگرم)</Label>
                <Input
                  type="number"
                  value={formData.weight_kg}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight_kg: e.target.value }))}
                />
              </div>
              <div>
                <Label>فشار خون سیستولیک (mmHg)</Label>
                <Input
                  type="number"
                  value={formData.blood_pressure_systolic}
                  onChange={(e) => setFormData(prev => ({ ...prev, blood_pressure_systolic: e.target.value }))}
                />
              </div>
              <div>
                <Label>فشار خون دیاستولیک (mmHg)</Label>
                <Input
                  type="number"
                  value={formData.blood_pressure_diastolic}
                  onChange={(e) => setFormData(prev => ({ ...prev, blood_pressure_diastolic: e.target.value }))}
                />
              </div>
              <div>
                <Label>تعداد نبض (در دقیقه)</Label>
                <Input
                  type="number"
                  value={formData.pulse_rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, pulse_rate: e.target.value }))}
                />
              </div>
            </div>
          </TabsContent>

          {/* Section: Symptoms */}
          <TabsContent value="symptoms" className="space-y-6 mt-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Activity className="w-5 h-5" />
              علائم و نشانه‌های بالینی
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* General Symptoms */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    علائم عمومی
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <CheckboxField label="کاهش وزن" section="general_symptoms" field="weight_loss" />
                  <CheckboxField label="کاهش اشتها" section="general_symptoms" field="appetite_loss" />
                  <CheckboxField label="خستگی" section="general_symptoms" field="fatigue" />
                  <CheckboxField label="اختلال در خواب" section="general_symptoms" field="sleep_disorder" />
                  <CheckboxField label="تعریق بیش از حد" section="general_symptoms" field="excessive_sweating" />
                  <CheckboxField label="عدم تحمل گرما/سرما" section="general_symptoms" field="heat_cold_intolerance" />
                  <CheckboxField label="تب" section="general_symptoms" field="fever" />
                </CardContent>
              </Card>

              {/* Eye Symptoms */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    چشم
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <CheckboxField label="کاهش بینایی" section="eye_symptoms" field="vision_reduction" />
                  <CheckboxField label="تاری دید" section="eye_symptoms" field="blurred_vision" />
                  <CheckboxField label="خستگی چشم" section="eye_symptoms" field="eye_fatigue" />
                  <CheckboxField label="دوبینی" section="eye_symptoms" field="double_vision" />
                  <CheckboxField label="سوزش چشم" section="eye_symptoms" field="burning" />
                  <CheckboxField label="خارش چشم" section="eye_symptoms" field="itching" />
                  <CheckboxField label="ترس از نور" section="eye_symptoms" field="light_sensitivity" />
                  <CheckboxField label="ریزش اشک" section="eye_symptoms" field="tearing" />
                </CardContent>
              </Card>

              {/* Skin Symptoms */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">پوست</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <CheckboxField label="خارش پوست" section="skin_symptoms" field="itching" />
                  <CheckboxField label="ریزش مو" section="skin_symptoms" field="hair_loss" />
                  <CheckboxField label="قرمزی پوست" section="skin_symptoms" field="redness" />
                  <CheckboxField label="تغییر رنگ پوست" section="skin_symptoms" field="color_change" />
                  <CheckboxField label="ریزش پوست" section="skin_symptoms" field="peeling" />
                  <CheckboxField label="تغییر رنگ ناخن" section="skin_symptoms" field="nail_color_change" />
                </CardContent>
              </Card>

              {/* ENT Symptoms */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Ear className="w-4 h-4" />
                    گوش، حلق و بینی
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <CheckboxField label="کاهش شنوایی" section="ent_symptoms" field="hearing_loss" />
                  <CheckboxField label="وزوز گوش" section="ent_symptoms" field="tinnitus" />
                  <CheckboxField label="سرگیجه واقعی" section="ent_symptoms" field="vertigo" />
                  <CheckboxField label="درد گوش" section="ent_symptoms" field="ear_pain" />
                  <CheckboxField label="ترشح گوش" section="ent_symptoms" field="ear_discharge" />
                  <CheckboxField label="گرفتگی صدا" section="ent_symptoms" field="hoarseness" />
                  <CheckboxField label="درد گلو" section="ent_symptoms" field="throat_pain" />
                  <CheckboxField label="آبریزش بینی" section="ent_symptoms" field="nasal_discharge" />
                  <CheckboxField label="اختلال بویایی" section="ent_symptoms" field="smell_disorder" />
                </CardContent>
              </Card>

              {/* Respiratory Symptoms */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Wind className="w-4 h-4" />
                    ریه
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <CheckboxField label="سرفه" section="respiratory_symptoms" field="cough" />
                  <CheckboxField label="خلط" section="respiratory_symptoms" field="sputum" />
                  <CheckboxField label="تنگی نفس کوششی" section="respiratory_symptoms" field="dyspnea" />
                  <CheckboxField label="خس‌خس سینه" section="respiratory_symptoms" field="wheezing" />
                  <CheckboxField label="درد قفسه سینه" section="respiratory_symptoms" field="chest_pain" />
                </CardContent>
              </Card>

              {/* Cardiovascular Symptoms */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    قلب و عروق
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <CheckboxField label="درد قفسه سینه" section="cardiovascular_symptoms" field="chest_pain" />
                  <CheckboxField label="تپش قلب" section="cardiovascular_symptoms" field="palpitation" />
                  <CheckboxField label="تنگی نفس شبانه ناگهانی" section="cardiovascular_symptoms" field="nocturnal_dyspnea" />
                  <CheckboxField label="تنگی نفس در وضعیت خوابیده" section="cardiovascular_symptoms" field="orthopnea" />
                  <CheckboxField label="سیانوز" section="cardiovascular_symptoms" field="cyanosis" />
                  <CheckboxField label="سابقه سنکوپ" section="cardiovascular_symptoms" field="syncope" />
                </CardContent>
              </Card>

              {/* GI Symptoms */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">گوارش</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <CheckboxField label="بی‌اشتهایی" section="gi_symptoms" field="loss_appetite" />
                  <CheckboxField label="تهوع" section="gi_symptoms" field="nausea" />
                  <CheckboxField label="استفراغ" section="gi_symptoms" field="vomiting" />
                  <CheckboxField label="درد شکم" section="gi_symptoms" field="abdominal_pain" />
                  <CheckboxField label="سوزش سر دل" section="gi_symptoms" field="heartburn" />
                  <CheckboxField label="یبوست" section="gi_symptoms" field="constipation" />
                  <CheckboxField label="مدفوع قیری" section="gi_symptoms" field="tarry_stool" />
                  <CheckboxField label="خون در مدفوع" section="gi_symptoms" field="bloody_stool" />
                </CardContent>
              </Card>

              {/* Urinary Symptoms */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">ادراری</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <CheckboxField label="سوزش ادرار" section="urinary_symptoms" field="dysuria" />
                  <CheckboxField label="تکرر ادرار" section="urinary_symptoms" field="frequency" />
                  <CheckboxField label="ادرار خونی" section="urinary_symptoms" field="hematuria" />
                  <CheckboxField label="درد پهلو" section="urinary_symptoms" field="flank_pain" />
                  <CheckboxField label="احساس سنگینی در لگن" section="urinary_symptoms" field="pelvic_heaviness" />
                </CardContent>
              </Card>

              {/* Musculoskeletal Symptoms */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Bone className="w-4 h-4" />
                    عضلانی اسکلتی
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <CheckboxField label="خشکی مفصل" section="musculoskeletal_symptoms" field="joint_stiffness" />
                  <CheckboxField label="درد کمر" section="musculoskeletal_symptoms" field="back_pain" />
                  <CheckboxField label="درد زانو" section="musculoskeletal_symptoms" field="knee_pain" />
                  <CheckboxField label="درد شانه" section="musculoskeletal_symptoms" field="shoulder_pain" />
                  <CheckboxField label="درد سایر مفاصل" section="musculoskeletal_symptoms" field="other_joint_pain" />
                </CardContent>
              </Card>

              {/* Neurological Symptoms */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    عصبی
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <CheckboxField label="سردرد" section="neurological_symptoms" field="headache" />
                  <CheckboxField label="گیجی" section="neurological_symptoms" field="dizziness" />
                  <CheckboxField label="لرزش" section="neurological_symptoms" field="tremor" />
                  <CheckboxField label="اختلال حافظه" section="neurological_symptoms" field="memory_problems" />
                  <CheckboxField label="سابقه صرع/تشنج" section="neurological_symptoms" field="seizure_history" />
                  <CheckboxField label="گزگز و مورمور انگشتان دست" section="neurological_symptoms" field="finger_paresthesia" />
                </CardContent>
              </Card>

              {/* Psychological Symptoms */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">روانی</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <CheckboxField label="عصبانیت بیش از حد" section="psychological_symptoms" field="excessive_anger" />
                  <CheckboxField label="پرخاشگری" section="psychological_symptoms" field="aggression" />
                  <CheckboxField label="اضطراب" section="psychological_symptoms" field="anxiety" />
                  <CheckboxField label="خلق پایین" section="psychological_symptoms" field="low_mood" />
                  <CheckboxField label="کاهش انگیزه" section="psychological_symptoms" field="reduced_motivation" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Section 6: Lab Tests */}
          <TabsContent value="lab" className="space-y-4 mt-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <FlaskConical className="w-5 h-5" />
              ۶- آزمایشات
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">CBC</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">WBC</Label>
                    <Input 
                      value={formData.lab_tests.wbc}
                      onChange={(e) => updateNestedField('lab_tests', 'wbc', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">RBC</Label>
                    <Input 
                      value={formData.lab_tests.rbc}
                      onChange={(e) => updateNestedField('lab_tests', 'rbc', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Hb</Label>
                    <Input 
                      value={formData.lab_tests.hb}
                      onChange={(e) => updateNestedField('lab_tests', 'hb', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">HCT</Label>
                    <Input 
                      value={formData.lab_tests.hct}
                      onChange={(e) => updateNestedField('lab_tests', 'hct', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Plt</Label>
                    <Input 
                      value={formData.lab_tests.plt}
                      onChange={(e) => updateNestedField('lab_tests', 'plt', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">U/A</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Protein</Label>
                    <Input 
                      value={formData.lab_tests.protein}
                      onChange={(e) => updateNestedField('lab_tests', 'protein', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Glucose</Label>
                    <Input 
                      value={formData.lab_tests.glucose}
                      onChange={(e) => updateNestedField('lab_tests', 'glucose', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">بیوشیمی</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">FBS</Label>
                    <Input 
                      value={formData.lab_tests.fbs}
                      onChange={(e) => updateNestedField('lab_tests', 'fbs', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Cholesterol</Label>
                    <Input 
                      value={formData.lab_tests.cholesterol}
                      onChange={(e) => updateNestedField('lab_tests', 'cholesterol', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">LDL</Label>
                    <Input 
                      value={formData.lab_tests.ldl}
                      onChange={(e) => updateNestedField('lab_tests', 'ldl', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">HDL</Label>
                    <Input 
                      value={formData.lab_tests.hdl}
                      onChange={(e) => updateNestedField('lab_tests', 'hdl', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">TG</Label>
                    <Input 
                      value={formData.lab_tests.tg}
                      onChange={(e) => updateNestedField('lab_tests', 'tg', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">BUN</Label>
                    <Input 
                      value={formData.lab_tests.bun}
                      onChange={(e) => updateNestedField('lab_tests', 'bun', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Cr</Label>
                    <Input 
                      value={formData.lab_tests.cr}
                      onChange={(e) => updateNestedField('lab_tests', 'cr', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">ALT</Label>
                    <Input 
                      value={formData.lab_tests.alt}
                      onChange={(e) => updateNestedField('lab_tests', 'alt', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">AST</Label>
                    <Input 
                      value={formData.lab_tests.ast}
                      onChange={(e) => updateNestedField('lab_tests', 'ast', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">ALK.Ph</Label>
                    <Input 
                      value={formData.lab_tests.alk_ph}
                      onChange={(e) => updateNestedField('lab_tests', 'alk_ph', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">PSA</Label>
                    <Input 
                      value={formData.lab_tests.psa}
                      onChange={(e) => updateNestedField('lab_tests', 'psa', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">سایر آزمایشات</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">HBS Ag</Label>
                    <Input 
                      value={formData.lab_tests.hbs_ag}
                      onChange={(e) => updateNestedField('lab_tests', 'hbs_ag', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">S/E & OB</Label>
                    <Input 
                      value={formData.lab_tests.stool_exam}
                      onChange={(e) => updateNestedField('lab_tests', 'stool_exam', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">PPD</Label>
                    <Input 
                      value={formData.lab_tests.ppd}
                      onChange={(e) => updateNestedField('lab_tests', 'ppd', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Section 7: Paraclinical */}
          <TabsContent value="paraclinical" className="space-y-6 mt-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Eye className="w-5 h-5" />
              ۷- پاراکلینیک
            </h3>
            
            {/* Optometry */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">الف- اپتومتری</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs">حدت بینایی چپ</Label>
                    <Input 
                      value={formData.vision_acuity_left}
                      onChange={(e) => setFormData(prev => ({ ...prev, vision_acuity_left: e.target.value }))}
                      placeholder="/10"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">حدت بینایی راست</Label>
                    <Input 
                      value={formData.vision_acuity_right}
                      onChange={(e) => setFormData(prev => ({ ...prev, vision_acuity_right: e.target.value }))}
                      placeholder="/10"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">با اصلاح چپ</Label>
                    <Input 
                      value={formData.vision_acuity_left_corrected}
                      onChange={(e) => setFormData(prev => ({ ...prev, vision_acuity_left_corrected: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">با اصلاح راست</Label>
                    <Input 
                      value={formData.vision_acuity_right_corrected}
                      onChange={(e) => setFormData(prev => ({ ...prev, vision_acuity_right_corrected: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">دید رنگی چپ</Label>
                    <Select value={formData.color_vision_left} onValueChange={(v) => setFormData(prev => ({ ...prev, color_vision_left: v }))}>
                      <SelectTrigger><SelectValue placeholder="انتخاب" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="طبیعی">طبیعی</SelectItem>
                        <SelectItem value="غیرطبیعی">غیرطبیعی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">دید رنگی راست</Label>
                    <Select value={formData.color_vision_right} onValueChange={(v) => setFormData(prev => ({ ...prev, color_vision_right: v }))}>
                      <SelectTrigger><SelectValue placeholder="انتخاب" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="طبیعی">طبیعی</SelectItem>
                        <SelectItem value="غیرطبیعی">غیرطبیعی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">عمق دید</Label>
                    <Input 
                      value={formData.depth_perception}
                      onChange={(e) => setFormData(prev => ({ ...prev, depth_perception: e.target.value }))}
                      placeholder="ثانیه آرک"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audiometry */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Ear className="w-4 h-4" />
                  ب- ادیومتری
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 md:grid-cols-9 gap-2 mb-4">
                  {['500', '1000', '2000', '3000', '4000', '6000', '8000'].map(freq => (
                    <div key={freq}>
                      <Label className="text-xs">{freq} Hz</Label>
                      <Input 
                        value={(formData.audiometry_results as any)[`freq_${freq}`] || ''}
                        onChange={(e) => updateNestedField('audiometry_results', `freq_${freq}`, e.target.value)}
                        placeholder="dB"
                      />
                    </div>
                  ))}
                  <div>
                    <Label className="text-xs">SRT</Label>
                    <Input 
                      value={formData.audiometry_results.srt}
                      onChange={(e) => updateNestedField('audiometry_results', 'srt', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">SDS</Label>
                    <Input 
                      value={formData.audiometry_results.sds}
                      onChange={(e) => updateNestedField('audiometry_results', 'sds', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>تفسیر</Label>
                  <Textarea 
                    value={formData.audiometry_interpretation}
                    onChange={(e) => setFormData(prev => ({ ...prev, audiometry_interpretation: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Spirometry */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  ج- اسپیرومتری
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div>
                    <Label className="text-xs">FEV1 (مقدار)</Label>
                    <Input 
                      value={formData.spirometry_results.fev1}
                      onChange={(e) => updateNestedField('spirometry_results', 'fev1', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">FEV1 (درصد)</Label>
                    <Input 
                      value={formData.spirometry_results.fev1_percent}
                      onChange={(e) => updateNestedField('spirometry_results', 'fev1_percent', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">FVC (مقدار)</Label>
                    <Input 
                      value={formData.spirometry_results.fvc}
                      onChange={(e) => updateNestedField('spirometry_results', 'fvc', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">FVC (درصد)</Label>
                    <Input 
                      value={formData.spirometry_results.fvc_percent}
                      onChange={(e) => updateNestedField('spirometry_results', 'fvc_percent', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">FEV1/FVC%</Label>
                    <Input 
                      value={formData.spirometry_results.fev1_fvc_ratio}
                      onChange={(e) => updateNestedField('spirometry_results', 'fev1_fvc_ratio', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">FEF 25-75%</Label>
                    <Input 
                      value={formData.spirometry_results.fef_25_75}
                      onChange={(e) => updateNestedField('spirometry_results', 'fef_25_75', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">PEF</Label>
                    <Input 
                      value={formData.spirometry_results.pef}
                      onChange={(e) => updateNestedField('spirometry_results', 'pef', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">VEXT</Label>
                    <Input 
                      value={formData.spirometry_results.vext}
                      onChange={(e) => updateNestedField('spirometry_results', 'vext', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>تفسیر</Label>
                  <Textarea 
                    value={formData.spirometry_interpretation}
                    onChange={(e) => setFormData(prev => ({ ...prev, spirometry_interpretation: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Other Paraclinical */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">د- سایر اقدامات پاراکلینیک</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>یافته‌های CXR (P-A)</Label>
                  <Textarea 
                    value={formData.cxr_findings}
                    onChange={(e) => setFormData(prev => ({ ...prev, cxr_findings: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>یافته‌های ECG</Label>
                  <Textarea 
                    value={formData.ecg_findings}
                    onChange={(e) => setFormData(prev => ({ ...prev, ecg_findings: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>نتیجه رادیوگرافی، سونوگرافی، سی تی اسکن و سایر موارد</Label>
                  <Textarea 
                    value={formData.other_imaging}
                    onChange={(e) => setFormData(prev => ({ ...prev, other_imaging: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section 9: Final Opinion */}
          <TabsContent value="final" className="space-y-4 mt-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5" />
              ۸- نظریه نهایی پزشک متخصص طب کار/سلامت شغلی
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>نام پزشک معاینه‌کننده</Label>
                <Input
                  value={formData.examiner_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, examiner_name: e.target.value }))}
                />
              </div>
              <div>
                <Label>نام پزشک متخصص ارائه‌دهنده نظر نهایی</Label>
                <Input
                  value={formData.final_opinion_physician}
                  onChange={(e) => setFormData(prev => ({ ...prev, final_opinion_physician: e.target.value }))}
                />
              </div>
              <div>
                <Label>صلاحیت/تناسب پزشکی جهت انجام شغل</Label>
                <Select value={formData.fitness_status} onValueChange={(v) => setFormData(prev => ({ ...prev, fitness_status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مناسب">الف- مناسب</SelectItem>
                    <SelectItem value="مشروط">ب- مشروط (ذکر شروط)</SelectItem>
                    <SelectItem value="عدم صلاحیت">ج- عدم صلاحیت/تناسب پزشکی</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>کد معاینات سلامت شغلی</Label>
                <Input
                  value={formData.occupational_health_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, occupational_health_code: e.target.value }))}
                />
              </div>
              {formData.fitness_status === 'مشروط' && (
                <div className="md:col-span-2">
                  <Label>شروط</Label>
                  <Textarea
                    value={formData.fitness_conditions}
                    onChange={(e) => setFormData(prev => ({ ...prev, fitness_conditions: e.target.value }))}
                    placeholder="شرایط و محدودیت‌های کاری..."
                  />
                </div>
              )}
              {formData.fitness_status === 'عدم صلاحیت' && (
                <div className="md:col-span-2">
                  <Label>علت یا علل رد صلاحیت پزشکی</Label>
                  <Textarea
                    value={formData.unfitness_reasons}
                    onChange={(e) => setFormData(prev => ({ ...prev, unfitness_reasons: e.target.value }))}
                  />
                </div>
              )}
              <div className="md:col-span-2">
                <Label>توصیه‌های پزشکی لازم</Label>
                <Textarea
                  value={formData.medical_recommendations}
                  onChange={(e) => setFormData(prev => ({ ...prev, medical_recommendations: e.target.value }))}
                  rows={4}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        {/* Navigation & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={goToPrevTab}
              disabled={currentTabIndex === 0}
            >
              <ChevronRight className="w-4 h-4 ml-1" />
              قبلی
            </Button>
            <Button 
              variant="outline" 
              onClick={goToNextTab}
              disabled={currentTabIndex === tabs.length - 1}
            >
              بعدی
              <ChevronLeft className="w-4 h-4 mr-1" />
            </Button>
          </div>
          <div className="flex gap-2">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                انصراف
              </Button>
            )}
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 ml-2" />
              {saving ? 'در حال ذخیره...' : 'ذخیره پرونده'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OccupationalHealthRecordForm;
