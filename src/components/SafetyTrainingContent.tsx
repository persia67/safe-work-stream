import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import moment from 'moment-jalaali';
import DatePicker from 'react-persian-calendar-date-picker';
import { safetyTrainingSchema } from '@/lib/validation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, FileText, Users, Clock, AlertTriangle, CheckCircle, Edit, Trash2, Brain, BarChart3 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatPersianDate, gregorianToPersian, persianToGregorian } from '@/lib/dateUtils';
import { TrainingStatisticsChart } from './TrainingStatisticsChart';

interface SafetyTraining {
  id?: string;
  training_title: string;
  training_type: string;
  department: string;
  instructor_name: string;
  training_date: string;
  duration_hours: number;
  participants: string[];
  training_content: string;
  objectives: string[];
  assessment_method: string;
  pass_score: number;
  certificate_issued: boolean;
  status: string;
  attendance_count: number;
  pass_count: number;
  effectiveness_score?: number;
  follow_up_required: boolean;
  created_at?: string;
  updated_at?: string;
  ai_analysis?: any;
}

export const SafetyTrainingContent = () => {
  const { toast } = useToast();
  const [trainings, setTrainings] = useState<SafetyTraining[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<SafetyTraining | null>(null);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);

  const [formData, setFormData] = useState<SafetyTraining>({
    training_title: '',
    training_type: '',
    department: '',
    instructor_name: '',
    training_date: new Date().toISOString().split('T')[0],
    duration_hours: 2,
    participants: [],
    training_content: '',
    objectives: [],
    assessment_method: '',
    pass_score: 70,
    certificate_issued: false,
    status: 'برنامه‌ریزی شده',
    attendance_count: 0,
    pass_count: 0,
    follow_up_required: false
  });

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const { data, error } = await supabase
        .from('safety_trainings')
        .select('*')
        .order('training_date', { ascending: false });

      if (error) throw error;
      setTrainings((data as SafetyTraining[]) || []);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching trainings:', error);
      toast({
        title: "خطا",
        description: "خطا در بارگذاری اطلاعات آموزش‌ها",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAIAnalysis = async (training: SafetyTraining) => {
    setAiAnalysisLoading(true);
    try {
      const analysisPrompt = `
تحلیل آموزش ایمنی و بهداشت:
عنوان: ${training.training_title}
نوع آموزش: ${training.training_type}
بخش: ${training.department}
مدت: ${training.duration_hours} ساعت
تعداد شرکت‌کنندگان: ${training.attendance_count}
تعداد قبولی: ${training.pass_count}
روش ارزیابی: ${training.assessment_method}
نمره قبولی: ${training.pass_score}

لطفا تحلیل جامعی از این آموزش ارائه دهید شامل:
1. نرخ موفقیت و تحلیل آن
2. کیفیت آموزش بر اساس معیارهای استاندارد
3. پیشنهادات بهبود
4. توصیه‌های پیگیری
5. ارزیابی اثربخشی آموزش
`;

      // شبیه‌سازی تحلیل هوش مصنوعی
      const mockAnalysis = {
        success_rate: Math.round((training.pass_count / training.attendance_count) * 100) || 0,
        quality_score: Math.floor(Math.random() * 30) + 70,
        effectiveness_rating: training.attendance_count > 10 ? 'بالا' : 'متوسط',
        recommendations: [
          'افزایش تعامل عملی در آموزش',
          'استفاده از مطالعات موردی واقعی',
          'برگزاری جلسات تمرینی بیشتر'
        ],
        follow_up_actions: [
          'پیگیری عملکرد شرکت‌کنندگان پس از آموزش',
          'ارزیابی تأثیر آموزش بر کاهش حوادث',
          'بازخورد از سرپرستان مستقیم'
        ],
        critical_points: training.pass_count / training.attendance_count < 0.8 ? 
          ['نرخ قبولی پایین نیاز به بازنگری در محتوا دارد'] : 
          ['عملکرد مطلوب آموزش'],
        improvement_suggestions: [
          'استفاده از روش‌های آموزشی تعاملی',
          'ایجاد محیط آزمایشگاهی برای تمرین',
          'توسعه مواد آموزشی چندرسانه‌ای'
        ]
      };

      return mockAnalysis;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error generating AI analysis:', error);
      return null;
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      console.log('🔍 Starting save process...', formData);

      // Validate input
      const validationResult = safetyTrainingSchema.safeParse({
        training_title: formData.training_title,
        training_type: formData.training_type,
        training_date: formData.training_date,
        department: formData.department,
        instructor_name: formData.instructor_name,
        duration_hours: formData.duration_hours || 2,
        participants: formData.participants || [],
        training_content: formData.training_content || '',
        objectives: formData.objectives || [],
        assessment_method: formData.assessment_method || '',
        pass_score: formData.pass_score || 70,
        status: formData.status || 'برنامه‌ریزی شده',
      });

      if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0].message;
        toast({ 
          title: "خطا", 
          description: errorMessage,
          variant: "destructive" 
        });
        return;
      }

      const validatedData = validationResult.data;

      const dataToSave = {
        training_title: validatedData.training_title,
        training_type: validatedData.training_type,
        department: validatedData.department,
        instructor_name: validatedData.instructor_name,
        training_date: validatedData.training_date,
        duration_hours: validatedData.duration_hours,
        participants: validatedData.participants,
        training_content: validatedData.training_content || '',
        objectives: validatedData.objectives,
        assessment_method: validatedData.assessment_method || '',
        pass_score: validatedData.pass_score || 70,
        certificate_issued: formData.certificate_issued || false,
        status: validatedData.status || 'برنامه‌ریزی شده',
        attendance_count: formData.attendance_count || 0,
        pass_count: formData.pass_count || 0,
        effectiveness_score: formData.effectiveness_score || null,
        follow_up_required: formData.follow_up_required || false,
        ai_analysis: formData.ai_analysis || null
      };

      // Get organization
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "خطا",
          description: "لطفاً ابتدا وارد سیستم شوید",
          variant: "destructive"
        });
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('organization_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!profile?.organization_id) {
        toast({
          title: "خطا",
          description: "سازمان شما تعریف نشده است. لطفاً با مدیر سیستم تماس بگیرید",
          variant: "destructive"
        });
        return;
      }

      const finalData = { ...dataToSave, organization_id: profile.organization_id };

      if (navigator.onLine) {
        // Online save
        if (editingTraining) {
          const { error } = await supabase
            .from('safety_trainings')
            .update(finalData)
            .eq('id', editingTraining.id);
          if (error) throw error;
          toast({ title: "موفق", description: "آموزش به‌روزرسانی شد" });
        } else {
          const { error } = await supabase
            .from('safety_trainings')
            .insert([finalData]);
          if (error) throw error;
          toast({ title: "موفق", description: "آموزش ثبت شد" });
        }
      } else {
        // Offline save
        const { syncManager } = await import('@/lib/syncManager');
        await syncManager.saveOffline(
          'safety_trainings',
          editingTraining ? 'update' : 'insert',
          editingTraining ? { ...finalData, id: editingTraining.id } : { ...finalData, id: crypto.randomUUID() }
        );
        toast({
          title: 'ذخیره محلی',
          description: 'داده‌ها محلی ذخیره شد و با اتصال همگام می‌شود',
        });
      }

      await fetchTrainings();
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      if (import.meta.env.DEV) console.error('Error saving:', error);
      toast({
        title: "خطا",
        description: error.message || 'خطا در ذخیره',
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('safety_trainings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchTrainings();
      toast({ title: "موفق", description: "آموزش با موفقیت حذف شد" });
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error deleting training:', error);
      toast({
        title: "خطا",
        description: "خطا در حذف آموزش",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      training_title: '',
      training_type: '',
      department: '',
      instructor_name: '',
      training_date: new Date().toISOString().split('T')[0],
      duration_hours: 2,
      participants: [],
      training_content: '',
      objectives: [],
      assessment_method: '',
      pass_score: 70,
      certificate_issued: false,
      status: 'برنامه‌ریزی شده',
      attendance_count: 0,
      pass_count: 0,
      follow_up_required: false
    });
    setEditingTraining(null);
  };

  const openDialog = (training?: SafetyTraining) => {
    if (training) {
      setFormData(training);
      setEditingTraining(training);
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const addParticipant = (participant: string) => {
    if (participant && !formData.participants.includes(participant)) {
      setFormData({
        ...formData,
        participants: [...formData.participants, participant]
      });
    }
  };

  const removeParticipant = (index: number) => {
    const newParticipants = formData.participants.filter((_, i) => i !== index);
    setFormData({ ...formData, participants: newParticipants });
  };

  const addObjective = (objective: string) => {
    if (objective && !formData.objectives.includes(objective)) {
      setFormData({
        ...formData,
        objectives: [...formData.objectives, objective]
      });
    }
  };

  const removeObjective = (index: number) => {
    const newObjectives = formData.objectives.filter((_, i) => i !== index);
    setFormData({ ...formData, objectives: newObjectives });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Dialog مشترک برای ایجاد/ویرایش آموزش */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        if (!open) {
          resetForm();
        }
        setDialogOpen(open);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {editingTraining ? "ویرایش آموزش" : "ثبت آموزش جدید"}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2">
              <div>
                <Label>عنوان آموزش*</Label>
                <Input
                  value={formData.training_title}
                  onChange={(e) => setFormData({...formData, training_title: e.target.value})}
                  placeholder="عنوان آموزش را وارد کنید"
                />
              </div>
              <div>
                <Label>نوع آموزش*</Label>
                <Select value={formData.training_type} onValueChange={(value) => setFormData({...formData, training_type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب نوع آموزش" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="آموزش عمومی ایمنی">آموزش عمومی ایمنی</SelectItem>
                    <SelectItem value="آموزش تخصصی">آموزش تخصصی</SelectItem>
                    <SelectItem value="آموزش بهداشت کار">آموزش بهداشت کار</SelectItem>
                    <SelectItem value="آموزش آتش‌نشانی">آموزش آتش‌نشانی</SelectItem>
                    <SelectItem value="آموزش کمک‌های اولیه">آموزش کمک‌های اولیه</SelectItem>
                    <SelectItem value="آموزش محیط زیست">آموزش محیط زیست</SelectItem>
                    <SelectItem value="آموزش کار در ارتفاع">آموزش کار در ارتفاع</SelectItem>
                    <SelectItem value="آموزش مواد شیمیایی">آموزش مواد شیمیایی</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>بخش*</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب بخش" />
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
                    <SelectItem value="همه بخش‌ها">همه بخش‌ها</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>نام مدرس*</Label>
                <Input
                  value={formData.instructor_name}
                  onChange={(e) => setFormData({...formData, instructor_name: e.target.value})}
                  placeholder="نام مدرس را وارد کنید"
                />
              </div>
              <div>
                <Label>مدت آموزش (ساعت)</Label>
                <Input
                  type="number"
                  value={formData.duration_hours}
                  onChange={(e) => setFormData({...formData, duration_hours: parseInt(e.target.value) || 0})}
                  min="1"
                  max="40"
                />
              </div>
              <div>
                <Label>روش ارزیابی</Label>
                <Select value={formData.assessment_method} onValueChange={(value) => setFormData({...formData, assessment_method: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب روش ارزیابی" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="آزمون کتبی">آزمون کتبی</SelectItem>
                    <SelectItem value="آزمون عملی">آزمون عملی</SelectItem>
                    <SelectItem value="ارزیابی ترکیبی">ارزیابی ترکیبی</SelectItem>
                    <SelectItem value="مشاهده عملکرد">مشاهده عملکرد</SelectItem>
                    <SelectItem value="ارائه پروژه">ارائه پروژه</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>نمره قبولی</Label>
                <Input
                  type="number"
                  value={formData.pass_score}
                  onChange={(e) => setFormData({...formData, pass_score: parseInt(e.target.value) || 70})}
                  min="50"
                  max="100"
                />
              </div>
              <div>
                <Label>تعداد حاضران</Label>
                <Input
                  type="number"
                  value={formData.attendance_count}
                  onChange={(e) => setFormData({...formData, attendance_count: parseInt(e.target.value) || 0})}
                  min="0"
                />
              </div>
              <div>
                <Label>تعداد قبولی‌ها</Label>
                <Input
                  type="number"
                  value={formData.pass_count}
                  onChange={(e) => setFormData({...formData, pass_count: parseInt(e.target.value) || 0})}
                  min="0"
                  max={formData.attendance_count}
                />
              </div>
              <div className="md:col-span-2">
                <Label>محتوای آموزش</Label>
                <Textarea
                  value={formData.training_content}
                  onChange={(e) => setFormData({...formData, training_content: e.target.value})}
                  placeholder="شرح محتوای آموزش..."
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

      {/* نمایش آمار و نمودارها */}
      {trainings.length > 0 && (
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">
              <FileText className="h-4 w-4 ml-2" />
              لیست آموزش‌ها
            </TabsTrigger>
            <TabsTrigger value="statistics">
              <BarChart3 className="h-4 w-4 ml-2" />
              آمار و نمودارها
            </TabsTrigger>
          </TabsList>

          <TabsContent value="statistics" className="mt-6">
            <TrainingStatisticsChart trainings={trainings} />
          </TabsContent>

          <TabsContent value="list">
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  آموزش‌های ایمنی و بهداشت
                </CardTitle>
                <Button onClick={() => openDialog()}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  آموزش جدید
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {trainings.map((training) => (
                    <Card key={training.id} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{training.training_title}</h3>
                            <p className="text-muted-foreground">{training.training_type} - {training.department}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatPersianDate(training.training_date)}
                              </span>
                              <span>{training.duration_hours} ساعت</span>
                              <span>مدرس: {training.instructor_name}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={training.status === 'تکمیل شده' ? 'default' : 'secondary'}>
                              {training.status}
                            </Badge>
                            <Button variant="outline" size="sm" onClick={() => openDialog(training)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(training.id!)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {training.attendance_count > 0 && (
                          <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg mb-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">{training.attendance_count}</div>
                              <div className="text-sm text-muted-foreground">شرکت‌کننده</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">{training.pass_count}</div>
                              <div className="text-sm text-muted-foreground">قبولی</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {Math.round((training.pass_count / training.attendance_count) * 100)}%
                              </div>
                              <div className="text-sm text-muted-foreground">نرخ موفقیت</div>
                            </div>
                          </div>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const analysis = await generateAIAnalysis(training);
                            if (analysis) {
                              setTrainings(prev => prev.map(t => 
                                t.id === training.id ? { ...t, ai_analysis: analysis } : t
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

                        {training.ai_analysis && (
                          <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border">
                            <h4 className="font-semibold flex items-center gap-2">
                              <Brain className="h-5 w-5 text-blue-600" />
                              تحلیل هوش مصنوعی آموزش
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{training.ai_analysis.success_rate}%</div>
                                <div className="text-sm text-muted-foreground">نرخ موفقیت</div>
                              </div>
                              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{training.ai_analysis.quality_score}</div>
                                <div className="text-sm text-muted-foreground">امتیاز کیفیت</div>
                              </div>
                              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                                <div className="text-lg font-bold text-purple-600">{training.ai_analysis.effectiveness_rating}</div>
                                <div className="text-sm text-muted-foreground">سطح اثربخشی</div>
                              </div>
                            </div>

                            <Tabs defaultValue="recommendations" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="recommendations">پیشنهادات</TabsTrigger>
                                <TabsTrigger value="followup">اقدامات پیگیری</TabsTrigger>
                                <TabsTrigger value="improvements">بهبودها</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="recommendations" className="space-y-2">
                                {training.ai_analysis.recommendations?.map((rec: string, index: number) => (
                                  <div key={index} className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded">
                                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{rec}</span>
                                  </div>
                                ))}
                              </TabsContent>
                              
                              <TabsContent value="followup" className="space-y-2">
                                {training.ai_analysis.follow_up_actions?.map((action: string, index: number) => (
                                  <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                                    <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{action}</span>
                                  </div>
                                ))}
                              </TabsContent>
                              
                              <TabsContent value="improvements" className="space-y-2">
                                {training.ai_analysis.improvement_suggestions?.map((suggestion: string, index: number) => (
                                  <div key={index} className="flex items-start gap-2 p-2 bg-orange-50 dark:bg-orange-950/20 rounded">
                                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{suggestion}</span>
                                  </div>
                                ))}
                              </TabsContent>
                            </Tabs>

                            {training.ai_analysis.critical_points?.length > 0 && (
                              <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                  <strong>نکات مهم:</strong>
                                  <ul className="list-disc list-inside mt-2">
                                    {training.ai_analysis.critical_points.map((point: string, index: number) => (
                                      <li key={index} className="text-sm">{point}</li>
                                    ))}
                                  </ul>
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* اگر آموزشی وجود ندارد */}
      {trainings.length === 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              آموزش‌های ایمنی و بهداشت
            </CardTitle>
            <Button onClick={() => openDialog()}>
              <PlusCircle className="h-4 w-4 mr-2" />
              آموزش جدید
            </Button>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};
