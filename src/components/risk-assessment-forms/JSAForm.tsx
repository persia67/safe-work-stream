import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, Trash2 } from 'lucide-react';

interface JSAFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

interface JobStep {
  step_number: number;
  description: string;
  hazards: string;
  hazard_type: string;
  risk_level: string;
  controls: string;
}

const PPE_OPTIONS = [
  { id: 'helmet', label: 'کلاه ایمنی (Hard Hat)' },
  { id: 'safety_glasses', label: 'عینک ایمنی (Safety Glasses)' },
  { id: 'face_shield', label: 'صفحه محافظ صورت (Face Shield)' },
  { id: 'hearing', label: 'گوش‌گیر/گوشی حفاظتی (Hearing Protection)' },
  { id: 'respirator', label: 'ماسک تنفسی (Respirator)' },
  { id: 'gloves', label: 'دستکش (Gloves)' },
  { id: 'safety_shoes', label: 'کفش ایمنی (Safety Shoes)' },
  { id: 'harness', label: 'هارنس ایمنی (Safety Harness)' },
  { id: 'coverall', label: 'لباس کار (Coverall)' },
  { id: 'reflective', label: 'جلیقه انعکاسی (Reflective Vest)' },
];

export const JSAForm: React.FC<JSAFormProps> = ({ formData, setFormData }) => {
  const jobSteps: JobStep[] = formData.jsa_steps || [
    { step_number: 1, description: '', hazards: '', hazard_type: '', risk_level: '', controls: '' }
  ];

  const selectedPPE: string[] = formData.jsa_ppe_list || [];

  const addStep = () => {
    const newSteps = [...jobSteps, {
      step_number: jobSteps.length + 1,
      description: '',
      hazards: '',
      hazard_type: '',
      risk_level: '',
      controls: ''
    }];
    setFormData({...formData, jsa_steps: newSteps});
  };

  const removeStep = (index: number) => {
    if (jobSteps.length > 1) {
      const newSteps = jobSteps.filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, step_number: i + 1 }));
      setFormData({...formData, jsa_steps: newSteps});
    }
  };

  const updateStep = (index: number, field: keyof JobStep, value: string) => {
    const newSteps = [...jobSteps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData({...formData, jsa_steps: newSteps});
  };

  const togglePPE = (ppeId: string) => {
    const newPPE = selectedPPE.includes(ppeId)
      ? selectedPPE.filter(id => id !== ppeId)
      : [...selectedPPE, ppeId];
    setFormData({...formData, jsa_ppe_list: newPPE});
  };

  return (
    <div className="space-y-4">
      {/* Section 1: Job Identification - OSHA Guidelines */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">شناسایی کار (Job Identification)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>شماره JSA</Label>
            <Input
              value={formData.jsa_number || ''}
              onChange={(e) => setFormData({...formData, jsa_number: e.target.value})}
              placeholder="JSA-2025-001"
            />
          </div>
          <div>
            <Label>تاریخ تهیه</Label>
            <Input
              type="date"
              value={formData.jsa_date || ''}
              onChange={(e) => setFormData({...formData, jsa_date: e.target.value})}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <Label>عنوان شغل/فعالیت*</Label>
            <Input
              value={formData.jsa_job_title || ''}
              onChange={(e) => setFormData({...formData, jsa_job_title: e.target.value})}
              placeholder="مثال: تعمیرات مکانیکی پمپ"
            />
          </div>
          <div>
            <Label>بخش/واحد*</Label>
            <Input
              value={formData.jsa_department || ''}
              onChange={(e) => setFormData({...formData, jsa_department: e.target.value})}
              placeholder="نام بخش"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <Label>مکان انجام کار*</Label>
            <Input
              value={formData.jsa_location || ''}
              onChange={(e) => setFormData({...formData, jsa_location: e.target.value})}
              placeholder="محل دقیق انجام کار"
            />
          </div>
          <div>
            <Label>تهیه‌کننده</Label>
            <Input
              value={formData.jsa_prepared_by || ''}
              onChange={(e) => setFormData({...formData, jsa_prepared_by: e.target.value})}
              placeholder="نام تهیه‌کننده"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Personnel & Training Requirements */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">نیازمندی‌های پرسنل و آموزش</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>حداقل تعداد نفرات</Label>
            <Input
              type="number"
              min="1"
              value={formData.jsa_min_personnel || ''}
              onChange={(e) => setFormData({...formData, jsa_min_personnel: e.target.value})}
              placeholder="تعداد"
            />
          </div>
          <div>
            <Label>آموزش‌های مورد نیاز</Label>
            <Input
              value={formData.jsa_training_required || ''}
              onChange={(e) => setFormData({...formData, jsa_training_required: e.target.value})}
              placeholder="مثال: کار در ارتفاع، فضای بسته"
            />
          </div>
        </div>
      </div>

      {/* Section 3: PPE Requirements - ANSI Z89/Z87/Z88 */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">تجهیزات حفاظت فردی (PPE)</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {PPE_OPTIONS.map(ppe => (
            <div key={ppe.id} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={ppe.id}
                checked={selectedPPE.includes(ppe.id)}
                onCheckedChange={() => togglePPE(ppe.id)}
              />
              <label htmlFor={ppe.id} className="text-sm cursor-pointer">
                {ppe.label}
              </label>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Label>سایر PPE</Label>
          <Input
            value={formData.jsa_ppe_other || ''}
            onChange={(e) => setFormData({...formData, jsa_ppe_other: e.target.value})}
            placeholder="تجهیزات خاص دیگر"
          />
        </div>
      </div>

      {/* Section 4: Tools & Equipment */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">ابزار و تجهیزات</h4>
        <div>
          <Label>ابزار و تجهیزات مورد نیاز</Label>
          <Textarea
            value={formData.jsa_tools || ''}
            onChange={(e) => setFormData({...formData, jsa_tools: e.target.value})}
            placeholder="لیست ابزار و تجهیزات (هر مورد در یک خط)"
            rows={2}
          />
        </div>
      </div>

      {/* Section 5: Permits Required */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">مجوزهای کار</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 'hot_work', label: 'کار گرم (Hot Work)' },
            { id: 'confined_space', label: 'فضای بسته (Confined Space)' },
            { id: 'lockout', label: 'قفل‌گذاری (LOTO)' },
            { id: 'excavation', label: 'حفاری (Excavation)' },
            { id: 'height', label: 'کار در ارتفاع (Working at Height)' },
            { id: 'electrical', label: 'کار برقی (Electrical)' },
            { id: 'lifting', label: 'جرثقیل/بالابر (Lifting)' },
            { id: 'radiation', label: 'پرتونگاری (Radiography)' },
          ].map(permit => (
            <div key={permit.id} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={`permit_${permit.id}`}
                checked={(formData.jsa_permits || []).includes(permit.id)}
                onCheckedChange={(checked) => {
                  const current = formData.jsa_permits || [];
                  const updated = checked 
                    ? [...current, permit.id]
                    : current.filter((p: string) => p !== permit.id);
                  setFormData({...formData, jsa_permits: updated});
                }}
              />
              <label htmlFor={`permit_${permit.id}`} className="text-sm cursor-pointer">
                {permit.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Job Steps Analysis - Core JSA */}
      <div className="border-t pt-4 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-primary">تحلیل مراحل کار (Job Steps Analysis)</h4>
          <Button type="button" variant="outline" size="sm" onClick={addStep}>
            <PlusCircle className="h-4 w-4 mr-2" />
            افزودن مرحله
          </Button>
        </div>

        <div className="space-y-6">
          {jobSteps.map((step, index) => (
            <div key={index} className="border p-4 rounded-lg space-y-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <h5 className="font-semibold text-sm">مرحله {step.step_number}</h5>
                {jobSteps.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeStep(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>

              <div>
                <Label>شرح مرحله کار*</Label>
                <Input
                  value={step.description}
                  onChange={(e) => updateStep(index, 'description', e.target.value)}
                  placeholder="توضیح مختصر این مرحله از کار"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>خطرات شناسایی شده*</Label>
                  <Textarea
                    value={step.hazards}
                    onChange={(e) => updateStep(index, 'hazards', e.target.value)}
                    placeholder="خطرات احتمالی در این مرحله"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>نوع خطر</Label>
                  <Select 
                    value={step.hazard_type} 
                    onValueChange={(value) => updateStep(index, 'hazard_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب نوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Struck-by">Struck-by - برخورد با</SelectItem>
                      <SelectItem value="Struck-against">Struck-against - برخورد به</SelectItem>
                      <SelectItem value="Caught-in">Caught-in - گیر افتادن</SelectItem>
                      <SelectItem value="Fall">Fall - سقوط</SelectItem>
                      <SelectItem value="Overexertion">Overexertion - فشار بیش از حد</SelectItem>
                      <SelectItem value="Electrical">Electrical - برق‌گرفتگی</SelectItem>
                      <SelectItem value="Exposure">Exposure - تماس با مواد</SelectItem>
                      <SelectItem value="Fire">Fire/Explosion - آتش/انفجار</SelectItem>
                      <SelectItem value="Ergonomic">Ergonomic - ارگونومیک</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2">
                    <Label>سطح ریسک</Label>
                    <Select 
                      value={step.risk_level} 
                      onValueChange={(value) => updateStep(index, 'risk_level', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low - کم</SelectItem>
                        <SelectItem value="Medium">Medium - متوسط</SelectItem>
                        <SelectItem value="High">High - بالا</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label>کنترل‌های ایمنی*</Label>
                <Textarea
                  value={step.controls}
                  onChange={(e) => updateStep(index, 'controls', e.target.value)}
                  placeholder="اقدامات کنترلی و ایمنی برای این مرحله (Elimination, Substitution, Engineering, Admin, PPE)"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 7: Emergency Procedures */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">اقدامات اضطراری</h4>
        <div>
          <Label>مسیر خروج اضطراری</Label>
          <Input
            value={formData.jsa_emergency_exit || ''}
            onChange={(e) => setFormData({...formData, jsa_emergency_exit: e.target.value})}
            placeholder="شرح مسیر تخلیه اضطراری"
          />
        </div>
        <div className="mt-3">
          <Label>شماره‌های تماس اضطراری</Label>
          <Input
            value={formData.jsa_emergency_contacts || ''}
            onChange={(e) => setFormData({...formData, jsa_emergency_contacts: e.target.value})}
            placeholder="شماره آتش‌نشانی، اورژانس، HSE"
          />
        </div>
      </div>

      {/* Section 8: Review & Approval */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">بازنگری و تایید</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>بازنگری توسط</Label>
            <Input
              value={formData.jsa_reviewed_by || ''}
              onChange={(e) => setFormData({...formData, jsa_reviewed_by: e.target.value})}
              placeholder="نام بازنگری‌کننده"
            />
          </div>
          <div>
            <Label>تایید توسط</Label>
            <Input
              value={formData.jsa_approved_by || ''}
              onChange={(e) => setFormData({...formData, jsa_approved_by: e.target.value})}
              placeholder="نام تاییدکننده (سرپرست)"
            />
          </div>
        </div>
      </div>

      {/* Section 9: Additional Notes */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <Label>توضیحات اضافی و نکات ایمنی</Label>
        <Textarea
          value={formData.jsa_notes || ''}
          onChange={(e) => setFormData({...formData, jsa_notes: e.target.value})}
          placeholder="سایر نکات ایمنی و توضیحات مهم"
          rows={3}
        />
      </div>
    </div>
  );
};
