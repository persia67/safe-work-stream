import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

interface BowTieFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const BowTieForm: React.FC<BowTieFormProps> = ({ formData, setFormData }) => {
  const threats = formData.bowtie_threats || [''];
  const consequences = formData.bowtie_consequences || [''];
  const preventiveBarriers = formData.bowtie_preventive_barriers || [''];
  const mitigationBarriers = formData.bowtie_mitigation_barriers || [''];

  const addItem = (field: string, currentArray: string[]) => {
    setFormData({...formData, [field]: [...currentArray, '']});
  };

  const removeItem = (field: string, currentArray: string[], index: number) => {
    if (currentArray.length > 1) {
      setFormData({...formData, [field]: currentArray.filter((_, i) => i !== index)});
    }
  };

  const updateItem = (field: string, currentArray: string[], index: number, value: string) => {
    const newArray = [...currentArray];
    newArray[index] = value;
    setFormData({...formData, [field]: newArray});
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>رویداد اصلی (Top Event)*</Label>
        <Input
          value={formData.bowtie_top_event || ''}
          onChange={(e) => setFormData({...formData, bowtie_top_event: e.target.value})}
          placeholder="مثال: نشت گاز قابل اشتعال"
        />
      </div>

      {/* Threats (Left Side) */}
      <div className="border rounded-lg p-4 bg-red-50 dark:bg-red-950/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-red-700 dark:text-red-400">تهدیدها (Threats)</h4>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => addItem('bowtie_threats', threats)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            افزودن
          </Button>
        </div>
        <div className="space-y-2">
          {threats.map((threat, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={threat}
                onChange={(e) => updateItem('bowtie_threats', threats, index, e.target.value)}
                placeholder={`تهدید ${index + 1}`}
              />
              {threats.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeItem('bowtie_threats', threats, index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preventive Barriers */}
      <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-blue-700 dark:text-blue-400">موانع پیشگیرانه (Preventive Barriers)</h4>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => addItem('bowtie_preventive_barriers', preventiveBarriers)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            افزودن
          </Button>
        </div>
        <div className="space-y-2">
          {preventiveBarriers.map((barrier, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={barrier}
                onChange={(e) => updateItem('bowtie_preventive_barriers', preventiveBarriers, index, e.target.value)}
                placeholder={`مانع پیشگیرانه ${index + 1}`}
              />
              {preventiveBarriers.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeItem('bowtie_preventive_barriers', preventiveBarriers, index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Consequences (Right Side) */}
      <div className="border rounded-lg p-4 bg-orange-50 dark:bg-orange-950/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-orange-700 dark:text-orange-400">پیامدها (Consequences)</h4>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => addItem('bowtie_consequences', consequences)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            افزودن
          </Button>
        </div>
        <div className="space-y-2">
          {consequences.map((consequence, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={consequence}
                onChange={(e) => updateItem('bowtie_consequences', consequences, index, e.target.value)}
                placeholder={`پیامد ${index + 1}`}
              />
              {consequences.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeItem('bowtie_consequences', consequences, index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mitigation Barriers */}
      <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-green-700 dark:text-green-400">موانع کاهشی (Mitigation Barriers)</h4>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => addItem('bowtie_mitigation_barriers', mitigationBarriers)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            افزودن
          </Button>
        </div>
        <div className="space-y-2">
          {mitigationBarriers.map((barrier, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={barrier}
                onChange={(e) => updateItem('bowtie_mitigation_barriers', mitigationBarriers, index, e.target.value)}
                placeholder={`مانع کاهشی ${index + 1}`}
              />
              {mitigationBarriers.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeItem('bowtie_mitigation_barriers', mitigationBarriers, index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
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
