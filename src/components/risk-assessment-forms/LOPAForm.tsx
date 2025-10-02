import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface LOPAFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const LOPAForm: React.FC<LOPAFormProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>سناریو خطر*</Label>
          <Input
            value={formData.lopa_scenario || ''}
            onChange={(e) => setFormData({...formData, lopa_scenario: e.target.value})}
            placeholder="شرح سناریوی خطر"
          />
        </div>
        <div>
          <Label>علت آغازگر (Initiating Cause)*</Label>
          <Input
            value={formData.lopa_initiating_cause || ''}
            onChange={(e) => setFormData({...formData, lopa_initiating_cause: e.target.value})}
            placeholder="علت شروع رویداد خطرناک"
          />
        </div>
      </div>

      <div>
        <Label>پیامد (Consequence)*</Label>
        <Textarea
          value={formData.lopa_consequence || ''}
          onChange={(e) => setFormData({...formData, lopa_consequence: e.target.value})}
          placeholder="شرح پیامدهای احتمالی"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <SelectItem value="1e-5">1×10⁻⁵ - بسیار نادر</SelectItem>
              <SelectItem value="1e-4">1×10⁻⁴ - نادر</SelectItem>
              <SelectItem value="1e-3">1×10⁻³ - کم</SelectItem>
              <SelectItem value="1e-2">1×10⁻² - متوسط</SelectItem>
              <SelectItem value="1e-1">1×10⁻¹ - بالا</SelectItem>
              <SelectItem value="1">1 - مکرر</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>هدف کاهش ریسک (Risk Target)*</Label>
          <Select 
            value={formData.lopa_risk_target || ''} 
            onValueChange={(value) => setFormData({...formData, lopa_risk_target: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="انتخاب هدف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1e-6">1×10⁻⁶ بر سال</SelectItem>
              <SelectItem value="1e-5">1×10⁻⁵ بر سال</SelectItem>
              <SelectItem value="1e-4">1×10⁻⁴ بر سال</SelectItem>
              <SelectItem value="1e-3">1×10⁻³ بر سال</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <h4 className="font-semibold mb-3">لایه‌های حفاظتی مستقل (IPL)</h4>
        
        <div className="space-y-3">
          <div>
            <Label>IPL 1 - طراحی فرآیند</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={formData.lopa_ipl1_description || ''}
                onChange={(e) => setFormData({...formData, lopa_ipl1_description: e.target.value})}
                placeholder="شرح لایه"
              />
              <Select 
                value={formData.lopa_ipl1_pfd || ''} 
                onValueChange={(value) => setFormData({...formData, lopa_ipl1_pfd: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="PFD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.1">0.1 (10⁻¹)</SelectItem>
                  <SelectItem value="0.01">0.01 (10⁻²)</SelectItem>
                  <SelectItem value="0.001">0.001 (10⁻³)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>IPL 2 - سیستم کنترل فرآیند</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={formData.lopa_ipl2_description || ''}
                onChange={(e) => setFormData({...formData, lopa_ipl2_description: e.target.value})}
                placeholder="شرح لایه"
              />
              <Select 
                value={formData.lopa_ipl2_pfd || ''} 
                onValueChange={(value) => setFormData({...formData, lopa_ipl2_pfd: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="PFD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.1">0.1 (10⁻¹)</SelectItem>
                  <SelectItem value="0.01">0.01 (10⁻²)</SelectItem>
                  <SelectItem value="0.001">0.001 (10⁻³)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>IPL 3 - آلارم و اپراتور</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={formData.lopa_ipl3_description || ''}
                onChange={(e) => setFormData({...formData, lopa_ipl3_description: e.target.value})}
                placeholder="شرح لایه"
              />
              <Select 
                value={formData.lopa_ipl3_pfd || ''} 
                onValueChange={(value) => setFormData({...formData, lopa_ipl3_pfd: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="PFD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.1">0.1 (10⁻¹)</SelectItem>
                  <SelectItem value="0.01">0.01 (10⁻²)</SelectItem>
                  <SelectItem value="0.001">0.001 (10⁻³)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>IPL 4 - سیستم ایمنی ابزار دقیق (SIS)</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={formData.lopa_ipl4_description || ''}
                onChange={(e) => setFormData({...formData, lopa_ipl4_description: e.target.value})}
                placeholder="شرح لایه"
              />
              <Select 
                value={formData.lopa_ipl4_pfd || ''} 
                onValueChange={(value) => setFormData({...formData, lopa_ipl4_pfd: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="PFD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.1">0.1 (10⁻¹)</SelectItem>
                  <SelectItem value="0.01">0.01 (10⁻²)</SelectItem>
                  <SelectItem value="0.001">0.001 (10⁻³)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>IPL 5 - حفاظ‌های فیزیکی</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={formData.lopa_ipl5_description || ''}
                onChange={(e) => setFormData({...formData, lopa_ipl5_description: e.target.value})}
                placeholder="شرح لایه"
              />
              <Select 
                value={formData.lopa_ipl5_pfd || ''} 
                onValueChange={(value) => setFormData({...formData, lopa_ipl5_pfd: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="PFD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.1">0.1 (10⁻¹)</SelectItem>
                  <SelectItem value="0.01">0.01 (10⁻²)</SelectItem>
                  <SelectItem value="0.001">0.001 (10⁻³)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label>توضیحات و توصیه‌ها</Label>
        <Textarea
          value={formData.lopa_notes || ''}
          onChange={(e) => setFormData({...formData, lopa_notes: e.target.value})}
          placeholder="توضیحات اضافی و توصیه‌ها"
          rows={3}
        />
      </div>
    </div>
  );
};
