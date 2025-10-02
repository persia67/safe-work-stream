import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

interface WhatIfFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

interface WhatIfScenario {
  question: string;
  consequences: string;
  safeguards: string;
  recommendations: string;
  likelihood: string;
  severity: string;
}

export const WhatIfForm: React.FC<WhatIfFormProps> = ({ formData, setFormData }) => {
  const scenarios: WhatIfScenario[] = formData.whatif_scenarios || [
    { question: '', consequences: '', safeguards: '', recommendations: '', likelihood: '', severity: '' }
  ];

  const addScenario = () => {
    const newScenarios = [...scenarios, {
      question: '',
      consequences: '',
      safeguards: '',
      recommendations: '',
      likelihood: '',
      severity: ''
    }];
    setFormData({...formData, whatif_scenarios: newScenarios});
  };

  const removeScenario = (index: number) => {
    if (scenarios.length > 1) {
      const newScenarios = scenarios.filter((_, i) => i !== index);
      setFormData({...formData, whatif_scenarios: newScenarios});
    }
  };

  const updateScenario = (index: number, field: keyof WhatIfScenario, value: string) => {
    const newScenarios = [...scenarios];
    newScenarios[index] = { ...newScenarios[index], [field]: value };
    setFormData({...formData, whatif_scenarios: newScenarios});
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>فرآیند/سیستم مورد بررسی*</Label>
          <Input
            value={formData.whatif_system || ''}
            onChange={(e) => setFormData({...formData, whatif_system: e.target.value})}
            placeholder="نام فرآیند یا سیستم"
          />
        </div>
        <div>
          <Label>هدف از بررسی</Label>
          <Input
            value={formData.whatif_objective || ''}
            onChange={(e) => setFormData({...formData, whatif_objective: e.target.value})}
            placeholder="هدف از انجام تحلیل What-If"
          />
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">سؤالات What-If و تحلیل</h4>
          <Button type="button" variant="outline" size="sm" onClick={addScenario}>
            <PlusCircle className="h-4 w-4 mr-2" />
            افزودن سؤال
          </Button>
        </div>

        <div className="space-y-6">
          {scenarios.map((scenario, index) => (
            <div key={index} className="border p-4 rounded-lg space-y-3 bg-purple-50 dark:bg-purple-950/20">
              <div className="flex items-center justify-between">
                <h5 className="font-semibold text-sm">سناریو {index + 1}</h5>
                {scenarios.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeScenario(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>

              <div>
                <Label>سؤال "چه می‌شود اگر..." (What If...)*</Label>
                <Textarea
                  value={scenario.question}
                  onChange={(e) => updateScenario(index, 'question', e.target.value)}
                  placeholder="مثال: چه می‌شود اگر شیر تخلیه باز نشود؟"
                  rows={2}
                />
              </div>

              <div>
                <Label>پیامدهای احتمالی*</Label>
                <Textarea
                  value={scenario.consequences}
                  onChange={(e) => updateScenario(index, 'consequences', e.target.value)}
                  placeholder="پیامدهای احتمالی این سناریو"
                  rows={2}
                />
              </div>

              <div>
                <Label>حفاظ‌های موجود</Label>
                <Textarea
                  value={scenario.safeguards}
                  onChange={(e) => updateScenario(index, 'safeguards', e.target.value)}
                  placeholder="کنترل‌ها و حفاظ‌های موجود"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>احتمال وقوع</Label>
                  <Select 
                    value={scenario.likelihood} 
                    onValueChange={(value) => updateScenario(index, 'likelihood', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب احتمال" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="کم">کم - نادر</SelectItem>
                      <SelectItem value="متوسط">متوسط - محتمل</SelectItem>
                      <SelectItem value="بالا">بالا - قطعی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>شدت پیامد</Label>
                  <Select 
                    value={scenario.severity} 
                    onValueChange={(value) => updateScenario(index, 'severity', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب شدت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="کم">کم - جزئی</SelectItem>
                      <SelectItem value="متوسط">متوسط - قابل توجه</SelectItem>
                      <SelectItem value="بالا">بالا - شدید</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>توصیه‌ها و اقدامات</Label>
                <Textarea
                  value={scenario.recommendations}
                  onChange={(e) => updateScenario(index, 'recommendations', e.target.value)}
                  placeholder="توصیه‌ها برای کاهش ریسک"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>نتیجه‌گیری و توصیه‌های کلی</Label>
        <Textarea
          value={formData.whatif_conclusion || ''}
          onChange={(e) => setFormData({...formData, whatif_conclusion: e.target.value})}
          placeholder="نتیجه‌گیری کلی از تحلیل"
          rows={3}
        />
      </div>
    </div>
  );
};
