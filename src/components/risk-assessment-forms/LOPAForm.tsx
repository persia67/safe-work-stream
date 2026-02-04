import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

interface LOPAFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

interface IPLLayer {
  type: string;
  description: string;
  pfd: string;
}

export const LOPAForm: React.FC<LOPAFormProps> = ({ formData, setFormData }) => {
  const ipls: IPLLayer[] = formData.lopa_ipls || [
    { type: '', description: '', pfd: '' }
  ];

  // Calculate mitigated frequency
  const calculateMitigatedFrequency = () => {
    let frequency = parseFloat(formData.lopa_initiating_frequency || '1');
    const enablingProbability = parseFloat(formData.lopa_enabling_probability || '1');
    const conditionalModifier = parseFloat(formData.lopa_conditional_modifier || '1');
    
    frequency = frequency * enablingProbability * conditionalModifier;
    
    ipls.forEach(ipl => {
      if (ipl.pfd) {
        frequency = frequency * parseFloat(ipl.pfd);
      }
    });
    
    return frequency;
  };

  const addIPL = () => {
    setFormData({
      ...formData,
      lopa_ipls: [...ipls, { type: '', description: '', pfd: '' }]
    });
  };

  const removeIPL = (index: number) => {
    if (ipls.length > 1) {
      setFormData({
        ...formData,
        lopa_ipls: ipls.filter((_, i) => i !== index)
      });
    }
  };

  const updateIPL = (index: number, field: keyof IPLLayer, value: string) => {
    const newIPLs = [...ipls];
    newIPLs[index] = { ...newIPLs[index], [field]: value };
    setFormData({ ...formData, lopa_ipls: newIPLs });
  };

  const mitigatedFrequency = calculateMitigatedFrequency();
  const targetFrequency = parseFloat(formData.lopa_risk_target || '0.0001');
  const isMitigated = mitigatedFrequency <= targetFrequency;

  return (
    <div className="space-y-4">
      {/* Section 1: Scenario Identification - CCPS Guidelines */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">شناسایی سناریو (Scenario Identification)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>شماره سناریو (Scenario ID)*</Label>
            <Input
              value={formData.lopa_scenario_id || ''}
              onChange={(e) => setFormData({...formData, lopa_scenario_id: e.target.value})}
              placeholder="مثال: LOPA-001"
            />
          </div>
          <div>
            <Label>مرجع (Reference)</Label>
            <Input
              value={formData.lopa_reference || ''}
              onChange={(e) => setFormData({...formData, lopa_reference: e.target.value})}
              placeholder="HAZOP Node / PHA Item No."
            />
          </div>
        </div>
        <div className="mt-3">
          <Label>شرح سناریو (Scenario Description)*</Label>
          <Textarea
            value={formData.lopa_scenario || ''}
            onChange={(e) => setFormData({...formData, lopa_scenario: e.target.value})}
            placeholder="شرح کامل سناریوی خطر"
            rows={2}
          />
        </div>
      </div>

      {/* Section 2: Consequence - IEC 61511 */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">پیامد (Consequence)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>پیامد (Consequence Description)*</Label>
            <Textarea
              value={formData.lopa_consequence || ''}
              onChange={(e) => setFormData({...formData, lopa_consequence: e.target.value})}
              placeholder="شرح پیامدهای احتمالی"
              rows={2}
            />
          </div>
          <div>
            <Label>دسته‌بندی پیامد (Consequence Category)*</Label>
            <Select 
              value={formData.lopa_consequence_category || ''} 
              onValueChange={(value) => setFormData({...formData, lopa_consequence_category: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب دسته" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Safety">Safety - ایمنی</SelectItem>
                <SelectItem value="Environmental">Environmental - محیط زیست</SelectItem>
                <SelectItem value="Asset">Asset - تجهیزات/دارایی</SelectItem>
                <SelectItem value="Reputation">Reputation - اعتبار</SelectItem>
              </SelectContent>
            </Select>
            <div className="mt-2">
              <Label>شدت پیامد (Severity)</Label>
              <Select 
                value={formData.lopa_severity || ''} 
                onValueChange={(value) => setFormData({...formData, lopa_severity: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب شدت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Minor">Minor - جزئی</SelectItem>
                  <SelectItem value="Serious">Serious - جدی</SelectItem>
                  <SelectItem value="Extensive">Extensive - گسترده</SelectItem>
                  <SelectItem value="Catastrophic">Catastrophic - فاجعه‌آمیز</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Initiating Event - CCPS Guidelines Chapter 4 */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">رویداد آغازگر (Initiating Event)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>علت آغازگر (Initiating Cause)*</Label>
            <Input
              value={formData.lopa_initiating_cause || ''}
              onChange={(e) => setFormData({...formData, lopa_initiating_cause: e.target.value})}
              placeholder="علت شروع رویداد خطرناک"
            />
          </div>
          <div>
            <Label>فرکانس آغازگر (بر سال)*</Label>
            <Select 
              value={formData.lopa_initiating_frequency || ''} 
              onValueChange={(value) => setFormData({...formData, lopa_initiating_frequency: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب فرکانس" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 - بسیار مکرر</SelectItem>
                <SelectItem value="1">1 - سالانه</SelectItem>
                <SelectItem value="0.1">0.1 (10⁻¹) - هر 10 سال</SelectItem>
                <SelectItem value="0.01">0.01 (10⁻²) - هر 100 سال</SelectItem>
                <SelectItem value="0.001">0.001 (10⁻³) - نادر</SelectItem>
                <SelectItem value="0.0001">0.0001 (10⁻⁴) - بسیار نادر</SelectItem>
                <SelectItem value="0.00001">0.00001 (10⁻⁵) - تقریباً غیرممکن</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Section 4: Enabling Conditions & Conditional Modifiers - CCPS Guidelines Chapter 3 */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">شرایط فعال‌ساز و اصلاح‌کننده‌های شرطی</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>شرایط فعال‌ساز (Enabling Condition)</Label>
            <Input
              value={formData.lopa_enabling_condition || ''}
              onChange={(e) => setFormData({...formData, lopa_enabling_condition: e.target.value})}
              placeholder="شرطی که باید برقرار باشد (اختیاری)"
            />
            <Select 
              value={formData.lopa_enabling_probability || '1'} 
              onValueChange={(value) => setFormData({...formData, lopa_enabling_probability: value})}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="احتمال فعال بودن" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1.0 - همیشه فعال (پیش‌فرض)</SelectItem>
                <SelectItem value="0.5">0.5 - نیمی از اوقات</SelectItem>
                <SelectItem value="0.25">0.25 - یک چهارم اوقات</SelectItem>
                <SelectItem value="0.1">0.1 - 10% اوقات</SelectItem>
                <SelectItem value="0.01">0.01 - 1% اوقات</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>اصلاح‌کننده شرطی (Conditional Modifier)</Label>
            <Input
              value={formData.lopa_conditional_description || ''}
              onChange={(e) => setFormData({...formData, lopa_conditional_description: e.target.value})}
              placeholder="احتمال وجود افراد، احتمال اشتعال، ..."
            />
            <Select 
              value={formData.lopa_conditional_modifier || '1'} 
              onValueChange={(value) => setFormData({...formData, lopa_conditional_modifier: value})}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="ضریب اصلاحی" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1.0 - بدون اصلاح</SelectItem>
                <SelectItem value="0.5">0.5 - احتمال 50%</SelectItem>
                <SelectItem value="0.25">0.25 - احتمال 25%</SelectItem>
                <SelectItem value="0.1">0.1 - احتمال 10%</SelectItem>
                <SelectItem value="0.01">0.01 - احتمال 1%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Section 5: Independent Protection Layers - IEC 61511 / CCPS Guidelines Chapter 5 */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-primary">لایه‌های حفاظتی مستقل (IPLs)</h4>
          <Button type="button" variant="outline" size="sm" onClick={addIPL}>
            <PlusCircle className="h-4 w-4 mr-2" />
            افزودن IPL
          </Button>
        </div>
        
        <div className="space-y-4">
          {ipls.map((ipl, index) => (
            <div key={index} className="border p-3 rounded-lg bg-background">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">IPL {index + 1}</span>
                {ipls.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeIPL(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>نوع IPL</Label>
                  <Select 
                    value={ipl.type} 
                    onValueChange={(value) => updateIPL(index, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب نوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BPCS">BPCS - سیستم کنترل فرآیند</SelectItem>
                      <SelectItem value="Alarm">Alarm + Operator - آلارم و اپراتور</SelectItem>
                      <SelectItem value="SIS">SIS - سیستم ایمنی ابزار دقیق</SelectItem>
                      <SelectItem value="PRV">PRV/PSV - شیر اطمینان</SelectItem>
                      <SelectItem value="Rupture">Rupture Disk - دیسک پاره‌شونده</SelectItem>
                      <SelectItem value="Dike">Dike/Bund - دایک</SelectItem>
                      <SelectItem value="Fireproof">Fire Protection - سیستم اطفاء</SelectItem>
                      <SelectItem value="Mechanical">Mechanical Device - ابزار مکانیکی</SelectItem>
                      <SelectItem value="Procedure">Procedure - دستورالعمل</SelectItem>
                      <SelectItem value="Inspection">Inspection - بازرسی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>شرح</Label>
                  <Input
                    value={ipl.description}
                    onChange={(e) => updateIPL(index, 'description', e.target.value)}
                    placeholder="شرح لایه حفاظتی"
                  />
                </div>
                <div>
                  <Label>PFD</Label>
                  <Select 
                    value={ipl.pfd} 
                    onValueChange={(value) => updateIPL(index, 'pfd', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب PFD" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.1">0.1 (10⁻¹) - SIL 1</SelectItem>
                      <SelectItem value="0.01">0.01 (10⁻²) - SIL 2</SelectItem>
                      <SelectItem value="0.001">0.001 (10⁻³) - SIL 3</SelectItem>
                      <SelectItem value="0.0001">0.0001 (10⁻⁴) - SIL 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Risk Target & Result */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">هدف ریسک و نتیجه</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>هدف فرکانس قابل قبول (Risk Target)*</Label>
            <Select 
              value={formData.lopa_risk_target || ''} 
              onValueChange={(value) => setFormData({...formData, lopa_risk_target: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب هدف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.0001">1×10⁻⁴ بر سال - ایمنی افراد</SelectItem>
                <SelectItem value="0.00001">1×10⁻⁵ بر سال - فاتالیتی</SelectItem>
                <SelectItem value="0.000001">1×10⁻⁶ بر سال - فاجعه عمومی</SelectItem>
                <SelectItem value="0.001">1×10⁻³ بر سال - دارایی/محیط</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>SIL مورد نیاز</Label>
            <Select 
              value={formData.lopa_required_sil || ''} 
              onValueChange={(value) => setFormData({...formData, lopa_required_sil: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="محاسبه SIL" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None - بدون نیاز به SIF</SelectItem>
                <SelectItem value="SIL1">SIL 1 (PFD: 0.1 - 0.01)</SelectItem>
                <SelectItem value="SIL2">SIL 2 (PFD: 0.01 - 0.001)</SelectItem>
                <SelectItem value="SIL3">SIL 3 (PFD: 0.001 - 0.0001)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Result Display */}
      <div className={`p-4 rounded-lg border ${isMitigated ? 'bg-green-50 dark:bg-green-950/20' : 'bg-red-50 dark:bg-red-950/20'}`}>
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">فرکانس کاهش‌یافته (Mitigated Event Frequency)</div>
          <div className={`text-3xl font-bold ${isMitigated ? 'text-green-600' : 'text-red-600'}`}>
            {mitigatedFrequency.toExponential(2)} / سال
          </div>
          <Badge variant={isMitigated ? 'default' : 'destructive'} className="mt-2">
            {isMitigated ? '✓ ریسک قابل قبول' : '✗ نیاز به IPL اضافی'}
          </Badge>
          <div className="text-xs text-muted-foreground mt-2">
            هدف: {targetFrequency.toExponential(0)} / سال
          </div>
        </div>
      </div>

      {/* Section 7: Notes */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <Label>توضیحات و توصیه‌ها (Notes & Recommendations)</Label>
        <Textarea
          value={formData.lopa_notes || ''}
          onChange={(e) => setFormData({...formData, lopa_notes: e.target.value})}
          placeholder="توضیحات اضافی، پیش‌فرض‌ها و توصیه‌ها"
          rows={3}
        />
      </div>
    </div>
  );
};
