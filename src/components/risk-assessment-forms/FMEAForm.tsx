import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface FMEAFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const FMEAForm: React.FC<FMEAFormProps> = ({ formData, setFormData }) => {
  const calculateRPN = () => {
    const severity = parseInt(formData.fmea_severity || '1');
    const occurrence = parseInt(formData.fmea_occurrence || '1');
    const detection = parseInt(formData.fmea_detection || '1');
    return severity * occurrence * detection;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>حالت خرابی (Failure Mode)*</Label>
          <Input
            value={formData.fmea_failure_mode || ''}
            onChange={(e) => setFormData({...formData, fmea_failure_mode: e.target.value})}
            placeholder="نحوه خرابی یا عدم عملکرد"
          />
        </div>
        <div>
          <Label>اثر خرابی (Effect)*</Label>
          <Input
            value={formData.fmea_effect || ''}
            onChange={(e) => setFormData({...formData, fmea_effect: e.target.value})}
            placeholder="پیامد یا اثر خرابی"
          />
        </div>
      </div>

      <div>
        <Label>علت خرابی (Cause)</Label>
        <Textarea
          value={formData.fmea_cause || ''}
          onChange={(e) => setFormData({...formData, fmea_cause: e.target.value})}
          placeholder="علل احتمالی بروز خرابی"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>شدت (Severity: 1-10)*</Label>
          <Select 
            value={formData.fmea_severity || '5'} 
            onValueChange={(value) => setFormData({...formData, fmea_severity: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num} - {num <= 3 ? 'کم' : num <= 6 ? 'متوسط' : num <= 8 ? 'بالا' : 'بحرانی'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>احتمال وقوع (Occurrence: 1-10)*</Label>
          <Select 
            value={formData.fmea_occurrence || '5'} 
            onValueChange={(value) => setFormData({...formData, fmea_occurrence: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num} - {num <= 2 ? 'نادر' : num <= 5 ? 'کم' : num <= 8 ? 'متوسط' : 'مکرر'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>قابلیت تشخیص (Detection: 1-10)*</Label>
          <Select 
            value={formData.fmea_detection || '5'} 
            onValueChange={(value) => setFormData({...formData, fmea_detection: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num} - {num <= 3 ? 'آسان' : num <= 6 ? 'متوسط' : num <= 9 ? 'دشوار' : 'غیرممکن'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">عدد اولویت ریسک (RPN)</div>
          <div className="text-3xl font-bold text-blue-600">
            {calculateRPN()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            محدوده: 1-1000 | 
            {calculateRPN() > 200 ? ' اولویت بسیار بالا' : 
             calculateRPN() > 100 ? ' اولویت بالا' : 
             calculateRPN() > 50 ? ' اولویت متوسط' : ' اولویت کم'}
          </div>
        </div>
      </div>

      <div>
        <Label>اقدامات پیشنهادی</Label>
        <Textarea
          value={formData.fmea_actions || ''}
          onChange={(e) => setFormData({...formData, fmea_actions: e.target.value})}
          placeholder="اقدامات پیشگیرانه یا اصلاحی پیشنهادی"
          rows={3}
        />
      </div>
    </div>
  );
};
