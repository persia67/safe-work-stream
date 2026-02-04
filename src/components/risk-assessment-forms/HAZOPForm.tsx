import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface HAZOPFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const HAZOPForm: React.FC<HAZOPFormProps> = ({ formData, setFormData }) => {
  // Calculate risk level based on likelihood and consequence
  const calculateRiskLevel = () => {
    const likelihood = parseInt(formData.hazop_likelihood || '1');
    const consequence = parseInt(formData.hazop_consequence || '1');
    const riskScore = likelihood * consequence;
    
    if (riskScore >= 15) return { level: 'بحرانی', color: 'destructive' };
    if (riskScore >= 10) return { level: 'بالا', color: 'destructive' };
    if (riskScore >= 5) return { level: 'متوسط', color: 'default' };
    return { level: 'کم', color: 'secondary' };
  };

  const riskLevel = calculateRiskLevel();

  return (
    <div className="space-y-4">
      {/* Section 1: Study Information - IEC 61882 */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">اطلاعات مطالعه (Study Information)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>شماره نقشه P&ID / Drawing No.</Label>
            <Input
              value={formData.hazop_drawing_no || ''}
              onChange={(e) => setFormData({...formData, hazop_drawing_no: e.target.value})}
              placeholder="شماره نقشه مرجع"
            />
          </div>
          <div>
            <Label>بازنگری نقشه (Revision)</Label>
            <Input
              value={formData.hazop_revision || ''}
              onChange={(e) => setFormData({...formData, hazop_revision: e.target.value})}
              placeholder="شماره بازنگری"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Node Definition - IEC 61882 Clause 6 */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">تعریف گره (Node Definition)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>شماره گره (Node No.)*</Label>
            <Input
              value={formData.hazop_node_no || ''}
              onChange={(e) => setFormData({...formData, hazop_node_no: e.target.value})}
              placeholder="مثال: N-001"
            />
          </div>
          <div>
            <Label>عنوان گره (Node Title)*</Label>
            <Input
              value={formData.hazop_node_title || ''}
              onChange={(e) => setFormData({...formData, hazop_node_title: e.target.value})}
              placeholder="مثال: خط انتقال از مخزن تا پمپ"
            />
          </div>
        </div>
        <div className="mt-3">
          <Label>شرح گره (Node Description)</Label>
          <Textarea
            value={formData.hazop_node_description || ''}
            onChange={(e) => setFormData({...formData, hazop_node_description: e.target.value})}
            placeholder="شرح کامل محدوده گره مورد مطالعه"
            rows={2}
          />
        </div>
        <div className="mt-3">
          <Label>هدف طراحی (Design Intent)*</Label>
          <Textarea
            value={formData.hazop_design_intent || ''}
            onChange={(e) => setFormData({...formData, hazop_design_intent: e.target.value})}
            placeholder="هدف و عملکرد مورد انتظار از این بخش سیستم"
            rows={2}
          />
        </div>
      </div>

      {/* Section 3: Deviation Analysis - IEC 61882 Clause 7 */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">تحلیل انحراف (Deviation Analysis)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>پارامتر فرآیند (Process Parameter)*</Label>
            <Select 
              value={formData.hazop_parameter || ''} 
              onValueChange={(value) => setFormData({...formData, hazop_parameter: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب پارامتر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Flow">Flow - جریان</SelectItem>
                <SelectItem value="Pressure">Pressure - فشار</SelectItem>
                <SelectItem value="Temperature">Temperature - دما</SelectItem>
                <SelectItem value="Level">Level - سطح</SelectItem>
                <SelectItem value="Composition">Composition - ترکیب</SelectItem>
                <SelectItem value="Phase">Phase - فاز</SelectItem>
                <SelectItem value="Viscosity">Viscosity - ویسکوزیته</SelectItem>
                <SelectItem value="Speed">Speed - سرعت</SelectItem>
                <SelectItem value="Time">Time - زمان</SelectItem>
                <SelectItem value="Sequence">Sequence - توالی</SelectItem>
                <SelectItem value="Mixing">Mixing - اختلاط</SelectItem>
                <SelectItem value="Reaction">Reaction - واکنش</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>کلمه راهنما (Guide Word)*</Label>
            <Select 
              value={formData.hazop_guide_word || ''} 
              onValueChange={(value) => setFormData({...formData, hazop_guide_word: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب کلمه راهنما" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NO">NO / NOT - هیچ/نه</SelectItem>
                <SelectItem value="MORE">MORE / HIGH - بیشتر/بالا</SelectItem>
                <SelectItem value="LESS">LESS / LOW - کمتر/پایین</SelectItem>
                <SelectItem value="AS WELL AS">AS WELL AS - علاوه بر</SelectItem>
                <SelectItem value="PART OF">PART OF - بخشی از</SelectItem>
                <SelectItem value="REVERSE">REVERSE - معکوس</SelectItem>
                <SelectItem value="OTHER THAN">OTHER THAN - غیر از</SelectItem>
                <SelectItem value="EARLY">EARLY - زودتر</SelectItem>
                <SelectItem value="LATE">LATE - دیرتر</SelectItem>
                <SelectItem value="BEFORE">BEFORE - قبل از</SelectItem>
                <SelectItem value="AFTER">AFTER - بعد از</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-3">
          <Label>انحراف (Deviation)*</Label>
          <Input
            value={formData.hazop_deviation || ''}
            onChange={(e) => setFormData({...formData, hazop_deviation: e.target.value})}
            placeholder="مثال: No Flow - عدم جریان"
          />
        </div>
      </div>

      {/* Section 4: Cause, Consequence, Safeguards */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">علت، پیامد و حفاظ‌ها</h4>
        <div>
          <Label>علل احتمالی (Possible Causes)*</Label>
          <Textarea
            value={formData.hazop_causes || ''}
            onChange={(e) => setFormData({...formData, hazop_causes: e.target.value})}
            placeholder="علل احتمالی بروز انحراف (هر علت در یک خط)"
            rows={3}
          />
        </div>

        <div className="mt-3">
          <Label>پیامدها (Consequences)*</Label>
          <Textarea
            value={formData.hazop_consequences || ''}
            onChange={(e) => setFormData({...formData, hazop_consequences: e.target.value})}
            placeholder="پیامدهای احتمالی انحراف شامل اثرات ایمنی، محیطی و عملیاتی"
            rows={3}
          />
        </div>

        <div className="mt-3">
          <Label>حفاظ‌های موجود (Existing Safeguards)</Label>
          <Textarea
            value={formData.hazop_safeguards || ''}
            onChange={(e) => setFormData({...formData, hazop_safeguards: e.target.value})}
            placeholder="سیستم‌های ایمنی و حفاظتی موجود (آلارم، اینترلاک، شیر اطمینان، ...)"
            rows={3}
          />
        </div>
      </div>

      {/* Section 5: Risk Ranking - IEC 61882 Annex D */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">رتبه‌بندی ریسک (Risk Ranking)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>احتمال (Likelihood)*</Label>
            <Select 
              value={formData.hazop_likelihood || ''} 
              onValueChange={(value) => setFormData({...formData, hazop_likelihood: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب احتمال" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - بسیار نادر (Improbable)</SelectItem>
                <SelectItem value="2">2 - نادر (Remote)</SelectItem>
                <SelectItem value="3">3 - بعید (Occasional)</SelectItem>
                <SelectItem value="4">4 - محتمل (Probable)</SelectItem>
                <SelectItem value="5">5 - مکرر (Frequent)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>شدت پیامد (Consequence Severity)*</Label>
            <Select 
              value={formData.hazop_consequence || ''} 
              onValueChange={(value) => setFormData({...formData, hazop_consequence: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب شدت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - ناچیز (Negligible)</SelectItem>
                <SelectItem value="2">2 - جزئی (Minor)</SelectItem>
                <SelectItem value="3">3 - متوسط (Moderate)</SelectItem>
                <SelectItem value="4">4 - شدید (Major)</SelectItem>
                <SelectItem value="5">5 - فاجعه‌آمیز (Catastrophic)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4">
          <span className="text-sm text-muted-foreground">سطح ریسک:</span>
          <Badge variant={riskLevel.color as any} className="text-lg px-4 py-1">
            {riskLevel.level}
          </Badge>
          <span className="text-sm text-muted-foreground">
            (امتیاز: {(parseInt(formData.hazop_likelihood || '1') * parseInt(formData.hazop_consequence || '1'))})
          </span>
        </div>
      </div>

      {/* Section 6: Recommendations */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-semibold mb-3 text-primary">توصیه‌ها و پیگیری</h4>
        <div>
          <Label>توصیه‌ها (Recommendations)</Label>
          <Textarea
            value={formData.hazop_recommendations || ''}
            onChange={(e) => setFormData({...formData, hazop_recommendations: e.target.value})}
            placeholder="توصیه‌ها و اقدامات پیشنهادی برای کاهش ریسک"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <Label>مسئول پیگیری (Action Party)</Label>
            <Input
              value={formData.hazop_action_party || ''}
              onChange={(e) => setFormData({...formData, hazop_action_party: e.target.value})}
              placeholder="نام مسئول"
            />
          </div>
          <div>
            <Label>مهلت اجرا (Due Date)</Label>
            <Input
              type="date"
              value={formData.hazop_due_date || ''}
              onChange={(e) => setFormData({...formData, hazop_due_date: e.target.value})}
            />
          </div>
        </div>
        <div className="mt-3">
          <Label>وضعیت پیگیری (Status)</Label>
          <Select 
            value={formData.hazop_action_status || ''} 
            onValueChange={(value) => setFormData({...formData, hazop_action_status: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="انتخاب وضعیت" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Open">Open - باز</SelectItem>
              <SelectItem value="In Progress">In Progress - در حال اجرا</SelectItem>
              <SelectItem value="Completed">Completed - تکمیل شده</SelectItem>
              <SelectItem value="Closed">Closed - بسته شده</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
