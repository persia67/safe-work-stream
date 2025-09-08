import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import moment from 'moment-jalaali';
import DatePicker from 'react-persian-calendar-date-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, FileText, Users, Clock, AlertTriangle, CheckCircle, Edit, Trash2, Brain, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RiskAssessment {
  id?: string;
  assessment_id: string;
  assessment_type?: string;
  area: string;
  process_name: string;
  hazard: string;
  hazard_category: string;
  probability: string;
  severity: string;
  risk_level: string;
  risk_score: number;
  existing_controls: string[];
  additional_controls?: string;
  responsible_person_id?: string;
  review_date?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  ai_analysis?: any;
}

export const EnhancedRiskAssessmentContent = () => {
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<RiskAssessment | null>(null);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);

  const [formData, setFormData] = useState<RiskAssessment>({
    assessment_id: '',
    assessment_type: 'FMEA',
    area: '',
    process_name: '',
    hazard: '',
    hazard_category: 'فیزیکی',
    probability: 'کم',
    severity: 'کم',
    risk_level: 'کم',
    risk_score: 1,
    existing_controls: [],
    additional_controls: '',
    review_date: '',
    status: 'در حال بررسی'
  });

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('risk_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssessments((data as RiskAssessment[]) || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      toast({
        title: "خطا",
        description: "خطا در بارگذاری اطلاعات ارزیابی‌های ریسک",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateRiskScore = (probability: string, severity: string) => {
    const probMap = { 'کم': 1, 'متوسط': 2, 'بالا': 3 };
    const sevMap = { 'کم': 1, 'متوسط': 2, 'بالا': 3 };
    return probMap[probability] * sevMap[severity];
  };

  const getRiskLevel = (score: number) => {
    if (score <= 2) return 'کم';
    if (score <= 4) return 'متوسط';
    return 'بالا';
  };

  const generateAIAnalysis = async (assessment: RiskAssessment) => {
    setAiAnalysisLoading(true);
    try {
      // تحلیل هوش مصنوعی بر اساس نوع ارزیابی
      const analysisPrompt = `
تحلیل ارزیابی ریسک ${assessment.assessment_type}:
منطقه: ${assessment.area}
فرآیند: ${assessment.process_name}
خطر: ${assessment.hazard}
دسته‌بندی: ${assessment.hazard_category}
احتمال: ${assessment.probability}
شدت: ${assessment.severity}
امتیاز ریسک: ${assessment.risk_score}

لطفا تحلیل جامعی از این ارزیابی ریسک ارائه دهید شامل:
1. تحلیل سطح ریسک
2. کنترل‌های موجود و کفایت آنها
3. پیشنهادات بهبود
4. اولویت‌بندی اقدامات
5. تحلیل هزینه-فایده
`;

      // شبیه‌سازی تحلیل هوش مصنوعی
      const mockAnalysis = {
        risk_classification: assessment.risk_score > 6 ? 'بحرانی' : assessment.risk_score > 4 ? 'قابل توجه' : 'قابل قبول',
        control_adequacy: assessment.existing_controls.length > 2 ? 'مناسب' : 'نیاز به بهبود',
        priority_level: assessment.risk_score > 6 ? 'فوری' : assessment.risk_score > 4 ? 'بالا' : 'متوسط',
        recommendations: [
          assessment.risk_score > 6 ? 'اقدام فوری برای کاهش ریسک' : 'نظارت مستمر بر کنترل‌ها',
          'بازنگری دوره‌ای کنترل‌های موجود',
          'آموزش کارکنان در خصوص خطرات شناسایی شده'
        ],
        cost_benefit: {
          estimated_cost: assessment.risk_score * 1000000 + ' تومان',
          potential_savings: assessment.risk_score * 2000000 + ' تومان',
          payback_period: assessment.risk_score > 6 ? '3 ماه' : '6 ماه'
        },
        methodology_specific: getMethodologySpecificAnalysis(assessment.assessment_type, assessment),
        action_plan: [
          'تعیین مسئول اجرای کنترل‌ها',
          'تدوین برنامه زمان‌بندی اجرا',
          'تخصیص منابع مورد نیاز',
          'نظارت و پایش مستمر'
        ]
      };

      return mockAnalysis;
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      return null;
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  const getMethodologySpecificAnalysis = (type: string, assessment: RiskAssessment) => {
    switch (type) {
      case 'FMEA':
        return {
          rpn: assessment.risk_score * 10,
          failure_modes: ['خرابی تجهیزات', 'خطای انسانی', 'شرایط محیطی'],
          detection_rating: Math.floor(Math.random() * 5) + 1,
          recommendations: ['بهبود سیستم‌های تشخیص', 'آموزش بیشتر کارکنان']
        };
      case 'HAZOP':
        return {
          guide_words: ['بیشتر', 'کمتر', 'هیچ', 'معکوس'],
          deviation_analysis: 'انحراف از شرایط طراحی شده',
          safeguards: assessment.existing_controls,
          recommendations: ['نصب سیستم‌های هشدار', 'بهبود کنترل‌های فرآیند']
        };
      case 'JSA':
        return {
          job_steps: ['آماده‌سازی', 'اجرا', 'تمیزکاری'],
          personal_protective_equipment: ['کلاه ایمنی', 'عینک محافظ', 'دستکش'],
          safe_work_procedures: 'رعایت دستورالعمل‌های ایمنی',
          recommendations: ['آموزش دوره‌ای', 'نظارت بر رعایت ایمنی']
        };
      default:
        return {
          general_analysis: 'تحلیل عمومی ریسک انجام شده',
          recommendations: ['پیگیری مستمر', 'بهبود کنترل‌ها']
        };
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.assessment_id || !formData.area || 
          !formData.process_name || !formData.hazard) {
        toast({ 
          title: "خطا", 
          description: "لطفا تمام فیلدهای الزامی را پر کنید",
          variant: "destructive" 
        });
        return;
      }

      // محاسبه امتیاز و سطح ریسک
      const calculatedScore = calculateRiskScore(formData.probability, formData.severity);
      const calculatedLevel = getRiskLevel(calculatedScore);

      const dataToSave = {
        ...formData,
        risk_score: calculatedScore,
        risk_level: calculatedLevel,
        existing_controls: formData.existing_controls.length > 0 ? formData.existing_controls : [],
        review_date: formData.review_date || null
      };

      if (editingAssessment) {
        const { error } = await supabase
          .from('risk_assessments')
          .update(dataToSave)
          .eq('id', editingAssessment.id);

        if (error) throw error;
        toast({ title: "موفق", description: "اطلاعات ارزیابی ریسک با موفقیت به‌روزرسانی شد" });
      } else {
        const { error } = await supabase
          .from('risk_assessments')
          .insert([dataToSave]);

        if (error) throw error;
        toast({ title: "موفق", description: "ارزیابی ریسک جدید با موفقیت ثبت شد" });
      }

      await fetchAssessments();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "خطا",
        description: "خطا در ذخیره اطلاعات",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('risk_assessments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchAssessments();
      toast({ title: "موفق", description: "ارزیابی ریسک با موفقیت حذف شد" });
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast({
        title: "خطا",
        description: "خطا در حذف ارزیابی ریسک",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      assessment_id: '',
      assessment_type: 'FMEA',
      area: '',
      process_name: '',
      hazard: '',
      hazard_category: 'فیزیکی',
      probability: 'کم',
      severity: 'کم',
      risk_level: 'کم',
      risk_score: 1,
      existing_controls: [],
      additional_controls: '',
      review_date: '',
      status: 'در حال بررسی'
    });
    setEditingAssessment(null);
  };

  const openDialog = (assessment?: RiskAssessment) => {
    if (assessment) {
      setFormData(assessment);
      setEditingAssessment(assessment);
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const addControl = (control: string) => {
    if (control && !formData.existing_controls.includes(control)) {
      setFormData({
        ...formData,
        existing_controls: [...formData.existing_controls, control]
      });
    }
  };

  const removeControl = (index: number) => {
    const newControls = formData.existing_controls.filter((_, i) => i !== index);
    setFormData({ ...formData, existing_controls: newControls });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            ارزیابی ریسک پیشرفته
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()}>
                <PlusCircle className="h-4 w-4 mr-2" />
                ارزیابی جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>
                  {editingAssessment ? "ویرایش ارزیابی ریسک" : "ارزیابی ریسک جدید"}
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2">
                  <div>
                    <Label>شناسه ارزیابی*</Label>
                    <Input
                      value={formData.assessment_id}
                      onChange={(e) => setFormData({...formData, assessment_id: e.target.value})}
                      placeholder="RA-2025-001"
                    />
                  </div>
                  <div>
                    <Label>روش ارزیابی*</Label>
                    <Select value={formData.assessment_type} onValueChange={(value) => setFormData({...formData, assessment_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب روش ارزیابی" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FMEA">FMEA - تحلیل حالت‌های خرابی و اثرات</SelectItem>
                        <SelectItem value="HAZOP">HAZOP - مطالعه خطر و قابلیت عملکرد</SelectItem>
                        <SelectItem value="JSA">JSA - تجزیه ایمنی کار</SelectItem>
                        <SelectItem value="LOPA">LOPA - تحلیل لایه‌های حفاظتی</SelectItem>
                        <SelectItem value="Bow-Tie">Bow-Tie - تحلیل پاپیون</SelectItem>
                        <SelectItem value="What-If">What-If - تحلیل چه‌اگر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>منطقه/بخش*</Label>
                    <Select value={formData.area} onValueChange={(value) => setFormData({...formData, area: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب منطقه" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="اسیدشویی">اسیدشویی</SelectItem>
                        <SelectItem value="گالوانیزه و وان مذاب و نورد سرد">گالوانیزه و وان مذاب و نورد سرد</SelectItem>
                        <SelectItem value="ماشین سازی">ماشین سازی</SelectItem>
                        <SelectItem value="جوشکاری">جوشکاری</SelectItem>
                        <SelectItem value="شیت کن">شیت کن</SelectItem>
                        <SelectItem value="تاسیسات">تاسیسات</SelectItem>
                        <SelectItem value="تعمیرات">تعمیرات</SelectItem>
                        <SelectItem value="اداری">اداری</SelectItem>
                        <SelectItem value="HSE">HSE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>نام فرآیند*</Label>
                    <Input
                      value={formData.process_name}
                      onChange={(e) => setFormData({...formData, process_name: e.target.value})}
                      placeholder="نام فرآیند یا فعالیت"
                    />
                  </div>
                  <div>
                    <Label>شرح خطر*</Label>
                    <Input
                      value={formData.hazard}
                      onChange={(e) => setFormData({...formData, hazard: e.target.value})}
                      placeholder="شرح کامل خطر شناسایی شده"
                    />
                  </div>
                  <div>
                    <Label>دسته‌بندی خطر</Label>
                    <Select value={formData.hazard_category} onValueChange={(value) => setFormData({...formData, hazard_category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب دسته‌بندی" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="فیزیکی">فیزیکی</SelectItem>
                        <SelectItem value="شیمیایی">شیمیایی</SelectItem>
                        <SelectItem value="بیولوژیکی">بیولوژیکی</SelectItem>
                        <SelectItem value="ارگونومیک">ارگونومیک</SelectItem>
                        <SelectItem value="روانی-اجتماعی">روانی-اجتماعی</SelectItem>
                        <SelectItem value="محیطی">محیطی</SelectItem>
                        <SelectItem value="مکانیکی">مکانیکی</SelectItem>
                        <SelectItem value="الکتریکی">الکتریکی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>احتمال وقوع</Label>
                    <Select value={formData.probability} onValueChange={(value) => setFormData({...formData, probability: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب احتمال" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="کم">کم (نادر)</SelectItem>
                        <SelectItem value="متوسط">متوسط (محتمل)</SelectItem>
                        <SelectItem value="بالا">بالا (قطعی)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>شدت پیامد</Label>
                    <Select value={formData.severity} onValueChange={(value) => setFormData({...formData, severity: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب شدت" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="کم">کم (جزئی)</SelectItem>
                        <SelectItem value="متوسط">متوسط (قابل توجه)</SelectItem>
                        <SelectItem value="بالا">بالا (جدی)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>تاریخ بازنگری</Label>
                    <div className="w-full">
                      <DatePicker
                        value={formData.review_date ? moment(formData.review_date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : ''}
                        onChange={(dateObj: any) => {
                          if (dateObj && dateObj.year && dateObj.month && dateObj.day) {
                            const gregorianDate = moment(`${dateObj.year}/${dateObj.month}/${dateObj.day}`, 'jYYYY/jM/jD').format('YYYY-MM-DD');
                            setFormData({...formData, review_date: gregorianDate});
                          }
                        }}
                        locale="fa"
                        shouldHighlightWeekends
                        inputPlaceholder="انتخاب تاریخ بازنگری"
                        inputClassName="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>وضعیت</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب وضعیت" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="در حال بررسی">در حال بررسی</SelectItem>
                        <SelectItem value="تایید شده">تایید شده</SelectItem>
                        <SelectItem value="نیاز به بازنگری">نیاز به بازنگری</SelectItem>
                        <SelectItem value="منقضی">منقضی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>کنترل‌های اضافی</Label>
                    <Textarea
                      value={formData.additional_controls}
                      onChange={(e) => setFormData({...formData, additional_controls: e.target.value})}
                      placeholder="شرح کنترل‌های اضافی پیشنهادی..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>انصراف</Button>
                  <Button onClick={handleSave}>ذخیره</Button>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {assessments.map((assessment) => (
              <Card key={assessment.id} className="border-l-4 border-l-primary">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{assessment.assessment_id}</h3>
                      <p className="text-muted-foreground">{assessment.assessment_type} - {assessment.area}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{assessment.process_name}</span>
                        <Badge variant={assessment.risk_level === 'بالا' ? 'destructive' : assessment.risk_level === 'متوسط' ? 'secondary' : 'default'}>
                          {assessment.risk_level} (امتیاز: {assessment.risk_score})
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={assessment.status === 'تایید شده' ? 'default' : 'secondary'}>
                        {assessment.status}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => openDialog(assessment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(assessment.id!)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm"><strong>خطر:</strong> {assessment.hazard}</p>
                    <p className="text-sm mt-1"><strong>دسته‌بندی:</strong> {assessment.hazard_category}</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const analysis = await generateAIAnalysis(assessment);
                      if (analysis) {
                        setAssessments(prev => prev.map(a => 
                          a.id === assessment.id ? { ...a, ai_analysis: analysis } : a
                        ));
                        toast({
                          title: "موفق",
                          description: "تحلیل هوش مصنوعی تولید شد"
                        });
                      }
                    }}
                    disabled={aiAnalysisLoading}
                    className="mb-4"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    {aiAnalysisLoading ? 'در حال تحلیل...' : 'تحلیل هوش مصنوعی'}
                  </Button>

                  {assessment.ai_analysis && (
                    <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Brain className="h-5 w-5 text-blue-600" />
                        تحلیل هوش مصنوعی {assessment.assessment_type}
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{assessment.ai_analysis.risk_classification}</div>
                          <div className="text-sm text-muted-foreground">طبقه‌بندی ریسک</div>
                        </div>
                        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div className="text-lg font-bold text-green-600">{assessment.ai_analysis.control_adequacy}</div>
                          <div className="text-sm text-muted-foreground">کفایت کنترل‌ها</div>
                        </div>
                        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div className="text-lg font-bold text-orange-600">{assessment.ai_analysis.priority_level}</div>
                          <div className="text-sm text-muted-foreground">سطح اولویت</div>
                        </div>
                      </div>

                      <Tabs defaultValue="recommendations" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="recommendations">توصیه‌ها</TabsTrigger>
                          <TabsTrigger value="cost-benefit">هزینه-فایده</TabsTrigger>
                          <TabsTrigger value="methodology">روش‌شناسی</TabsTrigger>
                          <TabsTrigger value="action-plan">برنامه اقدام</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="recommendations" className="space-y-2">
                          {assessment.ai_analysis.recommendations?.map((rec: string, index: number) => (
                            <div key={index} className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{rec}</span>
                            </div>
                          ))}
                        </TabsContent>
                        
                        <TabsContent value="cost-benefit" className="space-y-2">
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <strong>هزینه تخمینی:</strong>
                              <div>{assessment.ai_analysis.cost_benefit?.estimated_cost}</div>
                            </div>
                            <div>
                              <strong>صرفه‌جویی بالقوه:</strong>
                              <div>{assessment.ai_analysis.cost_benefit?.potential_savings}</div>
                            </div>
                            <div>
                              <strong>دوره بازگشت:</strong>
                              <div>{assessment.ai_analysis.cost_benefit?.payback_period}</div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="methodology" className="space-y-2">
                          {assessment.assessment_type === 'FMEA' && assessment.ai_analysis.methodology_specific && (
                            <div className="text-sm space-y-2">
                              <div><strong>RPN:</strong> {assessment.ai_analysis.methodology_specific.rpn}</div>
                              <div><strong>رتبه تشخیص:</strong> {assessment.ai_analysis.methodology_specific.detection_rating}</div>
                            </div>
                          )}
                          {assessment.assessment_type === 'HAZOP' && assessment.ai_analysis.methodology_specific && (
                            <div className="text-sm space-y-2">
                              <div><strong>کلمات راهنما:</strong> {assessment.ai_analysis.methodology_specific.guide_words?.join(', ')}</div>
                              <div><strong>تحلیل انحراف:</strong> {assessment.ai_analysis.methodology_specific.deviation_analysis}</div>
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="action-plan" className="space-y-2">
                          {assessment.ai_analysis.action_plan?.map((action: string, index: number) => (
                            <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                              <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{action}</span>
                            </div>
                          ))}
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};