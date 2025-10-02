import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

interface JSAFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

interface JobStep {
  step_number: number;
  description: string;
  hazards: string;
  controls: string;
}

export const JSAForm: React.FC<JSAFormProps> = ({ formData, setFormData }) => {
  const jobSteps: JobStep[] = formData.jsa_steps || [
    { step_number: 1, description: '', hazards: '', controls: '' }
  ];

  const addStep = () => {
    const newSteps = [...jobSteps, {
      step_number: jobSteps.length + 1,
      description: '',
      hazards: '',
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>عنوان شغل/فعالیت*</Label>
          <Input
            value={formData.jsa_job_title || ''}
            onChange={(e) => setFormData({...formData, jsa_job_title: e.target.value})}
            placeholder="مثال: تعمیرات مکانیکی پمپ"
          />
        </div>
        <div>
          <Label>مکان انجام کار*</Label>
          <Input
            value={formData.jsa_location || ''}
            onChange={(e) => setFormData({...formData, jsa_location: e.target.value})}
            placeholder="محل انجام کار"
          />
        </div>
      </div>

      <div>
        <Label>تجهیزات حفاظت فردی (PPE) مورد نیاز</Label>
        <Textarea
          value={formData.jsa_ppe || ''}
          onChange={(e) => setFormData({...formData, jsa_ppe: e.target.value})}
          placeholder="مثال: کلاه ایمنی، عینک، دستکش، کفش ایمنی"
          rows={2}
        />
      </div>

      <div>
        <Label>ابزار و تجهیزات مورد نیاز</Label>
        <Textarea
          value={formData.jsa_tools || ''}
          onChange={(e) => setFormData({...formData, jsa_tools: e.target.value})}
          placeholder="لیست ابزار و تجهیزات"
          rows={2}
        />
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">مراحل کار و تحلیل خطرات</h4>
          <Button type="button" variant="outline" size="sm" onClick={addStep}>
            <PlusCircle className="h-4 w-4 mr-2" />
            افزودن مرحله
          </Button>
        </div>

        <div className="space-y-6">
          {jobSteps.map((step, index) => (
            <div key={index} className="border p-4 rounded-lg space-y-3 bg-gray-50 dark:bg-gray-900/50">
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
                <Label>کنترل‌های ایمنی*</Label>
                <Textarea
                  value={step.controls}
                  onChange={(e) => updateStep(index, 'controls', e.target.value)}
                  placeholder="اقدامات کنترلی و ایمنی برای این مرحله"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
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
