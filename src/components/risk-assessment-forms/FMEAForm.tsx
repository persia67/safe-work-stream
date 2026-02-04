import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

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

  const getRPNLevel = (rpn: number) => {
    if (rpn >= 200) return { level: 'critical', label: 'بحرانی - اقدام فوری', color: 'destructive' };
    if (rpn >= 120) return { level: 'high', label: 'بالا - اقدام در اولویت', color: 'destructive' };
    if (rpn >= 80) return { level: 'medium', label: 'متوسط - نیاز به بررسی', color: 'default' };
    if (rpn >= 40) return { level: 'low', label: 'کم - پایش مستمر', color: 'secondary' };
    return { level: 'acceptable', label: 'قابل قبول', color: 'outline' };
  };

  const rpn = calculateRPN();
  const rpnLevel = getRPNLevel(rpn);

  return (
    <div className="space-y-4">
      {/* Section 1: Item/Function Identification - IEC 60812 Clause 6 */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">شناسایی آیتم/عملکرد (Item/Function)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>آیتم/قطعه (Item)*</Label>
            <Input
              value={formData.fmea_item || ''}
              onChange={(e) => setFormData({...formData, fmea_item: e.target.value})}
              placeholder="نام قطعه، سیستم یا فرآیند"
            />
          </div>
          <div>
            <Label>عملکرد (Function)*</Label>
            <Input
              value={formData.fmea_function || ''}
              onChange={(e) => setFormData({...formData, fmea_function: e.target.value})}
              placeholder="عملکرد مورد انتظار"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Failure Mode and Effects - IEC 60812 Clause 7 */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">حالت خرابی و اثرات (Failure Mode & Effects)</h4>
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
            <Label>اثر محلی (Local Effect)</Label>
            <Input
              value={formData.fmea_local_effect || ''}
              onChange={(e) => setFormData({...formData, fmea_local_effect: e.target.value})}
              placeholder="اثر خرابی در سطح قطعه"
            />
          </div>
        </div>

        <div className="mt-3">
          <Label>اثر نهایی بر سیستم (End Effect)*</Label>
          <Input
            value={formData.fmea_effect || ''}
            onChange={(e) => setFormData({...formData, fmea_effect: e.target.value})}
            placeholder="پیامد نهایی خرابی بر کل سیستم"
          />
        </div>
      </div>

      {/* Section 3: Cause Analysis - IEC 60812 Clause 8 */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">تحلیل علل (Cause Analysis)</h4>
        <div>
          <Label>علت(های) خرابی (Potential Cause)*</Label>
          <Textarea
            value={formData.fmea_cause || ''}
            onChange={(e) => setFormData({...formData, fmea_cause: e.target.value})}
            placeholder="علل ریشه‌ای احتمالی بروز خرابی (هر علت در یک خط)"
            rows={3}
          />
        </div>
      </div>

      {/* Section 4: Current Controls - IEC 60812 Clause 9 */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">کنترل‌های فعلی (Current Controls)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>کنترل‌های پیشگیری (Prevention Controls)</Label>
            <Textarea
              value={formData.fmea_prevention_controls || ''}
              onChange={(e) => setFormData({...formData, fmea_prevention_controls: e.target.value})}
              placeholder="کنترل‌هایی که از وقوع علت جلوگیری می‌کنند"
              rows={2}
            />
          </div>
          <div>
            <Label>کنترل‌های تشخیص (Detection Controls)</Label>
            <Textarea
              value={formData.fmea_detection_controls || ''}
              onChange={(e) => setFormData({...formData, fmea_detection_controls: e.target.value})}
              placeholder="کنترل‌هایی که خرابی را تشخیص می‌دهند"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Section 5: Risk Assessment (S-O-D) - IEC 60812 Clause 10 */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">ارزیابی ریسک (Risk Assessment)</h4>
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
                <SelectItem value="1">1 - بدون اثر قابل ملاحظه</SelectItem>
                <SelectItem value="2">2 - اثر جزئی</SelectItem>
                <SelectItem value="3">3 - اثر کم</SelectItem>
                <SelectItem value="4">4 - اثر کم تا متوسط</SelectItem>
                <SelectItem value="5">5 - اثر متوسط</SelectItem>
                <SelectItem value="6">6 - اثر متوسط تا بالا</SelectItem>
                <SelectItem value="7">7 - اثر بالا</SelectItem>
                <SelectItem value="8">8 - اثر بسیار بالا</SelectItem>
                <SelectItem value="9">9 - خطرناک با هشدار</SelectItem>
                <SelectItem value="10">10 - خطرناک بدون هشدار</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">شدت اثر بر مشتری/ایمنی</p>
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
                <SelectItem value="1">1 - تقریباً غیرممکن (≤1 در 1,000,000)</SelectItem>
                <SelectItem value="2">2 - بسیار نادر (1 در 20,000)</SelectItem>
                <SelectItem value="3">3 - نادر (1 در 4,000)</SelectItem>
                <SelectItem value="4">4 - کم (1 در 1,000)</SelectItem>
                <SelectItem value="5">5 - گاه‌گاهی (1 در 400)</SelectItem>
                <SelectItem value="6">6 - متوسط (1 در 80)</SelectItem>
                <SelectItem value="7">7 - متوسط بالا (1 در 40)</SelectItem>
                <SelectItem value="8">8 - بالا (1 در 20)</SelectItem>
                <SelectItem value="9">9 - بسیار بالا (1 در 8)</SelectItem>
                <SelectItem value="10">10 - تقریباً قطعی (≥1 در 2)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">فرکانس وقوع علت</p>
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
                <SelectItem value="1">1 - تشخیص قطعی</SelectItem>
                <SelectItem value="2">2 - تشخیص بسیار بالا</SelectItem>
                <SelectItem value="3">3 - تشخیص بالا</SelectItem>
                <SelectItem value="4">4 - تشخیص نسبتاً بالا</SelectItem>
                <SelectItem value="5">5 - تشخیص متوسط</SelectItem>
                <SelectItem value="6">6 - تشخیص کم</SelectItem>
                <SelectItem value="7">7 - تشخیص بسیار کم</SelectItem>
                <SelectItem value="8">8 - تشخیص ضعیف</SelectItem>
                <SelectItem value="9">9 - تشخیص بسیار ضعیف</SelectItem>
                <SelectItem value="10">10 - غیرقابل تشخیص</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">10 = تشخیص غیرممکن، 1 = تشخیص قطعی</p>
          </div>
        </div>
      </div>

      {/* RPN Display */}
      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">عدد اولویت ریسک (RPN = S × O × D)</div>
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {rpn}
          </div>
          <Badge variant={rpnLevel.color as any}>
            {rpnLevel.label}
          </Badge>
          <div className="text-xs text-muted-foreground mt-2">
            محدوده: 1-1000 | آستانه اقدام: RPN ≥ 100 یا شدت ≥ 9
          </div>
        </div>
      </div>

      {/* Section 6: Recommended Actions - IEC 60812 Clause 11 */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">اقدامات توصیه شده (Recommended Actions)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>اقدام پیشنهادی*</Label>
            <Textarea
              value={formData.fmea_actions || ''}
              onChange={(e) => setFormData({...formData, fmea_actions: e.target.value})}
              placeholder="اقدامات پیشگیرانه یا اصلاحی پیشنهادی"
              rows={3}
            />
          </div>
          <div>
            <Label>مسئول اجرا</Label>
            <Input
              value={formData.fmea_responsible || ''}
              onChange={(e) => setFormData({...formData, fmea_responsible: e.target.value})}
              placeholder="نام مسئول و تاریخ هدف"
            />
            <div className="mt-2">
              <Label>تاریخ هدف تکمیل</Label>
              <Input
                type="date"
                value={formData.fmea_target_date || ''}
                onChange={(e) => setFormData({...formData, fmea_target_date: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 7: Actions Taken & Re-evaluation */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">اقدامات انجام شده و ارزیابی مجدد</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>اقدامات انجام شده</Label>
            <Textarea
              value={formData.fmea_actions_taken || ''}
              onChange={(e) => setFormData({...formData, fmea_actions_taken: e.target.value})}
              placeholder="شرح اقدامات انجام شده"
              rows={2}
            />
          </div>
          <div>
            <Label>تاریخ تکمیل</Label>
            <Input
              type="date"
              value={formData.fmea_completion_date || ''}
              onChange={(e) => setFormData({...formData, fmea_completion_date: e.target.value})}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
          <div>
            <Label>شدت جدید</Label>
            <Select 
              value={formData.fmea_new_severity || ''} 
              onValueChange={(value) => setFormData({...formData, fmea_new_severity: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب" />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>احتمال جدید</Label>
            <Select 
              value={formData.fmea_new_occurrence || ''} 
              onValueChange={(value) => setFormData({...formData, fmea_new_occurrence: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب" />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>تشخیص جدید</Label>
            <Select 
              value={formData.fmea_new_detection || ''} 
              onValueChange={(value) => setFormData({...formData, fmea_new_detection: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب" />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>RPN جدید</Label>
            <div className="h-10 flex items-center justify-center border rounded-md bg-muted font-semibold">
              {(parseInt(formData.fmea_new_severity || '0') * 
                parseInt(formData.fmea_new_occurrence || '0') * 
                parseInt(formData.fmea_new_detection || '0')) || '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
