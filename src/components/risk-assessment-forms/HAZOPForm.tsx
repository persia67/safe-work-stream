import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface HAZOPFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const HAZOPForm: React.FC<HAZOPFormProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>پارامتر فرآیند*</Label>
          <Select 
            value={formData.hazop_parameter || ''} 
            onValueChange={(value) => setFormData({...formData, hazop_parameter: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="انتخاب پارامتر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="فشار">فشار</SelectItem>
              <SelectItem value="دما">دما</SelectItem>
              <SelectItem value="جریان">جریان</SelectItem>
              <SelectItem value="سطح">سطح</SelectItem>
              <SelectItem value="ترکیب">ترکیب</SelectItem>
              <SelectItem value="واکنش">واکنش</SelectItem>
              <SelectItem value="زمان">زمان</SelectItem>
              <SelectItem value="سرعت">سرعت</SelectItem>
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
              <SelectItem value="NO">NO - هیچ</SelectItem>
              <SelectItem value="MORE">MORE - بیشتر</SelectItem>
              <SelectItem value="LESS">LESS - کمتر</SelectItem>
              <SelectItem value="AS_WELL_AS">AS WELL AS - علاوه بر</SelectItem>
              <SelectItem value="PART_OF">PART OF - بخشی از</SelectItem>
              <SelectItem value="REVERSE">REVERSE - معکوس</SelectItem>
              <SelectItem value="OTHER_THAN">OTHER THAN - غیر از</SelectItem>
              <SelectItem value="EARLY">EARLY - زودتر</SelectItem>
              <SelectItem value="LATE">LATE - دیرتر</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>انحراف (Deviation)*</Label>
        <Input
          value={formData.hazop_deviation || ''}
          onChange={(e) => setFormData({...formData, hazop_deviation: e.target.value})}
          placeholder="مثال: فشار بیش از حد مجاز"
        />
      </div>

      <div>
        <Label>علل احتمالی (Possible Causes)</Label>
        <Textarea
          value={formData.hazop_causes || ''}
          onChange={(e) => setFormData({...formData, hazop_causes: e.target.value})}
          placeholder="علل احتمالی بروز انحراف"
          rows={2}
        />
      </div>

      <div>
        <Label>پیامدها (Consequences)</Label>
        <Textarea
          value={formData.hazop_consequences || ''}
          onChange={(e) => setFormData({...formData, hazop_consequences: e.target.value})}
          placeholder="پیامدهای احتمالی انحراف"
          rows={2}
        />
      </div>

      <div>
        <Label>حفاظ‌های موجود (Safeguards)</Label>
        <Textarea
          value={formData.hazop_safeguards || ''}
          onChange={(e) => setFormData({...formData, hazop_safeguards: e.target.value})}
          placeholder="سیستم‌های ایمنی و حفاظتی موجود"
          rows={2}
        />
      </div>

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
              <SelectItem value="1">1 - نادر (Rare)</SelectItem>
              <SelectItem value="2">2 - بعید (Unlikely)</SelectItem>
              <SelectItem value="3">3 - ممکن (Possible)</SelectItem>
              <SelectItem value="4">4 - محتمل (Likely)</SelectItem>
              <SelectItem value="5">5 - قطعی (Almost Certain)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>شدت پیامد (Consequence)*</Label>
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

      <div>
        <Label>توصیه‌ها و اقدامات</Label>
        <Textarea
          value={formData.hazop_recommendations || ''}
          onChange={(e) => setFormData({...formData, hazop_recommendations: e.target.value})}
          placeholder="توصیه‌ها و اقدامات پیشنهادی"
          rows={3}
        />
      </div>
    </div>
  );
};
