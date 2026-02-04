import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

interface BowTieFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

interface Threat {
  description: string;
  frequency: string;
}

interface Consequence {
  description: string;
  severity: string;
}

interface Barrier {
  description: string;
  type: string;
  effectiveness: string;
  degradation_factors: string;
}

export const BowTieForm: React.FC<BowTieFormProps> = ({ formData, setFormData }) => {
  const threats: Threat[] = formData.bowtie_threats_detailed || [{ description: '', frequency: '' }];
  const consequences: Consequence[] = formData.bowtie_consequences_detailed || [{ description: '', severity: '' }];
  const preventiveBarriers: Barrier[] = formData.bowtie_preventive_detailed || [{ description: '', type: '', effectiveness: '', degradation_factors: '' }];
  const mitigationBarriers: Barrier[] = formData.bowtie_mitigation_detailed || [{ description: '', type: '', effectiveness: '', degradation_factors: '' }];

  const addItem = (field: string, currentArray: any[], defaultItem: any) => {
    setFormData({...formData, [field]: [...currentArray, defaultItem]});
  };

  const removeItem = (field: string, currentArray: any[], index: number) => {
    if (currentArray.length > 1) {
      setFormData({...formData, [field]: currentArray.filter((_, i) => i !== index)});
    }
  };

  const updateItem = (field: string, currentArray: any[], index: number, key: string, value: string) => {
    const newArray = [...currentArray];
    newArray[index] = { ...newArray[index], [key]: value };
    setFormData({...formData, [field]: newArray});
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Hazard Identification - CGE Risk Bow-Tie Standard */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">شناسایی خطر (Hazard Identification)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>شماره Bow-Tie</Label>
            <Input
              value={formData.bowtie_id || ''}
              onChange={(e) => setFormData({...formData, bowtie_id: e.target.value})}
              placeholder="BT-001"
            />
          </div>
          <div>
            <Label>خطر (Hazard)*</Label>
            <Input
              value={formData.bowtie_hazard || ''}
              onChange={(e) => setFormData({...formData, bowtie_hazard: e.target.value})}
              placeholder="مثال: هیدروکربن قابل اشتعال"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Top Event - Central Element */}
      <div className="border rounded-lg p-4 bg-yellow-50 dark:bg-yellow-950/20">
        <h4 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-400">رویداد اصلی (Top Event)</h4>
        <div>
          <Label>رویداد اصلی*</Label>
          <Input
            value={formData.bowtie_top_event || ''}
            onChange={(e) => setFormData({...formData, bowtie_top_event: e.target.value})}
            placeholder="مثال: رهایش هیدروکربن به محیط"
            className="text-lg"
          />
        </div>
        <div className="mt-3">
          <Label>شرح رویداد</Label>
          <Textarea
            value={formData.bowtie_top_event_description || ''}
            onChange={(e) => setFormData({...formData, bowtie_top_event_description: e.target.value})}
            placeholder="شرح کامل رویداد مرکزی"
            rows={2}
          />
        </div>
      </div>

      {/* Section 3: Threats (Left Side) */}
      <div className="border rounded-lg p-4 bg-red-50 dark:bg-red-950/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-red-700 dark:text-red-400">تهدیدها (Threats) - سمت چپ</h4>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => addItem('bowtie_threats_detailed', threats, { description: '', frequency: '' })}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            افزودن
          </Button>
        </div>
        <div className="space-y-3">
          {threats.map((threat, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  value={threat.description}
                  onChange={(e) => updateItem('bowtie_threats_detailed', threats, index, 'description', e.target.value)}
                  placeholder={`تهدید ${index + 1}: شرح`}
                />
                <Select 
                  value={threat.frequency} 
                  onValueChange={(value) => updateItem('bowtie_threats_detailed', threats, index, 'frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="فرکانس" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High - بالا</SelectItem>
                    <SelectItem value="Medium">Medium - متوسط</SelectItem>
                    <SelectItem value="Low">Low - کم</SelectItem>
                    <SelectItem value="Very Low">Very Low - بسیار کم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {threats.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeItem('bowtie_threats_detailed', threats, index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Preventive Barriers */}
      <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-blue-700 dark:text-blue-400">موانع پیشگیرانه (Preventive Barriers)</h4>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => addItem('bowtie_preventive_detailed', preventiveBarriers, { description: '', type: '', effectiveness: '', degradation_factors: '' })}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            افزودن
          </Button>
        </div>
        <div className="space-y-3">
          {preventiveBarriers.map((barrier, index) => (
            <div key={index} className="border p-3 rounded bg-background space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">مانع {index + 1}</span>
                {preventiveBarriers.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeItem('bowtie_preventive_detailed', preventiveBarriers, index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  value={barrier.description}
                  onChange={(e) => updateItem('bowtie_preventive_detailed', preventiveBarriers, index, 'description', e.target.value)}
                  placeholder="شرح مانع"
                />
                <Select 
                  value={barrier.type} 
                  onValueChange={(value) => updateItem('bowtie_preventive_detailed', preventiveBarriers, index, 'type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="نوع مانع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hardware">Hardware - سخت‌افزاری</SelectItem>
                    <SelectItem value="Software">Software - نرم‌افزاری</SelectItem>
                    <SelectItem value="Human">Human - انسانی</SelectItem>
                    <SelectItem value="Procedural">Procedural - رویه‌ای</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Select 
                  value={barrier.effectiveness} 
                  onValueChange={(value) => updateItem('bowtie_preventive_detailed', preventiveBarriers, index, 'effectiveness', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اثربخشی" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High - بالا (&gt;90%)</SelectItem>
                    <SelectItem value="Medium">Medium - متوسط (50-90%)</SelectItem>
                    <SelectItem value="Low">Low - کم (&lt;50%)</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={barrier.degradation_factors}
                  onChange={(e) => updateItem('bowtie_preventive_detailed', preventiveBarriers, index, 'degradation_factors', e.target.value)}
                  placeholder="عوامل تضعیف (Degradation Factors)"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Consequences (Right Side) */}
      <div className="border rounded-lg p-4 bg-orange-50 dark:bg-orange-950/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-orange-700 dark:text-orange-400">پیامدها (Consequences) - سمت راست</h4>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => addItem('bowtie_consequences_detailed', consequences, { description: '', severity: '' })}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            افزودن
          </Button>
        </div>
        <div className="space-y-3">
          {consequences.map((consequence, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  value={consequence.description}
                  onChange={(e) => updateItem('bowtie_consequences_detailed', consequences, index, 'description', e.target.value)}
                  placeholder={`پیامد ${index + 1}: شرح`}
                />
                <Select 
                  value={consequence.severity} 
                  onValueChange={(value) => updateItem('bowtie_consequences_detailed', consequences, index, 'severity', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="شدت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Catastrophic">Catastrophic - فاجعه‌آمیز</SelectItem>
                    <SelectItem value="Major">Major - شدید</SelectItem>
                    <SelectItem value="Moderate">Moderate - متوسط</SelectItem>
                    <SelectItem value="Minor">Minor - جزئی</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {consequences.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeItem('bowtie_consequences_detailed', consequences, index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Mitigation Barriers */}
      <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-green-700 dark:text-green-400">موانع کاهشی (Mitigation/Recovery Barriers)</h4>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => addItem('bowtie_mitigation_detailed', mitigationBarriers, { description: '', type: '', effectiveness: '', degradation_factors: '' })}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            افزودن
          </Button>
        </div>
        <div className="space-y-3">
          {mitigationBarriers.map((barrier, index) => (
            <div key={index} className="border p-3 rounded bg-background space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">مانع {index + 1}</span>
                {mitigationBarriers.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeItem('bowtie_mitigation_detailed', mitigationBarriers, index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  value={barrier.description}
                  onChange={(e) => updateItem('bowtie_mitigation_detailed', mitigationBarriers, index, 'description', e.target.value)}
                  placeholder="شرح مانع"
                />
                <Select 
                  value={barrier.type} 
                  onValueChange={(value) => updateItem('bowtie_mitigation_detailed', mitigationBarriers, index, 'type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="نوع مانع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hardware">Hardware - سخت‌افزاری</SelectItem>
                    <SelectItem value="Software">Software - نرم‌افزاری</SelectItem>
                    <SelectItem value="Human">Human - انسانی</SelectItem>
                    <SelectItem value="Procedural">Procedural - رویه‌ای</SelectItem>
                    <SelectItem value="Emergency">Emergency - واکنش اضطراری</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Select 
                  value={barrier.effectiveness} 
                  onValueChange={(value) => updateItem('bowtie_mitigation_detailed', mitigationBarriers, index, 'effectiveness', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اثربخشی" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High - بالا (&gt;90%)</SelectItem>
                    <SelectItem value="Medium">Medium - متوسط (50-90%)</SelectItem>
                    <SelectItem value="Low">Low - کم (&lt;50%)</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={barrier.degradation_factors}
                  onChange={(e) => updateItem('bowtie_mitigation_detailed', mitigationBarriers, index, 'degradation_factors', e.target.value)}
                  placeholder="عوامل تضعیف (Degradation Factors)"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 7: Escalation Factors */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">عوامل تشدید (Escalation Factors)</h4>
        <Textarea
          value={formData.bowtie_escalation_factors || ''}
          onChange={(e) => setFormData({...formData, bowtie_escalation_factors: e.target.value})}
          placeholder="عواملی که می‌توانند موانع را تضعیف کنند یا شرایط را بدتر کنند"
          rows={2}
        />
      </div>

      {/* Section 8: Notes & Recommendations */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <Label>توضیحات و نکات</Label>
        <Textarea
          value={formData.bowtie_notes || ''}
          onChange={(e) => setFormData({...formData, bowtie_notes: e.target.value})}
          placeholder="توضیحات اضافی در مورد تحلیل Bow-Tie"
          rows={3}
        />
      </div>
    </div>
  );
};
