import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Trash2 } from 'lucide-react';

interface WhatIfFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

interface WhatIfScenario {
  question: string;
  causes: string;
  consequences: string;
  safeguards: string;
  recommendations: string;
  likelihood: string;
  severity: string;
  risk_ranking: string;
  action_party: string;
}

export const WhatIfForm: React.FC<WhatIfFormProps> = ({ formData, setFormData }) => {
  const scenarios: WhatIfScenario[] = formData.whatif_scenarios || [
    { question: '', causes: '', consequences: '', safeguards: '', recommendations: '', likelihood: '', severity: '', risk_ranking: '', action_party: '' }
  ];

  const addScenario = () => {
    const newScenarios = [...scenarios, {
      question: '',
      causes: '',
      consequences: '',
      safeguards: '',
      recommendations: '',
      likelihood: '',
      severity: '',
      risk_ranking: '',
      action_party: ''
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
    
    // Auto-calculate risk ranking
    if (field === 'likelihood' || field === 'severity') {
      const likelihood = field === 'likelihood' ? value : newScenarios[index].likelihood;
      const severity = field === 'severity' ? value : newScenarios[index].severity;
      
      if (likelihood && severity) {
        const likelihoodMap: Record<string, number> = { 'Low': 1, 'Medium': 2, 'High': 3 };
        const severityMap: Record<string, number> = { 'Low': 1, 'Medium': 2, 'High': 3 };
        const score = (likelihoodMap[likelihood] || 0) * (severityMap[severity] || 0);
        
        if (score >= 6) newScenarios[index].risk_ranking = 'High';
        else if (score >= 3) newScenarios[index].risk_ranking = 'Medium';
        else newScenarios[index].risk_ranking = 'Low';
      }
    }
    
    setFormData({...formData, whatif_scenarios: newScenarios});
  };

  const getRiskColor = (ranking: string) => {
    switch (ranking) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      {/* Section 1: Study Information */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">اطلاعات مطالعه (Study Information)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>شماره مطالعه</Label>
            <Input
              value={formData.whatif_study_id || ''}
              onChange={(e) => setFormData({...formData, whatif_study_id: e.target.value})}
              placeholder="WI-2025-001"
            />
          </div>
          <div>
            <Label>تاریخ مطالعه</Label>
            <Input
              type="date"
              value={formData.whatif_date || ''}
              onChange={(e) => setFormData({...formData, whatif_date: e.target.value})}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <Label>فرآیند/سیستم مورد بررسی*</Label>
            <Input
              value={formData.whatif_system || ''}
              onChange={(e) => setFormData({...formData, whatif_system: e.target.value})}
              placeholder="نام فرآیند یا سیستم"
            />
          </div>
          <div>
            <Label>محدوده بررسی (Scope)</Label>
            <Input
              value={formData.whatif_scope || ''}
              onChange={(e) => setFormData({...formData, whatif_scope: e.target.value})}
              placeholder="محدوده مورد بررسی"
            />
          </div>
        </div>
        <div className="mt-3">
          <Label>هدف از بررسی (Objective)</Label>
          <Textarea
            value={formData.whatif_objective || ''}
            onChange={(e) => setFormData({...formData, whatif_objective: e.target.value})}
            placeholder="هدف از انجام تحلیل What-If"
            rows={2}
          />
        </div>
      </div>

      {/* Section 2: Team Information */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">اعضای تیم</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>رهبر تیم (Team Leader)</Label>
            <Input
              value={formData.whatif_team_leader || ''}
              onChange={(e) => setFormData({...formData, whatif_team_leader: e.target.value})}
              placeholder="نام رهبر تیم"
            />
          </div>
          <div>
            <Label>ثبت‌کننده (Scribe)</Label>
            <Input
              value={formData.whatif_scribe || ''}
              onChange={(e) => setFormData({...formData, whatif_scribe: e.target.value})}
              placeholder="نام ثبت‌کننده"
            />
          </div>
        </div>
        <div className="mt-3">
          <Label>سایر اعضای تیم</Label>
          <Textarea
            value={formData.whatif_team_members || ''}
            onChange={(e) => setFormData({...formData, whatif_team_members: e.target.value})}
            placeholder="نام و سمت سایر اعضا (هر نفر در یک خط)"
            rows={2}
          />
        </div>
      </div>

      {/* Section 3: What-If Questions */}
      <div className="border-t pt-4 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-primary">سؤالات What-If و تحلیل</h4>
          <Button type="button" variant="outline" size="sm" onClick={addScenario}>
            <PlusCircle className="h-4 w-4 mr-2" />
            افزودن سؤال
          </Button>
        </div>

        <div className="space-y-6">
          {scenarios.map((scenario, index) => (
            <div key={index} className="border p-4 rounded-lg space-y-3 bg-purple-50 dark:bg-purple-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h5 className="font-semibold text-sm">سناریو {index + 1}</h5>
                  {scenario.risk_ranking && (
                    <Badge variant={getRiskColor(scenario.risk_ranking) as any}>
                      {scenario.risk_ranking === 'High' ? 'ریسک بالا' : 
                       scenario.risk_ranking === 'Medium' ? 'ریسک متوسط' : 'ریسک کم'}
                    </Badge>
                  )}
                </div>
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
                  placeholder="مثال: چه می‌شود اگر فشار از حد مجاز بیشتر شود؟"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>علل احتمالی (Causes)</Label>
                  <Textarea
                    value={scenario.causes}
                    onChange={(e) => updateScenario(index, 'causes', e.target.value)}
                    placeholder="علل احتمالی وقوع این سناریو"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>پیامدهای احتمالی (Consequences)*</Label>
                  <Textarea
                    value={scenario.consequences}
                    onChange={(e) => updateScenario(index, 'consequences', e.target.value)}
                    placeholder="پیامدهای احتمالی این سناریو"
                    rows={2}
                  />
                </div>
              </div>

              <div>
                <Label>حفاظ‌های موجود (Existing Safeguards)</Label>
                <Textarea
                  value={scenario.safeguards}
                  onChange={(e) => updateScenario(index, 'safeguards', e.target.value)}
                  placeholder="کنترل‌ها و حفاظ‌های موجود"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>احتمال وقوع (Likelihood)</Label>
                  <Select 
                    value={scenario.likelihood} 
                    onValueChange={(value) => updateScenario(index, 'likelihood', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب احتمال" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low - کم</SelectItem>
                      <SelectItem value="Medium">Medium - متوسط</SelectItem>
                      <SelectItem value="High">High - بالا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>شدت پیامد (Severity)</Label>
                  <Select 
                    value={scenario.severity} 
                    onValueChange={(value) => updateScenario(index, 'severity', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب شدت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low - کم</SelectItem>
                      <SelectItem value="Medium">Medium - متوسط</SelectItem>
                      <SelectItem value="High">High - بالا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>رتبه ریسک (Risk Ranking)</Label>
                  <div className="h-10 flex items-center justify-center border rounded-md bg-muted">
                    {scenario.risk_ranking ? (
                      <Badge variant={getRiskColor(scenario.risk_ranking) as any}>
                        {scenario.risk_ranking}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>توصیه‌ها و اقدامات (Recommendations)</Label>
                  <Textarea
                    value={scenario.recommendations}
                    onChange={(e) => updateScenario(index, 'recommendations', e.target.value)}
                    placeholder="توصیه‌ها برای کاهش ریسک"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>مسئول پیگیری (Action Party)</Label>
                  <Input
                    value={scenario.action_party}
                    onChange={(e) => updateScenario(index, 'action_party', e.target.value)}
                    placeholder="نام مسئول"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Assumptions & Limitations */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">پیش‌فرض‌ها و محدودیت‌ها</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>پیش‌فرض‌ها (Assumptions)</Label>
            <Textarea
              value={formData.whatif_assumptions || ''}
              onChange={(e) => setFormData({...formData, whatif_assumptions: e.target.value})}
              placeholder="پیش‌فرض‌های مطالعه"
              rows={2}
            />
          </div>
          <div>
            <Label>محدودیت‌ها (Limitations)</Label>
            <Textarea
              value={formData.whatif_limitations || ''}
              onChange={(e) => setFormData({...formData, whatif_limitations: e.target.value})}
              placeholder="محدودیت‌های مطالعه"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Section 5: Conclusion */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <Label>نتیجه‌گیری و توصیه‌های کلی (Conclusion)</Label>
        <Textarea
          value={formData.whatif_conclusion || ''}
          onChange={(e) => setFormData({...formData, whatif_conclusion: e.target.value})}
          placeholder="نتیجه‌گیری کلی از تحلیل و توصیه‌های نهایی"
          rows={3}
        />
      </div>
    </div>
  );
};
