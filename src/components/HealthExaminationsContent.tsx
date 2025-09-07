import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import moment from 'moment-jalaali';
import DatePicker from 'react-persian-calendar-date-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Plus, Search, Eye, Edit, Trash2, TrendingUp, AlertTriangle, Activity, Brain, Calendar, User, Stethoscope, BarChart3, Target, CheckCircle } from 'lucide-react';

interface HealthExamination {
  id: string;
  employee_name: string;
  employee_id: string;
  department: string;
  position: string;
  examination_date: string;
  examination_type: string;
  examiner_name: string;
  hearing_test_result?: string | null;
  vision_test_result?: string | null;
  blood_pressure?: string | null;
  respiratory_function?: string | null;
  musculoskeletal_assessment?: string | null;
  exposure_risks?: any[] | null;
  health_recommendations?: any[] | null;
  fitness_for_work: string;
  next_examination_date?: string | null;
  ai_analysis?: any | null;
  health_trends?: any | null;
  created_at: string;
  status: string;
  created_by?: string | null;
}

const HealthExaminationsContent = () => {
  const [examinations, setExaminations] = useState<HealthExamination[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState<HealthExamination | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    employee_name: '',
    employee_id: '',
    department: '',
    position: '',
    examination_date: new Date().toISOString().split('T')[0],
    examination_type: 'دوره‌ای',
    examiner_name: '',
    hearing_test_result: '',
    vision_test_result: '',
    blood_pressure: '',
    respiratory_function: '',
    musculoskeletal_assessment: '',
    exposure_risks: [],
    health_recommendations: [],
    fitness_for_work: 'مناسب',
    next_examination_date: ''
  });

  useEffect(() => {
    fetchExaminations();
  }, []);

  const fetchExaminations = async () => {
    try {
      const { data, error } = await supabase
        .from('health_examinations')
        .select('*')
        .order('examination_date', { ascending: false });

      if (error) throw error;
      setExaminations((data as HealthExamination[]) || []);
    } catch (error) {
      console.error('Error fetching examinations:', error);
      toast({
        title: 'خطا در بارگذاری داده‌ها',
        description: 'امکان بارگذاری معاینات وجود ندارد',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.employee_name || !formData.employee_id || 
          !formData.department || !formData.position ||
          !formData.examination_date || !formData.examiner_name) {
        toast({ 
          title: "خطا", 
          description: "لطفا تمام فیلدهای الزامی را پر کنید",
          variant: "destructive" 
        });
        return;
      }

      const dataToSave = {
        ...formData,
        exposure_risks: formData.exposure_risks.length > 0 ? formData.exposure_risks : null,
        health_recommendations: formData.health_recommendations.length > 0 ? formData.health_recommendations : null,
        next_examination_date: formData.next_examination_date || null
      };

      if (editingExam) {
        const { error } = await supabase
          .from('health_examinations')
          .update(dataToSave)
          .eq('id', editingExam.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('health_examinations')
          .insert(dataToSave);
        if (error) throw error;
      }

      toast({
        title: 'موفقیت',
        description: editingExam ? 'معاینه به‌روزرسانی شد' : 'معاینه جدید اضافه شد'
      });

      setShowModal(false);
      resetForm();
      fetchExaminations();
    } catch (error) {
      console.error('Error saving examination:', error);
      toast({
        title: 'خطا در ذخیره',
        description: 'امکان ذخیره معاینه وجود ندارد',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      employee_name: '',
      employee_id: '',
      department: '',
      position: '',
      examination_date: new Date().toISOString().split('T')[0],
      examination_type: 'دوره‌ای',
      examiner_name: '',
      hearing_test_result: '',
      vision_test_result: '',
      blood_pressure: '',
      respiratory_function: '',
      musculoskeletal_assessment: '',
      exposure_risks: [],
      health_recommendations: [],
      fitness_for_work: 'مناسب',
      next_examination_date: ''
    });
    setEditingExam(null);
  };

  const generateAIAnalysis = async (departmentData: HealthExamination[]) => {
    setAiAnalysisLoading(true);
    try {
      // Enhanced AI analysis simulation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const totalExams = departmentData.length;
      
      // Comprehensive health analysis
      const hearingIssues = departmentData.filter(exam => 
        exam.hearing_test_result && !exam.hearing_test_result.includes('نرمال')
      ).length;
      
      const visionIssues = departmentData.filter(exam => 
        exam.vision_test_result && exam.vision_test_result.includes('ضعیف')
      ).length;
      
      const respiratoryIssues = departmentData.filter(exam => 
        exam.respiratory_function && exam.respiratory_function.includes('ضعیف')
      ).length;
      
      const musculoskeletalIssues = departmentData.filter(exam => 
        exam.musculoskeletal_assessment && exam.musculoskeletal_assessment.includes('درد')
      ).length;
      
      const hypertensionCases = departmentData.filter(exam => 
        exam.blood_pressure && exam.blood_pressure.includes('بالا')
      ).length;
      
      const hearingIssuePercentage = totalExams > 0 ? (hearingIssues / totalExams) * 100 : 0;
      const visionIssuePercentage = totalExams > 0 ? (visionIssues / totalExams) * 100 : 0;
      const respiratoryIssuePercentage = totalExams > 0 ? (respiratoryIssues / totalExams) * 100 : 0;
      const musculoskeletalIssuePercentage = totalExams > 0 ? (musculoskeletalIssues / totalExams) * 100 : 0;
      const hypertensionPercentage = totalExams > 0 ? (hypertensionCases / totalExams) * 100 : 0;
      
      // Risk level calculation
      let riskLevel = 'پایین';
      let criticalIssues = [];
      
      if (hearingIssuePercentage > 30) {
        riskLevel = 'بحرانی';
        criticalIssues.push(`آسیب شنوایی: ${hearingIssuePercentage.toFixed(1)}%`);
      }
      
      if (respiratoryIssuePercentage > 20) {
        riskLevel = 'بحرانی';
        criticalIssues.push(`مشکلات تنفسی: ${respiratoryIssuePercentage.toFixed(1)}%`);
      }
      
      if (visionIssuePercentage > 25) {
        riskLevel = 'بالا';
        criticalIssues.push(`مشکلات بینایی: ${visionIssuePercentage.toFixed(1)}%`);
      }
      
      let analysis = {
        summary: `تحلیل جامع ${totalExams} معاینه - سطح ریسک: ${riskLevel}`,
        hearingIssueRate: hearingIssuePercentage,
        visionIssueRate: visionIssuePercentage,
        respiratoryIssueRate: respiratoryIssuePercentage,
        musculoskeletalIssueRate: musculoskeletalIssuePercentage,
        hypertensionRate: hypertensionPercentage,
        riskLevel: riskLevel,
        criticalIssues: criticalIssues,
        recommendations: [],
        priorityActions: [],
        workplaceCorrelations: []
      };

      // Generate comprehensive recommendations
      if (hearingIssuePercentage > 30) {
        analysis.recommendations.push('🚨 اولویت فوری: نصب سیستم‌های کنترل صوت و عایق‌بندی');
        analysis.recommendations.push('توزیع فوری گوشی‌های ایمنی با استاندارد NRR 30+');
        analysis.recommendations.push('آموزش اجباری محافظت شنوایی برای تمام پرسنل');
        analysis.priorityActions.push('تعطیل موقت فعالیت‌های پرسروصدا تا رفع مشکل');
      } else if (hearingIssuePercentage > 15) {
        analysis.recommendations.push('⚠️ بازنگری سیستم‌های کنترل صوت موجود');
        analysis.recommendations.push('افزایش تعداد استراحت‌ها در محیط‌های پرسروصدا');
      }

      if (respiratoryIssuePercentage > 20) {
        analysis.recommendations.push('🚨 نصب فوری سیستم تهویه مکانیکی');
        analysis.recommendations.push('کنترل منابع گرد و غبار و آلودگی هوا');
        analysis.recommendations.push('تامین ماسک‌های N95 برای تمام پرسنل');
        analysis.priorityActions.push('ارزیابی فوری کیفیت هوای محیط کار');
      }

      if (visionIssuePercentage > 25) {
        analysis.recommendations.push('🚨 بهبود فوری سیستم روشنایی (حداقل 500 لوکس)');
        analysis.recommendations.push('تامین عینک ایمنی با کیفیت بالا');
      }

      if (musculoskeletalIssuePercentage > 30) {
        analysis.recommendations.push('⚠️ ارزیابی ارگونومیک کامل محل‌های کار');
        analysis.recommendations.push('آموزش تکنیک‌های صحیح کار و حمل بار');
      }

      if (hypertensionPercentage > 15) {
        analysis.recommendations.push('⚠️ برنامه مدیریت استرس شغلی');
        analysis.recommendations.push('کاهش ساعات اضافه‌کاری');
      }

      // Workplace correlations
      const departmentName = departmentData[0]?.department || 'نامشخص';
      if (departmentName.includes('تولید')) {
        analysis.workplaceCorrelations.push('محیط تولیدی: ارتباط مستقیم بین سر و صدا و آسیب شنوایی');
        analysis.workplaceCorrelations.push('کارگران خط تولید: احتمال بالاتر مشکلات اسکلتی-عضلانی');
      }

      if (departmentName === 'انبار') {
        analysis.workplaceCorrelations.push('کارکنان انبار: ریسک بالای آسیب‌های مرتبط با بلند کردن بار');
      }

      analysis.workplaceCorrelations.push('شیفت‌های طولانی: ارتباط با افزایش فشار خون');
      analysis.workplaceCorrelations.push('محیط‌های غبارآلود: تأثیر مستقیم بر عملکرد تنفسی');

      return analysis;
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  // Analytics data
  const departmentStats = examinations.reduce((acc, exam) => {
    acc[exam.department] = (acc[exam.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const fitnessStats = examinations.reduce((acc, exam) => {
    acc[exam.fitness_for_work] = (acc[exam.fitness_for_work] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const hearingIssuesByDept = examinations.reduce((acc, exam) => {
    if (exam.hearing_test_result && !exam.hearing_test_result.includes('نرمال')) {
      acc[exam.department] = (acc[exam.department] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(departmentStats).map(([dept, total]) => ({
    department: dept,
    total,
    hearingIssues: hearingIssuesByDept[dept] || 0,
    hearingIssueRate: total > 0 ? ((hearingIssuesByDept[dept] || 0) / total) * 100 : 0
  }));

  const pieData = Object.entries(fitnessStats).map(([status, count]) => ({
    name: status,
    value: count
  }));

  const COLORS = ['hsl(var(--hse-success))', 'hsl(var(--hse-warning))', 'hsl(var(--hse-danger))'];

  const filteredExaminations = examinations.filter(exam =>
    exam.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-6">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-primary">معاینات طب کار دوره‌ای</h1>
            <p className="text-muted-foreground">مدیریت و تحلیل معاینات سلامت پرسنل</p>
          </div>
        </div>
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="w-4 h-4" />
              معاینه جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingExam ? 'ویرایش معاینه' : 'معاینه جدید'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label>نام کارمند</Label>
                  <Input
                    value={formData.employee_name}
                    onChange={(e) => setFormData({...formData, employee_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>کد پرسنلی</Label>
                  <Input
                    value={formData.employee_id}
                    onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
                  />
                </div>
                <div>
                  <Label>بخش</Label>
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
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>سمت</Label>
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                  />
                </div>
                <div>
                  <Label>تاریخ معاینه</Label>
                  <div className="w-full">
                    <DatePicker
                      value={formData.examination_date ? moment(formData.examination_date).format('jYYYY/jM/jD') : ''}
                      onChange={(dateString: string) => {
                        if (dateString) {
                          const gregorianDate = moment(dateString, 'jYYYY/jM/jD').format('YYYY-MM-DD');
                          setFormData({...formData, examination_date: gregorianDate});
                        }
                      }}
                      locale="fa"
                      shouldHighlightWeekends
                      inputPlaceholder="انتخاب تاریخ"
                      inputClassName="w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <Label>نام پزشک معاینه‌کننده</Label>
                  <Input
                    value={formData.examiner_name}
                    onChange={(e) => setFormData({...formData, examiner_name: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>نتیجه آزمایش شنوایی</Label>
                  <Select value={formData.hearing_test_result} onValueChange={(value) => setFormData({...formData, hearing_test_result: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب نتیجه" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="نرمال">نرمال</SelectItem>
                      <SelectItem value="کاهش خفیف">کاهش خفیف</SelectItem>
                      <SelectItem value="کاهش متوسط">کاهش متوسط</SelectItem>
                      <SelectItem value="کاهش شدید">کاهش شدید</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>نتیجه آزمایش بینایی</Label>
                  <Input
                    value={formData.vision_test_result}
                    onChange={(e) => setFormData({...formData, vision_test_result: e.target.value})}
                  />
                </div>
                <div>
                  <Label>فشار خون</Label>
                  <Input
                    value={formData.blood_pressure}
                    onChange={(e) => setFormData({...formData, blood_pressure: e.target.value})}
                  />
                </div>
                <div>
                  <Label>وضعیت تنفسی</Label>
                  <Input
                    value={formData.respiratory_function}
                    onChange={(e) => setFormData({...formData, respiratory_function: e.target.value})}
                  />
                </div>
                <div>
                  <Label>ارزیابی عضلانی-اسکلتی</Label>
                  <Textarea
                    value={formData.musculoskeletal_assessment}
                    onChange={(e) => setFormData({...formData, musculoskeletal_assessment: e.target.value})}
                  />
                </div>
                <div>
                  <Label>آمادگی برای کار</Label>
                  <Select value={formData.fitness_for_work} onValueChange={(value) => setFormData({...formData, fitness_for_work: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="مناسب">مناسب</SelectItem>
                      <SelectItem value="مناسب با محدودیت">مناسب با محدودیت</SelectItem>
                      <SelectItem value="نامناسب">نامناسب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                انصراف
              </Button>
              <Button onClick={handleSave}>
                ذخیره
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              آمار بخش‌ها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="hsl(var(--primary))" />
                  <Bar dataKey="hearingIssues" fill="hsl(var(--hse-danger))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              وضعیت آمادگی کاری
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              تحلیل هوش مصنوعی پیشرفته
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => generateAIAnalysis(examinations)}
                disabled={aiAnalysisLoading}
              >
                <Brain className="w-4 h-4 mr-2" />
                تحلیل کامل
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const productionExams = examinations.filter(e => 
                    e.department.includes('تولید')
                  );
                  if (productionExams.length > 0) {
                    generateAIAnalysis(productionExams);
                  }
                }}
                disabled={aiAnalysisLoading}
              >
                تحلیل خطوط تولید
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {aiAnalysisLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-pulse text-sm text-muted-foreground">
                  در حال تحلیل داده‌های سلامت با هوش مصنوعی...
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Critical Alerts */}
                {chartData.some(item => item.hearingIssueRate > 30) && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      هشدارهای بحرانی
                    </h4>
                    {chartData.filter(item => item.hearingIssueRate > 30).map(item => (
                      <div key={item.department} className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                          <span className="font-medium text-sm">{item.department} - وضعیت بحرانی</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-muted-foreground">آسیب شنوایی: <span className="text-destructive font-medium">{item.hearingIssueRate.toFixed(1)}%</span></p>
                            <p className="text-muted-foreground">کل پرسنل: {item.total} نفر</p>
                          </div>
                          <div>
                            <p className="text-destructive font-medium">اقدامات فوری:</p>
                            <ul className="list-disc list-inside text-destructive text-xs space-y-1 mt-1">
                              <li>تعطیل موقت فعالیت‌های پرسروصدا</li>
                              <li>نصب فوری عایق صوتی</li>
                              <li>توزیع گوشی ایمنی NRR 30+</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Department Analysis */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    تحلیل بخش‌های کاری
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chartData.map(item => (
                      <div key={item.department} className={`p-3 rounded-lg border ${
                        item.hearingIssueRate > 30 ? 'bg-destructive/5 border-destructive/20' :
                        item.hearingIssueRate > 15 ? 'bg-warning/5 border-warning/20' :
                        'bg-success/5 border-success/20'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{item.department}</span>
                          <Badge variant={
                            item.hearingIssueRate > 30 ? 'destructive' :
                            item.hearingIssueRate > 15 ? 'secondary' : 'default'
                          }>
                            {item.hearingIssueRate > 30 ? 'بحرانی' :
                             item.hearingIssueRate > 15 ? 'ریسک بالا' : 'ایمن'}
                          </Badge>
                        </div>
                        <div className="text-xs space-y-1">
                          <p>آسیب شنوایی: {item.hearingIssueRate.toFixed(1)}% ({item.hearingIssues}/{item.total})</p>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                item.hearingIssueRate > 30 ? 'bg-destructive' :
                                item.hearingIssueRate > 15 ? 'bg-warning' : 'bg-success'
                              }`}
                              style={{ width: `${Math.min(item.hearingIssueRate, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    توصیه‌های هوش مصنوعی
                  </h4>
                  <div className="space-y-2">
                    {chartData.some(item => item.hearingIssueRate > 30) && (
                      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <p className="text-sm font-medium text-primary mb-2">🎯 اولویت اول: کنترل آسیب شنوایی</p>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          <li>• ارزیابی فوری سطح صوت در محیط‌های تولیدی</li>
                          <li>• نصب سیستم‌های عایق صوتی در خطوط تولید</li>
                          <li>• برنامه چرخش کاری برای کاهش زمان مواجهه</li>
                          <li>• آموزش اجباری محافظت شنوایی</li>
                        </ul>
                      </div>
                    )}
                    
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium mb-2">📊 تحلیل الگوها</p>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• خطوط تولید: بالاترین نرخ آسیب شنوایی ({chartData.find(i => i.department.includes('تولید'))?.hearingIssueRate.toFixed(1) || 0}%)</li>
                        <li>• ارتباط مستقیم بین سر و صدای محیط و سلامت شنوایی</li>
                        <li>• نیاز به بررسی عوامل محیطی اضافی (گرد و غبار، شیمیایی)</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-info/5 border border-info/20 rounded-lg">
                      <p className="text-sm font-medium text-info mb-2">💡 پیشنهادات بهبود</p>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• پیاده‌سازی سیستم نظارت مداوم سلامت</li>
                        <li>• معاینات ماهانه برای پرسنل پرخطر</li>
                        <li>• استفاده از تکنولوژی IoT برای نظارت محیطی</li>
                        <li>• برنامه تشویقی برای رعایت قوانین ایمنی</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Safe Status */}
                {chartData.every(item => item.hearingIssueRate <= 15) && (
                  <div className="text-center p-4 bg-success/10 border border-success/20 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                    <p className="text-sm font-medium text-success">وضعیت سلامت پرسنل در حد مطلوب است</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ادامه برنامه‌های پیشگیرانه و نظارت دوره‌ای توصیه می‌شود
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="جستجو بر اساس نام، کد پرسنلی یا بخش..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Examinations List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="p-4 text-right">نام کارمند</th>
                  <th className="p-4 text-right">بخش</th>
                  <th className="p-4 text-right">تاریخ معاینه</th>
                  <th className="p-4 text-right">آمادگی کاری</th>
                  <th className="p-4 text-right">شنوایی</th>
                  <th className="p-4 text-right">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredExaminations.map((exam) => (
                  <tr key={exam.id} className="border-b border-border">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{exam.employee_name}</div>
                        <div className="text-sm text-muted-foreground">{exam.employee_id}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{exam.department}</Badge>
                    </td>
                    <td className="p-4 text-sm">
                      {new Date(exam.examination_date).toLocaleDateString('fa-IR')}
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={
                          exam.fitness_for_work === 'مناسب' ? 'default' :
                          exam.fitness_for_work === 'مناسب با محدودیت' ? 'secondary' : 'destructive'
                        }
                      >
                        {exam.fitness_for_work}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {exam.hearing_test_result && (
                        <Badge 
                          variant={exam.hearing_test_result.includes('نرمال') ? 'default' : 'destructive'}
                        >
                          {exam.hearing_test_result}
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setFormData({
                              employee_name: exam.employee_name,
                              employee_id: exam.employee_id,
                              department: exam.department,
                              position: exam.position,
                              examination_date: exam.examination_date,
                              examination_type: exam.examination_type,
                              examiner_name: exam.examiner_name,
                              hearing_test_result: exam.hearing_test_result || '',
                              vision_test_result: exam.vision_test_result || '',
                              blood_pressure: exam.blood_pressure || '',
                              respiratory_function: exam.respiratory_function || '',
                              musculoskeletal_assessment: exam.musculoskeletal_assessment || '',
                              exposure_risks: exam.exposure_risks || [],
                              health_recommendations: exam.health_recommendations || [],
                              fitness_for_work: exam.fitness_for_work,
                              next_examination_date: exam.next_examination_date || ''
                            });
                            setEditingExam(exam);
                            setShowModal(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthExaminationsContent;