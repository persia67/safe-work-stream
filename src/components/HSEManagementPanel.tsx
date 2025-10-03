import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  FileText, 
  Users, 
  Home, 
  Settings, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Bell, 
  User, 
  LogOut, 
  PenTool, 
  CheckSquare, 
  HardHat,
  UserPlus,
  Lock,
  Unlock,
  X,
  Activity,
  Brain,
  BarChart3,
  TrendingUp,
  Download,
  Upload,
  Search,
  Filter,
  Calendar,
  Clock,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  XCircle,
  Thermometer,
  Mail,
  Phone
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import HealthExaminationsContent from './HealthExaminationsContent';
import EditableSettingsContent from './EditableSettingsContent';
import { SafetyTrainingContent } from './SafetyTrainingContent';
import { EnhancedRiskAssessmentContent } from './EnhancedRiskAssessmentContent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const HSEManagementPanel = () => {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(false);

  // کاربران سیستم با اطلاعات کامل‌تر
  const [users, setUsers] = useState([
    { 
      id: 1, 
      username: 'admin', 
      password: 'admin123', 
      role: 'manager', 
      name: 'مدیر سیستم', 
      email: 'admin@danialsteel.com',
      phone: '09123456789',
      department: 'مدیریت',
      lastLogin: '2025-01-29 09:30',
      active: true 
    },
    { 
      id: 2, 
      username: 'hse_eng', 
      password: 'hse123', 
      role: 'hse_engineer', 
      name: 'مهندس بهداشت حرفه‌ای', 
      email: 'hse@danialsteel.com',
      phone: '09123456788',
      department: 'HSE',
      lastLogin: '2025-01-29 08:15',
      active: true 
    },
    { 
      id: 3, 
      username: 'safety1', 
      password: 'safe123', 
      role: 'safety_officer', 
      name: 'افسر ایمنی 1', 
      email: 'safety1@danialsteel.com',
      phone: '09123456787',
      department: 'HSE',
      lastLogin: '2025-01-29 07:45',
      active: true 
    }
  ]);

  // حوادث با جزئیات بیشتر
  const [incidents, setIncidents] = useState([
    { 
      id: 1, 
      date: '2025-01-29', 
      time: '14:30',
      type: 'حادثه جزئی', 
      location: 'سالن تولید A', 
      severity: 'کم', 
      status: 'بررسی شده', 
      reporter: 'احمد رضایی',
      description: 'برخورد جزئی دست کارگر با تجهیزات حین کار',
      injuredPerson: 'علی محمدی',
      witnessCount: 2,
      immediateAction: 'کمک‌های اولیه ارائه شد',
      rootCause: 'عدم رعایت فاصله ایمنی',
      preventiveAction: 'آموزش مجدد کارکنان'
    },
    { 
      id: 2, 
      date: '2025-01-28', 
      time: '10:15',
      type: 'نزدیک به حادثه', 
      location: 'انبار مواد اولیه', 
      severity: 'متوسط', 
      status: 'در حال بررسی', 
      reporter: 'علی حسینی',
      description: 'سقوط جعبه از ارتفاع 2 متری بدون برخورد به کارگر',
      injuredPerson: 'ندارد',
      witnessCount: 1,
      immediateAction: 'منطقه ایمن‌سازی شد',
      rootCause: 'بارگیری نامناسب',
      preventiveAction: 'بازآموزی کارکنان انبار'
    }
  ]);

  // ارزیابی‌های ارگونومی جدید
  const [ergonomicAssessments, setErgonomicAssessments] = useState([
    {
      id: 1,
      employeeName: 'احمد رضایی',
      department: 'تولید',
      position: 'اپراتور',
      assessmentType: 'RULA',
      date: '2025-01-28',
      assessor: 'مهندس HSE',
      workstation: 'خط تولید شماره 1',
      shiftDuration: '8 ساعت',
      riskLevel: 'متوسط',
      finalScore: 5,
      recommendations: [
        'تنظیم ارتفاع میز کار',
        'استفاده از صندلی ارگونومیک',
        'برنامه استراحت هر 2 ساعت'
      ],
      bodyParts: {
        neck: { score: 2, angle: 15 },
        trunk: { score: 3, angle: 25 },
        upperArm: { score: 2, angle: 20 },
        lowerArm: { score: 2, angle: 60 },
        wrist: { score: 2, angle: 10 }
      },
      status: 'نیاز به اقدام',
      followUpDate: '2025-02-28'
    },
    {
      id: 2,
      employeeName: 'محمد احمدی',
      department: 'تولید',
      position: 'تکنسین',
      assessmentType: 'REBA',
      date: '2025-01-27',
      assessor: 'مهندس HSE',
      workstation: 'تعمیرگاه',
      shiftDuration: '8 ساعت',
      riskLevel: 'بالا',
      finalScore: 8,
      recommendations: [
        'تغییر روش کار',
        'استفاده از ابزار کمکی',
        'آموزش تکنیک‌های صحیح بلند کردن'
      ],
      bodyParts: {
        neck: { score: 3, angle: 35 },
        trunk: { score: 4, angle: 45 },
        leg: { score: 2, angle: 0 },
        upperArm: { score: 3, angle: 45 },
        lowerArm: { score: 2, angle: 90 },
        wrist: { score: 3, angle: 25 }
      },
      status: 'اقدام فوری',
      followUpDate: '2025-02-10'
    }
  ]);

  // مجوزهای کار
  const [workPermits, setWorkPermits] = useState([
    { 
      id: 1, 
      permitNumber: 'WP-2025-001',
      type: 'مجوز کار در ارتفاع', 
      requester: 'احمد رضایی', 
      date: '2025-01-29',
      startTime: '08:00',
      endTime: '17:00',
      status: 'در انتظار تایید', 
      validUntil: '2025-01-30',
      workDescription: 'تعمیر سیستم تهویه سقفی',
      hazards: ['سقوط از ارتفاع', 'برق گرفتگی'],
      precautions: ['کمربند ایمنی', 'کلاه ایمنی', 'قطع برق'],
      approver: '',
      witnesses: ['علی حسینی', 'رضا مرادی']
    },
    { 
      id: 2, 
      permitNumber: 'WP-2025-002',
      type: 'مجوز جوشکاری', 
      requester: 'محمد احمدی', 
      date: '2025-01-28',
      startTime: '09:00',
      endTime: '16:00', 
      status: 'تایید شده', 
      validUntil: '2025-01-29',
      workDescription: 'جوشکاری قطعات فلزی',
      hazards: ['آتش‌سوزی', 'گازهای سمی', 'تابش UV'],
      precautions: ['ماسک جوشکاری', 'کپسول آتش‌نشانی', 'تهویه مناسب'],
      approver: 'مهندس HSE',
      witnesses: ['سعید کرمی']
    }
  ]);

  // گزارش‌های روزانه پیشرفته
  const [dailyReports, setDailyReports] = useState([
    { 
      id: 1, 
      date: '2025-01-29', 
      officer: 'افسر ایمنی 1', 
      shift: 'صبح',
      startTime: '06:00',
      endTime: '14:00',
      weather: 'آفتابی',
      temperature: '15°C',
      report: 'بازرسی کامل سالن تولید انجام شد. سیستم‌های ایمنی در وضعیت مطلوب قرار دارند.',
      inspections: 5,
      trainingSessions: 2,
      violations: 1,
      nearMisses: 0,
      accidents: 0,
      ppeDistributed: 12,
      maintenanceRequests: 3,
      suggestions: 'نصب علائم اضافی در کنار خط تولید جدید',
      status: 'ارسال شده'
    }
  ]);

  // ارزیابی ریسک پیشرفته
  const [riskAssessments, setRiskAssessments] = useState([
    { 
      id: 1, 
      assessmentId: 'RA-2025-001',
      area: 'سالن تولید اصلی', 
      process: 'برش فلزات',
      hazard: 'سر و صدای بیش از حد', 
      hazardCategory: 'فیزیکی',
      probability: 'بالا', 
      severity: 'متوسط', 
      riskLevel: 'متوسط',
      riskScore: 6,
      existingControls: ['گوشی ایمنی', 'تعمیرات دوره‌ای'],
      additionalControls: 'کاهش زمان مواجهه',
      responsiblePerson: 'مهندس HSE',
      reviewDate: '2025-04-28',
      status: 'تایید شده'
    }
  ]);

  // ورود به سیستم
  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    
    // شبیه‌سازی تأخیر شبکه
    setTimeout(() => {
      const user = users.find(u => 
        u.username === loginForm.username &&
        u.password === loginForm.password &&
        u.active
      );
      
      if (user) {
        // بروزرسانی زمان آخرین ورود
        setUsers(prev => prev.map(u => 
          u.id === user.id ? {...u, lastLogin: new Date().toLocaleString('fa-IR')} : u
        ));
        setCurrentUser(user);
        setIsLoggedIn(true);
        setLoginForm({ username: '', password: '' });
        toast({
          title: "ورود موفق",
          description: `خوش آمدید ${user.name}`,
        });
      } else {
        setLoginError('نام کاربری یا رمز عبور اشتباه است یا حساب غیرفعال می‌باشد');
      }
      setLoading(false);
    }, 1000);
  };

  // خروج از سیستم
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('dashboard');
    setLoginForm({ username: '', password: '' });
    setLoginError('');
    setShowModal(false);
    setModalData({});
    toast({
      title: "خروج از سیستم",
      description: "با موفقیت خارج شدید",
    });
  };

  // منوهای کاربر بر اساس نقش
  const getMenuItems = () => {
    if (!currentUser) return [];
    
    const items = [
      { id: 'dashboard', icon: Home, label: 'داشبورد اصلی', roles: ['manager', 'hse_engineer', 'safety_officer'] },
      { id: 'incidents', icon: AlertTriangle, label: 'مدیریت حوادث', roles: ['manager', 'hse_engineer', 'safety_officer'] },
      { id: 'ergonomics', icon: Activity, label: 'ارزیابی ارگونومی', roles: ['manager', 'hse_engineer'] },
      { id: 'permits', icon: FileText, label: 'مجوزهای کار', roles: ['manager', 'hse_engineer', 'safety_officer'] },
      { id: 'reports', icon: PenTool, label: 'گزارش‌های روزانه', roles: ['safety_officer', 'hse_engineer', 'manager'] },
      { id: 'risk', icon: Shield, label: 'ارزیابی ریسک', roles: ['manager', 'hse_engineer', 'safety_officer'] },
      { id: 'health-examinations', icon: User, label: 'معاینات طب کار', roles: ['manager', 'hse_engineer', 'safety_officer'] },
      { id: 'safety-training', icon: Users, label: 'آموزش‌های ایمنی', roles: ['manager', 'hse_engineer', 'safety_officer'] },
      { id: 'analytics', icon: BarChart3, label: 'تحلیل و آمار', roles: ['manager', 'hse_engineer'] },
      { id: 'ai-insights', icon: Brain, label: 'تحلیل هوش مصنوعی', roles: ['manager', 'hse_engineer'] },
      { id: 'settings', icon: Settings, label: 'تنظیمات', roles: ['manager'] }
    ];

    return items.filter(item => item.roles.includes(currentUser.role));
  };

  // باز کردن مودال
  const openModal = (type, data = {}) => {
    setModalType(type);
    setModalData(data);
    setShowModal(true);
  };

  // بستن مودال
  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setModalData({});
  };

  // تحلیل هوش مصنوعی برای ارگونومی
  const analyzeErgonomics = (assessment) => {
    const { bodyParts, assessmentType, finalScore } = assessment;
    
    let analysis = {
      riskLevel: '',
      urgency: '',
      recommendations: [],
      explanation: '',
      preventiveMeasures: []
    };

    // تحلیل بر اساس امتیاز نهایی
    if (finalScore <= 2) {
      analysis.riskLevel = 'کم';
      analysis.urgency = 'مراقبت معمول';
      analysis.explanation = 'وضعیت کاری در حد قابل قبول است ولی مراقبت‌های پیشگیرانه توصیه می‌شود.';
    } else if (finalScore <= 4) {
      analysis.riskLevel = 'متوسط';
      analysis.urgency = 'نیاز به بررسی';
      analysis.explanation = 'وضعیت کاری نیاز به بهبود دارد. اقدامات اصلاحی در آینده نزدیک ضروری است.';
    } else if (finalScore <= 7) {
      analysis.riskLevel = 'بالا';
      analysis.urgency = 'اقدام سریع';
      analysis.explanation = 'وضعیت کاری خطرناک است و نیاز به اقدامات فوری اصلاحی دارد.';
    } else {
      analysis.riskLevel = 'بحرانی';
      analysis.urgency = 'اقدام فوری';
      analysis.explanation = 'وضعیت کاری بسیار خطرناک است و باید فوراً متوقف شود تا اقدامات اصلاحی انجام شود.';
    }

    // توصیه‌های هوش مصنوعی
    if (bodyParts.neck?.score > 2) {
      analysis.recommendations.push('تنظیم ارتفاع نمایشگر برای کاهش خم شدن گردن');
      analysis.recommendations.push('استفاده از نگهدارنده مانیتور قابل تنظیم');
    }

    if (bodyParts.trunk?.score > 3) {
      analysis.recommendations.push('بهبود پشتیبانی کمر با صندلی ارگونومیک');
      analysis.recommendations.push('اجتناب از خم شدن مکرر با تغییر چیدمان محل کار');
    }

    if (bodyParts.upperArm?.score > 2) {
      analysis.recommendations.push('قرار دادن ابزارها در فاصله آرنج');
      analysis.recommendations.push('استفاده از تکیه‌گاه بازو');
    }

    if (bodyParts.wrist?.score > 2) {
      analysis.recommendations.push('استفاده از پد مچ دست');
      analysis.recommendations.push('تنظیم ارتفاع کیبورد و ماوس');
    }

    // اقدامات پیشگیرانه کلی
    analysis.preventiveMeasures = [
      'برگزاری جلسات آموزشی ارگونومی هر 3 ماه',
      'انجام تمرینات کششی در طول روز کاری',
      'ارزیابی دوره‌ای محیط کار',
      'استفاده از تجهیزات کمک‌آور ارگونومیک'
    ];

    return analysis;
  };

  // محاسبه امتیاز RULA
  const calculateRULA = (bodyParts) => {
    const { neck, trunk, upperArm, lowerArm, wrist } = bodyParts;
    
    // جدول A (بازو و مچ)
    let tableA = Math.max(upperArm.score, lowerArm.score, wrist.score);
    
    // جدول B (گردن، تنه، پا)
    let tableB = Math.max(neck.score, trunk.score);
    
    // امتیاز نهایی RULA (ساده‌سازی شده)
    let finalScore = Math.round((tableA + tableB) / 2);
    
    return Math.min(finalScore, 7);
  };

    // محاسبه امتیاز REBA
  const calculateREBA = (bodyParts) => {
    const { neck, trunk, upperArm, lowerArm, wrist } = bodyParts;
    const leg = bodyParts.leg || { score: 1, angle: 0 };
    
    // امتیاز تنه
    let trunkScore = trunk.score + (leg?.score || 1);
    
    // امتیاز بازو
    let armScore = upperArm.score + lowerArm.score + wrist.score;
    
    // امتیاز نهایی REBA (ساده‌سازی شده)
    let finalScore = Math.round((trunkScore + armScore + neck.score) / 3);
    
    return Math.min(finalScore, 11);
  };

  // ذخیره اطلاعات
  const handleSave = () => {
    const now = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('fa-IR', {hour: '2-digit', minute: '2-digit'});
    
    if (modalType === 'incident') {
      const newIncident = {
        id: Date.now(),
        date: now,
        time: time,
        type: modalData.type || '',
        location: modalData.location || '',
        severity: modalData.severity || 'کم',
        status: 'در حال بررسی',
        reporter: currentUser.name,
        description: modalData.description || '',
        injuredPerson: modalData.injuredPerson || '',
        witnessCount: parseInt(modalData.witnessCount) || 0,
        immediateAction: modalData.immediateAction || '',
        rootCause: modalData.rootCause || '',
        preventiveAction: modalData.preventiveAction || ''
      };
      setIncidents(prev => [newIncident, ...prev]);
      toast({
        title: "حادثه ثبت شد",
        description: "حادثه جدید با موفقیت ثبت گردید",
      });
    }

    if (modalType === 'ergonomic') {
      const bodyParts: any = {
        neck: { score: parseInt(modalData.neckScore) || 1, angle: parseInt(modalData.neckAngle) || 0 },
        trunk: { score: parseInt(modalData.trunkScore) || 1, angle: parseInt(modalData.trunkAngle) || 0 },
        upperArm: { score: parseInt(modalData.upperArmScore) || 1, angle: parseInt(modalData.upperArmAngle) || 0 },
        lowerArm: { score: parseInt(modalData.lowerArmScore) || 1, angle: parseInt(modalData.lowerArmAngle) || 0 },
        wrist: { score: parseInt(modalData.wristScore) || 1, angle: parseInt(modalData.wristAngle) || 0 }
      };

      if (modalData.assessmentType === 'REBA') {
        bodyParts.leg = { score: parseInt(modalData.legScore) || 1, angle: parseInt(modalData.legAngle) || 0 };
      }

      const finalScore = modalData.assessmentType === 'RULA' ? 
        calculateRULA(bodyParts) : calculateREBA(bodyParts);

      const riskLevel = finalScore <= 2 ? 'کم' : 
                       finalScore <= 4 ? 'متوسط' : 
                       finalScore <= 7 ? 'بالا' : 'بحرانی';

      const analysis = analyzeErgonomics({
        bodyParts,
        assessmentType: modalData.assessmentType,
        finalScore
      });

      const newAssessment = {
        id: Date.now(),
        employeeName: modalData.employeeName || '',
        department: modalData.department || '',
        position: modalData.position || '',
        assessmentType: modalData.assessmentType || 'RULA',
        date: now,
        assessor: currentUser.name,
        workstation: modalData.workstation || '',
        shiftDuration: modalData.shiftDuration || '8 ساعت',
        riskLevel: riskLevel,
        finalScore: finalScore,
        recommendations: analysis.recommendations,
        bodyParts: bodyParts,
        status: analysis.urgency,
        followUpDate: modalData.followUpDate || '',
        aiAnalysis: analysis
      };

      setErgonomicAssessments(prev => [newAssessment, ...prev]);
      toast({
        title: "ارزیابی ارگونومی ثبت شد",
        description: `ارزیابی ${modalData.assessmentType} با موفقیت انجام شد`,
      });
    }
    
    if (modalType === 'permit') {
      const newPermit = {
        id: Date.now(),
        permitNumber: `WP-${new Date().getFullYear()}-${String(workPermits.length + 1).padStart(3, '0')}`,
        type: modalData.type || '',
        requester: modalData.requester || '',
        date: now,
        startTime: modalData.startTime || '08:00',
        endTime: modalData.endTime || '17:00',
        status: 'در انتظار تایید',
        validUntil: modalData.validUntil || '',
        workDescription: modalData.workDescription || '',
        hazards: modalData.hazards ? modalData.hazards.split(',').map(h => h.trim()) : [],
        precautions: modalData.precautions ? modalData.precautions.split(',').map(p => p.trim()) : [],
        approver: '',
        witnesses: modalData.witnesses ? modalData.witnesses.split(',').map(w => w.trim()) : []
      };
      setWorkPermits(prev => [newPermit, ...prev]);
      toast({
        title: "مجوز کار ثبت شد",
        description: `مجوز ${newPermit.permitNumber} ایجاد شد`,
      });
    }
    
    if (modalType === 'report') {
      const newReport = {
        id: Date.now(),
        date: now,
        officer: currentUser.name,
        shift: modalData.shift || '',
        startTime: modalData.startTime || '',
        endTime: modalData.endTime || '',
        weather: modalData.weather || '',
        temperature: modalData.temperature || '',
        report: modalData.report || '',
        inspections: parseInt(modalData.inspections) || 0,
        trainingSessions: parseInt(modalData.trainingSessions) || 0,
        violations: parseInt(modalData.violations) || 0,
        nearMisses: parseInt(modalData.nearMisses) || 0,
        accidents: parseInt(modalData.accidents) || 0,
        ppeDistributed: parseInt(modalData.ppeDistributed) || 0,
        maintenanceRequests: parseInt(modalData.maintenanceRequests) || 0,
        suggestions: modalData.suggestions || '',
        status: 'ارسال شده'
      };
      setDailyReports(prev => [newReport, ...prev]);
      toast({
        title: "گزارش روزانه ثبت شد",
        description: "گزارش روزانه با موفقیت ارسال شد",
      });
    }
    
    if (modalType === 'risk') {
      const probValue = modalData.probability === 'کم' ? 1 : modalData.probability === 'متوسط' ? 2 : 3;
      const sevValue = modalData.severity === 'کم' ? 1 : modalData.severity === 'متوسط' ? 2 : 3;
      const riskScore = probValue * sevValue;
      const riskLevel = riskScore <= 2 ? 'کم' : riskScore <= 4 ? 'متوسط' : riskScore <= 6 ? 'بالا' : 'بحرانی';
      
      const newRisk = {
        id: Date.now(),
        assessmentId: `RA-${new Date().getFullYear()}-${String(riskAssessments.length + 1).padStart(3, '0')}`,
        area: modalData.area || '',
        process: modalData.process || '',
        hazard: modalData.hazard || '',
        hazardCategory: modalData.hazardCategory || 'فیزیکی',
        probability: modalData.probability || 'کم',
        severity: modalData.severity || 'کم',
        riskLevel: riskLevel,
        riskScore: riskScore,
        existingControls: modalData.existingControls ? modalData.existingControls.split(',').map(c => c.trim()) : [],
        additionalControls: modalData.additionalControls || '',
        responsiblePerson: modalData.responsiblePerson || currentUser.name,
        reviewDate: modalData.reviewDate || '',
        status: 'در حال بررسی'
      };
      setRiskAssessments(prev => [newRisk, ...prev]);
      toast({
        title: "ارزیابی ریسک ثبت شد",
        description: `ارزیابی ${newRisk.assessmentId} ایجاد شد`,
      });
    }
    
    if (modalType === 'user') {
      const newUser = {
        id: Date.now(),
        username: modalData.username || '',
        password: modalData.password || '',
        name: modalData.name || '',
        email: modalData.email || '',
        phone: modalData.phone || '',
        department: modalData.department || '',
        role: modalData.role || 'safety_officer',
        lastLogin: 'هرگز',
        active: true
      };
      setUsers(prev => [...prev, newUser]);
      toast({
        title: "کاربر جدید ایجاد شد",
        description: `کاربر ${newUser.name} اضافه شد`,
      });
    }
    
    closeModal();
  };

  // حذف آیتم
  const handleDelete = (type, id) => {
    if (type === 'incident') setIncidents(prev => prev.filter(item => item.id !== id));
    if (type === 'permit') setWorkPermits(prev => prev.filter(item => item.id !== id));
    if (type === 'user') setUsers(prev => prev.filter(item => item.id !== id));
    if (type === 'risk') setRiskAssessments(prev => prev.filter(item => item.id !== id));
    if (type === 'ergonomic') setErgonomicAssessments(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "حذف شد",
      description: "آیتم مورد نظر با موفقیت حذف شد",
      variant: "destructive"
    });
  };

  // تایید/رد مجوز
  const updatePermitStatus = (id, status) => {
    setWorkPermits(prev => prev.map(p => 
      p.id === id ? { 
        ...p, 
        status: status, 
        approver: status !== 'در انتظار تایید' ? currentUser.name : '' 
      } : p
    ));
    
    toast({
      title: "وضعیت مجوز تغییر کرد",
      description: `مجوز ${status} شد`,
    });
  };

  // رندر صفحه ورود
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-large">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-medium">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-primary">سیستم مدیریت HSE</CardTitle>
              <CardDescription className="text-base mt-2">گروه صنعتی دانیال استیل</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">نام کاربری</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="نام کاربری خود را وارد کنید"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  className="text-right"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">رمز عبور</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="رمز عبور خود را وارد کنید"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="text-right"
                  required
                />
              </div>
              {loginError && (
                <div className="p-3 bg-hse-danger/10 border border-hse-danger/20 rounded-md">
                  <p className="text-sm text-hse-danger text-right">{loginError}</p>
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                {loading ? 'در حال ورود...' : 'ورود به سیستم'}
              </Button>
            </form>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold text-sm mb-2 text-right">حساب‌های آزمایشی:</h4>
              <div className="space-y-1 text-xs text-muted-foreground text-right">
                <p>مدیر: admin / admin123</p>
                <p>مهندس HSE: hse_eng / hse123</p>
                <p>افسر ایمنی: safety1 / safe123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // رندر اصلی برنامه
  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <div className="flex">
        {/* Sidebar - مخفی در موبایل */}
        <div className="hidden lg:block w-64 bg-card border-l border-border h-screen fixed right-0 top-0 shadow-medium z-30">
          {/* Header */}
          <div className="p-4 lg:p-6 border-b border-border">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-base lg:text-lg text-primary truncate">HSE Management</h1>
                <p className="text-xs text-muted-foreground truncate">گروه صنعتی دانیال استیل</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-3 lg:p-4 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-7 h-7 lg:w-8 lg:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 lg:w-4 lg:h-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs lg:text-sm truncate">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{currentUser?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-2 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto" style={{maxHeight: 'calc(100vh - 250px)'}}>
            {getMenuItems().map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 rounded-lg text-right transition-colors text-sm ${
                    activeTab === item.id
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                  <span className="text-xs lg:text-sm font-medium truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 border-t border-border bg-card">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start gap-2 lg:gap-3 text-xs lg:text-sm"
              size="sm"
            >
              <LogOut className="w-3 h-3 lg:w-4 lg:h-4" />
              خروج از سیستم
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:mr-64 w-full">
          {/* Header Bar */}
          <div className="bg-card border-b border-border p-3 sm:p-4 shadow-soft sticky top-0 z-20">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                {/* منوی موبایل */}
                <Button 
                  variant="outline" 
                  size="icon"
                  className="lg:hidden h-8 w-8 flex-shrink-0"
                  onClick={() => {
                    const sidebar = document.getElementById('mobile-sidebar');
                    if (sidebar) sidebar.classList.remove('hidden');
                  }}
                >
                  <Settings className="w-4 h-4" />
                </Button>
                
                <h2 className="text-base sm:text-xl font-bold text-primary truncate">
                  {getMenuItems().find(item => item.id === activeTab)?.label || 'داشبورد'}
                </h2>
                <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                  نسخه 2.0
                </Badge>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <div className="hidden md:flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden lg:inline">{new Date().toLocaleDateString('fa-IR')}</span>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs sm:text-sm">
                  <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline mr-2">اعلانات</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-3 sm:p-4 lg:p-6">
            {/* Content will be rendered here based on activeTab */}
            {activeTab === 'dashboard' && <DashboardContent />}
            {activeTab === 'incidents' && (
              <IncidentsContent 
                incidents={incidents}
                openModal={openModal}
                handleDelete={handleDelete}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}
            {activeTab === 'ergonomics' && (
              <ErgonomicsContent 
                assessments={ergonomicAssessments}
                openModal={openModal}
                handleDelete={handleDelete}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}
            {activeTab === 'permits' && (
              <PermitsContent 
                permits={workPermits}
                openModal={openModal}
                handleDelete={handleDelete}
                updatePermitStatus={updatePermitStatus}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}
            {activeTab === 'reports' && (
              <ReportsContent 
                reports={dailyReports}
                openModal={openModal}
                handleDelete={handleDelete}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}
            {activeTab === 'risk' && (
              <EnhancedRiskAssessmentContent />
            )}
            {activeTab === 'users' && (
              <UsersContent 
                users={users}
                openModal={openModal}
                handleDelete={handleDelete}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsContent 
                incidents={incidents}
                ergonomicAssessments={ergonomicAssessments}
                workPermits={workPermits}
                dailyReports={dailyReports}
                riskAssessments={riskAssessments}
              />
            )}
            {activeTab === 'ai-insights' && (
              <AIInsightsContent 
                incidents={incidents}
                ergonomicAssessments={ergonomicAssessments}
                riskAssessments={riskAssessments}
                analyzeErgonomics={analyzeErgonomics}
              />
            )}
            {activeTab === 'health-examinations' && (
              <HealthExaminationsContent />
            )}
            {activeTab === 'safety-training' && (
              <SafetyTrainingContent />
            )}
            {activeTab === 'settings' && (
              <EditableSettingsContent 
                currentUser={currentUser}
                users={users}
                setUsers={setUsers}
              />
            )}
          </div>
        </div>

        {/* منوی کشویی موبایل */}
        <div 
          id="mobile-sidebar" 
          className="hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              e.currentTarget.classList.add('hidden');
            }
          }}
        >
          <div className="fixed right-0 top-0 bottom-0 w-64 bg-card shadow-lg flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-bold text-sm text-primary">HSE Management</h1>
                  <p className="text-xs text-muted-foreground">دانیال استیل</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => document.getElementById('mobile-sidebar')?.classList.add('hidden')}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-3 border-b border-border bg-secondary/30">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs truncate">{currentUser?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentUser?.role}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {getMenuItems().map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      document.getElementById('mobile-sidebar')?.classList.add('hidden');
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-right transition-colors text-sm ${
                      activeTab === item.id
                        ? 'bg-primary text-primary-foreground shadow-soft'
                        : 'hover:bg-secondary'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs font-medium truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-3 border-t border-border bg-card">
              <Button
                onClick={() => {
                  handleLogout();
                  document.getElementById('mobile-sidebar')?.classList.add('hidden');
                }}
                variant="outline"
                className="w-full justify-start gap-2 text-xs"
                size="sm"
              >
                <LogOut className="w-3 h-3" />
                خروج از سیستم
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <ModalContent
          modalType={modalType}
          modalData={modalData}
          setModalData={setModalData}
          handleSave={handleSave}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

// Dashboard Component
const DashboardContent = () => {
  const statsData = [
    { name: 'حوادث امسال', value: 12, change: -15, icon: AlertTriangle, color: 'hse-danger' },
    { name: 'مجوزهای فعال', value: 8, change: +3, icon: FileText, color: 'hse-info' },
    { name: 'ارزیابی‌های ارگونومی', value: 25, change: +8, icon: Activity, color: 'hse-warning' },
    { name: 'کارکنان آموزش دیده', value: 156, change: +12, icon: Users, color: 'hse-success' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className={`text-xs flex items-center gap-1 mt-1 ${
                      stat.change > 0 ? 'text-hse-success' : 'text-hse-danger'
                    }`}>
                      {stat.change > 0 ? '+' : ''}{stat.change}% نسبت به ماه قبل
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-${stat.color}/10 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              روند حوادث ماهانه
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { month: 'فروردین', incidents: 4 },
                  { month: 'اردیبهشت', incidents: 3 },
                  { month: 'خرداد', incidents: 2 },
                  { month: 'تیر', incidents: 1 },
                  { month: 'مرداد', incidents: 2 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="incidents" stroke="hsl(var(--hse-danger))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              انواع حوادث
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { type: 'جزئی', count: 8 },
                  { type: 'متوسط', count: 3 },
                  { type: 'شدید', count: 1 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>فعالیت‌های اخیر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: 'incident', title: 'حادثه جزئی در سالن تولید A', time: '2 ساعت پیش', status: 'danger' },
              { type: 'permit', title: 'مجوز جوشکاری تایید شد', time: '4 ساعت پیش', status: 'success' },
              { type: 'training', title: 'جلسه آموزش ایمنی برگزار شد', time: '1 روز پیش', status: 'info' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <div className={`w-2 h-2 rounded-full bg-hse-${activity.status}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Incidents Component
const IncidentsContent = ({ incidents, openModal, handleDelete, searchTerm, setSearchTerm }) => {
  const filteredIncidents = incidents.filter(incident =>
    incident.type.includes(searchTerm) ||
    incident.location.includes(searchTerm) ||
    incident.description.includes(searchTerm)
  );

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'کم': return 'hse-success';
      case 'متوسط': return 'hse-warning';
      case 'بالا': return 'hse-danger';
      default: return 'primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="جستجو در حوادث..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 ml-2" />
            فیلتر
          </Button>
        </div>
        <Button onClick={() => openModal('incident')} className="bg-gradient-primary">
          <Plus className="w-4 h-4 ml-2" />
          ثبت حادثه جدید
        </Button>
      </div>

      {/* Incidents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredIncidents.map((incident) => (
          <Card key={incident.id} className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{incident.type}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4" />
                    {incident.date} - {incident.time}
                  </CardDescription>
                </div>
                <Badge className={`bg-${getSeverityColor(incident.severity)}/10 text-${getSeverityColor(incident.severity)} border-${getSeverityColor(incident.severity)}/20`}>
                  {incident.severity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">مکان:</span>
                <span>{incident.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">گزارش‌دهنده:</span>
                <span>{incident.reporter}</span>
              </div>
              <p className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-lg">
                {incident.description}
              </p>
              <div className="flex items-center justify-between pt-2">
                <Badge variant="outline" className={`
                  ${incident.status === 'بررسی شده' ? 'border-hse-success text-hse-success' : 
                    incident.status === 'در حال بررسی' ? 'border-hse-warning text-hse-warning' : 
                    'border-muted-foreground text-muted-foreground'}
                `}>
                  {incident.status}
                </Badge>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openModal('incident', incident)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => openModal('incident', incident)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-hse-danger hover:text-hse-danger">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>حذف حادثه</AlertDialogTitle>
                        <AlertDialogDescription>
                          آیا از حذف این حادثه اطمینان دارید؟ این عمل قابل بازگشت نیست.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>لغو</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete('incident', incident.id)}>
                          حذف
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Modal Component
const ModalContent = ({ modalType, modalData, setModalData, handleSave, closeModal }) => {
  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {modalType === 'incident' && 'ثبت حادثه جدید'}
            {modalType === 'ergonomic' && 'ارزیابی ارگونومی'}
            {modalType === 'permit' && 'مجوز کار جدید'}
            {modalType === 'report' && 'گزارش روزانه'}
            {modalType === 'risk' && 'ارزیابی ریسک'}
            {modalType === 'user' && 'کاربر جدید'}
          </DialogTitle>
          <DialogDescription>
            اطلاعات مورد نیاز را تکمیل کنید
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {modalType === 'incident' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نوع حادثه</Label>
                  <Select value={modalData.type || ''} onValueChange={(value) => setModalData({...modalData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="حادثه جزئی">حادثه جزئی</SelectItem>
                      <SelectItem value="حادثه متوسط">حادثه متوسط</SelectItem>
                      <SelectItem value="حادثه شدید">حادثه شدید</SelectItem>
                      <SelectItem value="نزدیک به حادثه">نزدیک به حادثه</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>شدت</Label>
                  <Select value={modalData.severity || 'کم'} onValueChange={(value) => setModalData({...modalData, severity: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="کم">کم</SelectItem>
                      <SelectItem value="متوسط">متوسط</SelectItem>
                      <SelectItem value="بالا">بالا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>مکان وقوع</Label>
                <Input
                  value={modalData.location || ''}
                  onChange={(e) => setModalData({...modalData, location: e.target.value})}
                  placeholder="مکان دقیق حادثه"
                />
              </div>
              <div className="space-y-2">
                <Label>شرح حادثه</Label>
                <Textarea
                  value={modalData.description || ''}
                  onChange={(e) => setModalData({...modalData, description: e.target.value})}
                  placeholder="شرح کاملی از حادثه ارائه دهید"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>فرد آسیب‌دیده</Label>
                  <Input
                    value={modalData.injuredPerson || ''}
                    onChange={(e) => setModalData({...modalData, injuredPerson: e.target.value})}
                    placeholder="نام فرد آسیب‌دیده (در صورت وجود)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>تعداد شاهدان</Label>
                  <Input
                    type="number"
                    value={modalData.witnessCount || ''}
                    onChange={(e) => setModalData({...modalData, witnessCount: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>اقدامات فوری انجام شده</Label>
                <Textarea
                  value={modalData.immediateAction || ''}
                  onChange={(e) => setModalData({...modalData, immediateAction: e.target.value})}
                  placeholder="اقداماتی که بلافاصله پس از حادثه انجام شد"
                  rows={3}
                />
              </div>
            </>
          )}

          {modalType === 'ergonomic' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نام کارمند</Label>
                  <Input
                    value={modalData.employeeName || ''}
                    onChange={(e) => setModalData({...modalData, employeeName: e.target.value})}
                    placeholder="نام و نام خانوادگی"
                  />
                </div>
                <div className="space-y-2">
                  <Label>بخش</Label>
                  <Input
                    value={modalData.department || ''}
                    onChange={(e) => setModalData({...modalData, department: e.target.value})}
                    placeholder="بخش کاری"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>سمت شغلی</Label>
                  <Input
                    value={modalData.position || ''}
                    onChange={(e) => setModalData({...modalData, position: e.target.value})}
                    placeholder="سمت کاری"
                  />
                </div>
                <div className="space-y-2">
                  <Label>نوع ارزیابی</Label>
                  <Select value={modalData.assessmentType || 'RULA'} onValueChange={(value) => setModalData({...modalData, assessmentType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RULA">RULA</SelectItem>
                      <SelectItem value="REBA">REBA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>ایستگاه کاری</Label>
                <Input
                  value={modalData.workstation || ''}
                  onChange={(e) => setModalData({...modalData, workstation: e.target.value})}
                  placeholder="محل کار دقیق"
                />
              </div>
              
              {/* Body Parts Assessment */}
              <div className="space-y-4 p-4 border border-border rounded-lg">
                <h4 className="font-semibold">امتیازدهی اعضای بدن</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>گردن - امتیاز</Label>
                    <Select value={modalData.neckScore || '1'} onValueChange={(value) => setModalData({...modalData, neckScore: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4].map(score => (
                          <SelectItem key={score} value={score.toString()}>{score}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>تنه - امتیاز</Label>
                    <Select value={modalData.trunkScore || '1'} onValueChange={(value) => setModalData({...modalData, trunkScore: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5].map(score => (
                          <SelectItem key={score} value={score.toString()}>{score}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>بازوی بالا - امتیاز</Label>
                    <Select value={modalData.upperArmScore || '1'} onValueChange={(value) => setModalData({...modalData, upperArmScore: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4].map(score => (
                          <SelectItem key={score} value={score.toString()}>{score}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>مچ دست - امتیاز</Label>
                    <Select value={modalData.wristScore || '1'} onValueChange={(value) => setModalData({...modalData, wristScore: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4].map(score => (
                          <SelectItem key={score} value={score.toString()}>{score}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </>
          )}

          {modalType === 'permit' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>شماره مجوز</Label>
                  <Input
                    value={modalData.permitNumber || ''}
                    onChange={(e) => setModalData({...modalData, permitNumber: e.target.value})}
                    placeholder="شماره مجوز"
                  />
                </div>
                <div className="space-y-2">
                  <Label>نوع مجوز</Label>
                  <Select value={modalData.type || ''} onValueChange={(value) => setModalData({...modalData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="کار در ارتفاع">کار در ارتفاع</SelectItem>
                      <SelectItem value="کار داغ">کار داغ</SelectItem>
                      <SelectItem value="ورود به فضای محدود">ورود به فضای محدود</SelectItem>
                      <SelectItem value="جوشکاری">جوشکاری</SelectItem>
                      <SelectItem value="تعمیرات برقی">تعمیرات برقی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>شرح کار</Label>
                <Textarea
                  value={modalData.workDescription || ''}
                  onChange={(e) => setModalData({...modalData, workDescription: e.target.value})}
                  placeholder="شرح دقیق کار مورد نظر"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>تاریخ شروع</Label>
                  <Input
                    type="date"
                    value={modalData.permitDate || ''}
                    onChange={(e) => setModalData({...modalData, permitDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ساعت شروع</Label>
                  <Input
                    type="time"
                    value={modalData.startTime || ''}
                    onChange={(e) => setModalData({...modalData, startTime: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ساعت پایان</Label>
                  <Input
                    type="time"
                    value={modalData.endTime || ''}
                    onChange={(e) => setModalData({...modalData, endTime: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>خطرات احتمالی</Label>
                <Textarea
                  value={modalData.hazards || ''}
                  onChange={(e) => setModalData({...modalData, hazards: e.target.value})}
                  placeholder="خطرات مرتبط با این کار را شرح دهید"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>اقدامات احتیاطی</Label>
                <Textarea
                  value={modalData.precautions || ''}
                  onChange={(e) => setModalData({...modalData, precautions: e.target.value})}
                  placeholder="اقدامات احتیاطی مورد نیاز"
                  rows={3}
                />
              </div>
            </>
          )}

          {modalType === 'risk' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>شناسه ارزیابی</Label>
                  <Input
                    value={modalData.assessmentId || ''}
                    onChange={(e) => setModalData({...modalData, assessmentId: e.target.value})}
                    placeholder="کد ارزیابی"
                  />
                </div>
                <div className="space-y-2">
                  <Label>نام فرآیند</Label>
                  <Input
                    value={modalData.processName || ''}
                    onChange={(e) => setModalData({...modalData, processName: e.target.value})}
                    placeholder="نام فرآیند"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>منطقه</Label>
                <Input
                  value={modalData.area || ''}
                  onChange={(e) => setModalData({...modalData, area: e.target.value})}
                  placeholder="منطقه یا بخش"
                />
              </div>
              <div className="space-y-2">
                <Label>خطر شناسایی شده</Label>
                <Textarea
                  value={modalData.hazard || ''}
                  onChange={(e) => setModalData({...modalData, hazard: e.target.value})}
                  placeholder="شرح خطر"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>دسته‌بندی خطر</Label>
                  <Select value={modalData.hazardCategory || 'فیزیکی'} onValueChange={(value) => setModalData({...modalData, hazardCategory: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="فیزیکی">فیزیکی</SelectItem>
                      <SelectItem value="شیمیایی">شیمیایی</SelectItem>
                      <SelectItem value="بیولوژیکی">بیولوژیکی</SelectItem>
                      <SelectItem value="ارگونومی">ارگونومی</SelectItem>
                      <SelectItem value="ایمنی">ایمنی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>احتمال وقوع</Label>
                  <Select value={modalData.probability || ''} onValueChange={(value) => setModalData({...modalData, probability: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="خیلی کم">خیلی کم (1)</SelectItem>
                      <SelectItem value="کم">کم (2)</SelectItem>
                      <SelectItem value="متوسط">متوسط (3)</SelectItem>
                      <SelectItem value="بالا">بالا (4)</SelectItem>
                      <SelectItem value="خیلی بالا">خیلی بالا (5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>شدت پیامد</Label>
                <Select value={modalData.severity || ''} onValueChange={(value) => setModalData({...modalData, severity: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ناچیز">ناچیز (1)</SelectItem>
                    <SelectItem value="جزئی">جزئی (2)</SelectItem>
                    <SelectItem value="متوسط">متوسط (3)</SelectItem>
                    <SelectItem value="شدید">شدید (4)</SelectItem>
                    <SelectItem value="فاجعه‌بار">فاجعه‌بار (5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>کنترل‌های موجود</Label>
                <Textarea
                  value={modalData.existingControls || ''}
                  onChange={(e) => setModalData({...modalData, existingControls: e.target.value})}
                  placeholder="کنترل‌های موجود برای این خطر"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>کنترل‌های اضافی پیشنهادی</Label>
                <Textarea
                  value={modalData.additionalControls || ''}
                  onChange={(e) => setModalData({...modalData, additionalControls: e.target.value})}
                  placeholder="کنترل‌های اضافی مورد نیاز"
                  rows={3}
                />
              </div>
            </>
          )}

          {modalType === 'report' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>تاریخ گزارش</Label>
                  <Input
                    type="date"
                    value={modalData.reportDate || ''}
                    onChange={(e) => setModalData({...modalData, reportDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>شیفت</Label>
                  <Select value={modalData.shift || ''} onValueChange={(value) => setModalData({...modalData, shift: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="صبح">صبح</SelectItem>
                      <SelectItem value="عصر">عصر</SelectItem>
                      <SelectItem value="شب">شب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ساعت شروع</Label>
                  <Input
                    type="time"
                    value={modalData.startTime || ''}
                    onChange={(e) => setModalData({...modalData, startTime: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ساعت پایان</Label>
                  <Input
                    type="time"
                    value={modalData.endTime || ''}
                    onChange={(e) => setModalData({...modalData, endTime: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>وضع آب و هوا</Label>
                  <Select value={modalData.weather || ''} onValueChange={(value) => setModalData({...modalData, weather: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="آفتابی">آفتابی</SelectItem>
                      <SelectItem value="ابری">ابری</SelectItem>
                      <SelectItem value="بارانی">بارانی</SelectItem>
                      <SelectItem value="برفی">برفی</SelectItem>
                      <SelectItem value="طوفانی">طوفانی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>دما (درجه سانتیگراد)</Label>
                  <Input
                    type="number"
                    value={modalData.temperature || ''}
                    onChange={(e) => setModalData({...modalData, temperature: e.target.value})}
                    placeholder="25"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>تعداد بازرسی‌ها</Label>
                  <Input
                    type="number"
                    value={modalData.inspections || '0'}
                    onChange={(e) => setModalData({...modalData, inspections: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>تعداد حوادث</Label>
                  <Input
                    type="number"
                    value={modalData.accidents || '0'}
                    onChange={(e) => setModalData({...modalData, accidents: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>نزدیک به حادثه</Label>
                  <Input
                    type="number"
                    value={modalData.nearMisses || '0'}
                    onChange={(e) => setModalData({...modalData, nearMisses: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>تخلفات</Label>
                  <Input
                    type="number"
                    value={modalData.violations || '0'}
                    onChange={(e) => setModalData({...modalData, violations: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>آموزش‌های ارائه شده</Label>
                  <Input
                    type="number"
                    value={modalData.trainingSessions || '0'}
                    onChange={(e) => setModalData({...modalData, trainingSessions: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>PPE توزیع شده</Label>
                  <Input
                    type="number"
                    value={modalData.ppeDistributed || '0'}
                    onChange={(e) => setModalData({...modalData, ppeDistributed: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>متن گزارش</Label>
                <Textarea
                  value={modalData.reportText || ''}
                  onChange={(e) => setModalData({...modalData, reportText: e.target.value})}
                  placeholder="گزارش تفصیلی از فعالیت‌های روز"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>پیشنهادات</Label>
                <Textarea
                  value={modalData.suggestions || ''}
                  onChange={(e) => setModalData({...modalData, suggestions: e.target.value})}
                  placeholder="پیشنهادات برای بهبود ایمنی"
                  rows={3}
                />
              </div>
            </>
          )}

          {modalType === 'user' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نام و نام خانوادگی</Label>
                  <Input
                    value={modalData.name || ''}
                    onChange={(e) => setModalData({...modalData, name: e.target.value})}
                    placeholder="نام کامل"
                  />
                </div>
                <div className="space-y-2">
                  <Label>ایمیل</Label>
                  <Input
                    type="email"
                    value={modalData.email || ''}
                    onChange={(e) => setModalData({...modalData, email: e.target.value})}
                    placeholder="example@company.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>تلفن</Label>
                  <Input
                    value={modalData.phone || ''}
                    onChange={(e) => setModalData({...modalData, phone: e.target.value})}
                    placeholder="09xxxxxxxxx"
                  />
                </div>
                <div className="space-y-2">
                  <Label>بخش</Label>
                  <Input
                    value={modalData.department || ''}
                    onChange={(e) => setModalData({...modalData, department: e.target.value})}
                    placeholder="نام بخش"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>نقش</Label>
                <Select value={modalData.role || 'safety_officer'} onValueChange={(value) => setModalData({...modalData, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safety_officer">افسر ایمنی</SelectItem>
                    <SelectItem value="supervisor">سرپرست</SelectItem>
                    <SelectItem value="manager">مدیر</SelectItem>
                    <SelectItem value="admin">مدیر سیستم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={closeModal}>
            انصراف
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary">
            ذخیره
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Ergonomics Content Component
const ErgonomicsContent = ({ assessments, openModal, handleDelete, searchTerm, setSearchTerm }) => {
  const filteredAssessments = assessments.filter(assessment =>
    assessment.employeeName.includes(searchTerm) ||
    assessment.department.includes(searchTerm) ||
    assessment.position.includes(searchTerm)
  );

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'کم': return 'hse-success';
      case 'متوسط': return 'hse-warning';
      case 'بالا': return 'hse-danger';
      default: return 'primary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="جستجو در ارزیابی‌های ارگونومی..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10"
            />
          </div>
        </div>
        <Button onClick={() => openModal('ergonomic')} className="bg-gradient-primary">
          <Plus className="w-4 h-4 ml-2" />
          ارزیابی جدید
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAssessments.map((assessment) => (
          <Card key={assessment.id} className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{assessment.employeeName}</CardTitle>
                  <CardDescription>{assessment.department} - {assessment.position}</CardDescription>
                </div>
                <Badge className={`bg-${getRiskColor(assessment.riskLevel)}/10 text-${getRiskColor(assessment.riskLevel)}`}>
                  {assessment.riskLevel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{assessment.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span>امتیاز نهایی: {assessment.finalScore}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-muted-foreground" />
                <span>وضعیت: {assessment.status}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => openModal('ergonomic', assessment)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => openModal('ergonomic', assessment)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-hse-danger">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>حذف ارزیابی</AlertDialogTitle>
                      <AlertDialogDescription>
                        آیا از حذف این ارزیابی اطمینان دارید؟
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>لغو</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete('ergonomic', assessment.id)}>
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Work Permits Content Component
const PermitsContent = ({ permits, openModal, handleDelete, updatePermitStatus, searchTerm, setSearchTerm }) => {
  const filteredPermits = permits.filter(permit =>
    permit.permitNumber.includes(searchTerm) ||
    permit.type.includes(searchTerm) ||
    permit.workDescription.includes(searchTerm)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'تایید شده': return 'hse-success';
      case 'در انتظار تایید': return 'hse-warning';
      case 'رد شده': return 'hse-danger';
      case 'تکمیل شده': return 'hse-info';
      default: return 'primary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="جستجو در مجوزهای کار..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10"
            />
          </div>
        </div>
        <Button onClick={() => openModal('permit')} className="bg-gradient-primary">
          <Plus className="w-4 h-4 ml-2" />
          مجوز جدید
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPermits.map((permit) => (
          <Card key={permit.id} className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{permit.permitNumber}</CardTitle>
                  <CardDescription>{permit.type}</CardDescription>
                </div>
                <Badge className={`bg-${getStatusColor(permit.status)}/10 text-${getStatusColor(permit.status)}`}>
                  {permit.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{permit.date} ({permit.startTime} - {permit.endTime})</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">شرح کار:</span>
                <p className="text-muted-foreground mt-1">{permit.workDescription}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>درخواست‌کننده: {permit.requester}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  {permit.status === 'در انتظار تایید' && (
                    <>
                      <Button size="sm" onClick={() => updatePermitStatus(permit.id, 'تایید شده')} className="bg-hse-success text-white">
                        تایید
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updatePermitStatus(permit.id, 'رد شده')} className="text-hse-danger">
                        رد
                      </Button>
                    </>
                  )}
                  {permit.status === 'تایید شده' && (
                    <Button size="sm" onClick={() => updatePermitStatus(permit.id, 'تکمیل شده')} className="bg-hse-info text-white">
                      تکمیل کار
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openModal('permit', permit)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-hse-danger">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>حذف مجوز</AlertDialogTitle>
                        <AlertDialogDescription>
                          آیا از حذف این مجوز اطمینان دارید؟
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>لغو</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete('permit', permit.id)}>
                          حذف
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Daily Reports Content Component
const ReportsContent = ({ reports, openModal, handleDelete, searchTerm, setSearchTerm }) => {
  const filteredReports = reports.filter(report =>
    report.shift.includes(searchTerm) ||
    report.weather.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="جستجو در گزارش‌های روزانه..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10"
            />
          </div>
        </div>
        <Button onClick={() => openModal('report')} className="bg-gradient-primary">
          <Plus className="w-4 h-4 ml-2" />
          گزارش جدید
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <Card key={report.id} className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">گزارش {report.shift}</CardTitle>
                  <CardDescription>{report.date}</CardDescription>
                </div>
                <Badge variant="outline">{report.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{report.startTime} - {report.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-muted-foreground" />
                  <span>{report.temperature}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>بازرسی‌ها: {report.inspections}</div>
                <div>آموزش‌ها: {report.trainingSessions}</div>
                <div>تخلفات: {report.violations}</div>
                <div>حوادث: {report.accidents}</div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => openModal('report', report)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => openModal('report', report)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-hse-danger">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>حذف گزارش</AlertDialogTitle>
                      <AlertDialogDescription>
                        آیا از حذف این گزارش اطمینان دارید؟
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>لغو</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete('report', report.id)}>
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Risk Assessment Content Component
const RiskAssessmentContent = ({ assessments, openModal, handleDelete, searchTerm, setSearchTerm }) => {
  const filteredAssessments = assessments.filter(assessment =>
    assessment.assessmentId.includes(searchTerm) ||
    assessment.area.includes(searchTerm) ||
    assessment.hazard.includes(searchTerm)
  );

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'کم': return 'hse-success';
      case 'متوسط': return 'hse-warning';
      case 'بالا': return 'hse-danger';
      default: return 'primary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="جستجو در ارزیابی‌های ریسک..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10"
            />
          </div>
        </div>
        <Button onClick={() => openModal('risk')} className="bg-gradient-primary">
          <Plus className="w-4 h-4 ml-2" />
          ارزیابی جدید
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAssessments.map((assessment) => (
          <Card key={assessment.id} className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{assessment.assessmentId}</CardTitle>
                  <CardDescription>{assessment.area} - {assessment.processName}</CardDescription>
                </div>
                <Badge className={`bg-${getRiskColor(assessment.riskLevel)}/10 text-${getRiskColor(assessment.riskLevel)}`}>
                  {assessment.riskLevel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">خطر:</span>
                <span>{assessment.hazard}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">امتیاز ریسک:</span>
                <span>{assessment.riskScore}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">مسئول:</span>
                <span>{assessment.responsiblePerson}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">وضعیت:</span>
                <span>{assessment.status}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => openModal('risk', assessment)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => openModal('risk', assessment)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-hse-danger">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>حذف ارزیابی</AlertDialogTitle>
                      <AlertDialogDescription>
                        آیا از حذف این ارزیابی ریسک اطمینان دارید؟
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>لغو</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete('risk', assessment.id)}>
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Users Content Component
const UsersContent = ({ users, openModal, handleDelete, searchTerm, setSearchTerm }) => {
  const filteredUsers = users.filter(user =>
    user.name.includes(searchTerm) ||
    user.department.includes(searchTerm) ||
    user.role.includes(searchTerm)
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'hse-danger';
      case 'safety_manager': return 'hse-warning';
      case 'safety_officer': return 'hse-info';
      case 'employee': return 'hse-success';
      default: return 'primary';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'مدیر سیستم';
      case 'safety_manager': return 'مدیر ایمنی';
      case 'safety_officer': return 'افسر ایمنی';
      case 'employee': return 'کارمند';
      default: return role;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="جستجو در کاربران..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10"
            />
          </div>
        </div>
        <Button onClick={() => openModal('user')} className="bg-gradient-primary">
          <Plus className="w-4 h-4 ml-2" />
          کاربر جدید
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription>{user.department}</CardDescription>
                  </div>
                </div>
                <Badge className={`bg-${getRoleColor(user.role)}/10 text-${getRoleColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>آخرین ورود: {user.lastLogin}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className={`w-4 h-4 ${user.active ? 'text-hse-success' : 'text-muted-foreground'}`} />
                <span>{user.active ? 'فعال' : 'غیرفعال'}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => openModal('user', user)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => openModal('user', user)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-hse-danger">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>حذف کاربر</AlertDialogTitle>
                      <AlertDialogDescription>
                        آیا از حذف این کاربر اطمینان دارید؟
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>لغو</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete('user', user.id)}>
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Analytics Content Component
const AnalyticsContent = ({ incidents, ergonomicAssessments, workPermits, dailyReports, riskAssessments }) => {
  // Generate analytics data
  const currentMonth = new Date().getMonth();
  const monthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  
  // Incident trends data
  const incidentTrendsData = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (currentMonth - 5 + i + 12) % 12;
    return {
      month: monthNames[monthIndex],
      incidents: Math.floor(Math.random() * 8) + 1,
      nearMisses: Math.floor(Math.random() * 15) + 5,
      accidents: Math.floor(Math.random() * 3)
    };
  });

  // Risk distribution data
  const riskDistributionData = [
    { name: 'کم', value: 45, fill: 'hsl(var(--hse-success))' },
    { name: 'متوسط', value: 35, fill: 'hsl(var(--hse-warning))' },
    { name: 'بالا', value: 15, fill: 'hsl(var(--hse-danger))' },
    { name: 'بحرانی', value: 5, fill: 'hsl(var(--destructive))' }
  ];

  // Department statistics
  const departmentData = [
    { department: 'تولید', incidents: 8, training: 45, compliance: 92 },
    { department: 'نگهداری', incidents: 3, training: 32, compliance: 88 },
    { department: 'انبار', incidents: 2, training: 28, compliance: 95 },
    { department: 'مدیریت', incidents: 0, training: 15, compliance: 100 }
  ];

  // Training effectiveness data
  const trainingData = [
    { month: 'فروردین', beforeTraining: 12, afterTraining: 3 },
    { month: 'اردیبهشت', beforeTraining: 8, afterTraining: 2 },
    { month: 'خرداد', beforeTraining: 15, afterTraining: 4 },
    { month: 'تیر', beforeTraining: 6, afterTraining: 1 },
    { month: 'مرداد', beforeTraining: 10, afterTraining: 2 },
    { month: 'شهریور', beforeTraining: 4, afterTraining: 1 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">تحلیل و آمار HSE</h2>
          <p className="text-muted-foreground">تحلیل جامع عملکرد ایمنی و بهداشت</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 ml-2" />
            دانلود گزارش
          </Button>
          <Button className="bg-gradient-primary">
            <Upload className="w-4 h-4 ml-2" />
            صادرات آمار
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'کل حوادث امسال', value: incidents.length, change: -12, icon: AlertTriangle, color: 'hse-danger' },
          { title: 'نرخ ایمنی', value: '94.2%', change: +3.5, icon: Shield, color: 'hse-success' },
          { title: 'ارزیابی‌های انجام شده', value: ergonomicAssessments.length + riskAssessments.length, change: +8, icon: CheckCircle, color: 'hse-info' },
          { title: 'روزهای بدون حادثه', value: 45, change: +15, icon: Target, color: 'hse-warning' }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold text-primary">{metric.value}</p>
                    <p className={`text-xs flex items-center gap-1 mt-1 ${
                      metric.change > 0 ? 'text-hse-success' : 'text-hse-danger'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}% نسبت به ماه قبل
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-${metric.color}/10 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              روند حوادث و حوادث نزدیک
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={incidentTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="incidents" stroke="hsl(var(--hse-danger))" strokeWidth={2} name="حوادث" />
                  <Line type="monotone" dataKey="nearMisses" stroke="hsl(var(--hse-warning))" strokeWidth={2} name="نزدیک به حادثه" />
                  <Line type="monotone" dataKey="accidents" stroke="hsl(var(--destructive))" strokeWidth={2} name="حوادث جدی" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              توزیع سطح ریسک
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              آمار بخش‌ها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="incidents" fill="hsl(var(--hse-danger))" name="حوادث" />
                  <Bar dataKey="training" fill="hsl(var(--hse-info))" name="آموزش‌ها" />
                  <Bar dataKey="compliance" fill="hsl(var(--hse-success))" name="رعایت قوانین %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              اثربخشی آموزش‌ها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trainingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="beforeTraining" stroke="hsl(var(--hse-danger))" strokeWidth={2} name="قبل از آموزش" />
                  <Line type="monotone" dataKey="afterTraining" stroke="hsl(var(--hse-success))" strokeWidth={2} name="بعد از آموزش" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>خلاصه آماری ماهانه</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ماه</TableHead>
                <TableHead>حوادث</TableHead>
                <TableHead>آموزش‌ها</TableHead>
                <TableHead>مجوزها</TableHead>
                <TableHead>ارزیابی‌ها</TableHead>
                <TableHead>نرخ ایمنی</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidentTrendsData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{data.month}</TableCell>
                  <TableCell>{data.incidents}</TableCell>
                  <TableCell>{Math.floor(Math.random() * 10) + 5}</TableCell>
                  <TableCell>{Math.floor(Math.random() * 15) + 10}</TableCell>
                  <TableCell>{Math.floor(Math.random() * 8) + 3}</TableCell>
                  <TableCell>
                    <Badge className={`${(95 - data.incidents) > 90 ? 'bg-hse-success/10 text-hse-success' : 'bg-hse-warning/10 text-hse-warning'}`}>
                      {95 - data.incidents}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// AI Insights Content Component
const AIInsightsContent = ({ incidents, ergonomicAssessments, riskAssessments, analyzeErgonomics }) => {
  // AI Analysis Functions
  const generateIncidentPattern = () => {
    const patterns = [
      {
        title: 'الگوی زمانی حوادث',
        insight: 'بیشترین حوادث در ساعات 10-12 صبح و 14-16 بعدازظهر رخ می‌دهد',
        recommendation: 'افزایش نظارت در این بازه‌های زمانی',
        confidence: 87,
        type: 'temporal'
      },
      {
        title: 'نقاط حادثه‌خیز',
        insight: 'سالن تولید A بیشترین آمار حوادث را دارد (45% کل حوادث)',
        recommendation: 'بررسی شرایط ایمنی و بازآموزی کارکنان این بخش',
        confidence: 92,
        type: 'location'
      },
      {
        title: 'عوامل انسانی',
        insight: 'خستگی و عدم تمرکز عامل 60% حوادث شناسایی شده است',
        recommendation: 'برنامه‌ریزی استراحت‌های مناسب و کاهش اضافه‌کاری',
        confidence: 78,
        type: 'human'
      }
    ];
    return patterns;
  };

  const generateErgonomicInsights = () => {
    return ergonomicAssessments.map(assessment => ({
      ...assessment,
      aiAnalysis: analyzeErgonomics(assessment)
    }));
  };

  const generatePredictiveAlerts = () => {
    return [
      {
        id: 1,
        type: 'ریسک بالا',
        message: 'احتمال وقوع حادثه در بخش جوشکاری طی هفته آینده بالا است',
        probability: 73,
        factors: ['افزایش حجم کار', 'کاهش نظارت', 'خستگی کارکنان'],
        urgency: 'high'
      },
      {
        id: 2,
        type: 'نیاز به آموزش',
        message: 'کارکنان بخش انبار نیاز به بازآموزی ایمنی دارند',
        probability: 68,
        factors: ['افزایش تخلفات جزئی', 'کاهش استفاده از PPE'],
        urgency: 'medium'
      },
      {
        id: 3,
        type: 'تعمیرات پیشگیرانه',
        message: 'تجهیزات حفاظتی خط تولید 2 نیاز به بررسی دارند',
        probability: 82,
        factors: ['گذشت زمان از آخرین سرویس', 'گزارش‌های اخیر عملکرد'],
        urgency: 'high'
      }
    ];
  };

  const patterns = generateIncidentPattern();
  const ergonomicInsights = generateErgonomicInsights();
  const alerts = generatePredictiveAlerts();

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'hse-danger';
      case 'medium': return 'hse-warning';
      case 'low': return 'hse-success';
      default: return 'primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
            <Brain className="w-8 h-8" />
            تحلیل هوش مصنوعی HSE
          </h2>
          <p className="text-muted-foreground">بینش‌های هوشمند و پیش‌بینی‌های ایمنی</p>
        </div>
        <Badge className="bg-gradient-primary text-white px-4 py-2">
          <Zap className="w-4 h-4 ml-2" />
          AI Powered
        </Badge>
      </div>

      {/* Predictive Alerts */}
      <Card className="shadow-soft border-l-4 border-l-hse-warning">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-hse-warning">
            <AlertTriangle className="w-5 h-5" />
            هشدارهای پیش‌بینانه
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border border-${getUrgencyColor(alert.urgency)}/20 bg-${getUrgencyColor(alert.urgency)}/5`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={`bg-${getUrgencyColor(alert.urgency)}/10 text-${getUrgencyColor(alert.urgency)}`}>
                        {alert.type}
                      </Badge>
                      <span className="text-sm font-medium">احتمال: {alert.probability}%</span>
                    </div>
                    <p className="text-sm font-medium mb-2">{alert.message}</p>
                    <div className="flex flex-wrap gap-1">
                      {alert.factors.map((factor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" className={`bg-${getUrgencyColor(alert.urgency)} text-white`}>
                    اقدام
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pattern Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {patterns.map((pattern, index) => (
          <Card key={index} className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                {pattern.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-sm font-medium mb-2">تحلیل:</p>
                <p className="text-sm text-muted-foreground">{pattern.insight}</p>
              </div>
              <div className="p-3 bg-hse-info/10 rounded-lg">
                <p className="text-sm font-medium mb-2 text-hse-info">توصیه:</p>
                <p className="text-sm">{pattern.recommendation}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">اعتماد AI:</span>
                <Badge className={`${pattern.confidence > 80 ? 'bg-hse-success/10 text-hse-success' : 'bg-hse-warning/10 text-hse-warning'}`}>
                  {pattern.confidence}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ergonomic AI Analysis */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            تحلیل هوشمند ارگونومی
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ergonomicInsights.slice(0, 3).map((assessment, index) => (
              <div key={index} className="p-4 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{assessment.employeeName}</h4>
                    <p className="text-sm text-muted-foreground">{assessment.department} - {assessment.position}</p>
                  </div>
                  <Badge className={`bg-${assessment.riskLevel === 'بالا' ? 'hse-danger' : assessment.riskLevel === 'متوسط' ? 'hse-warning' : 'hse-success'}/10 text-${assessment.riskLevel === 'بالا' ? 'hse-danger' : assessment.riskLevel === 'متوسط' ? 'hse-warning' : 'hse-success'}`}>
                    {assessment.riskLevel}
                  </Badge>
                </div>
                
                <div className="bg-secondary/20 p-3 rounded-lg mb-3">
                  <p className="text-sm font-medium mb-1">تحلیل AI:</p>
                  <p className="text-sm text-muted-foreground">{assessment.aiAnalysis?.explanation}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-medium mb-2">توصیه‌های هوشمند:</p>
                    <ul className="text-sm space-y-1">
                      {assessment.aiAnalysis?.recommendations.slice(0, 2).map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-hse-success mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">اقدامات پیشگیرانه:</p>
                    <ul className="text-sm space-y-1">
                      {assessment.aiAnalysis?.preventiveMeasures.slice(0, 2).map((measure, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Shield className="w-3 h-3 text-hse-info mt-0.5 flex-shrink-0" />
                          {measure}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Prediction Matrix */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            ماتریس پیش‌بینی ریسک
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { area: 'سالن تولید A', risk: 85, trend: 'افزایشی', factors: ['حجم کار بالا', 'کمبود نیرو'] },
              { area: 'تعمیرگاه', risk: 45, trend: 'ثابت', factors: ['تجهیزات قدیمی', 'آموزش کافی'] },
              { area: 'انبار مواد', risk: 62, trend: 'کاهشی', factors: ['بهبود سیستم‌ها', 'آموزش اخیر'] }
            ].map((area, index) => (
              <div key={index} className="p-4 rounded-lg border border-border">
                <h4 className="font-medium mb-2">{area.area}</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">امتیاز ریسک:</span>
                    <Badge className={`${area.risk > 70 ? 'bg-hse-danger/10 text-hse-danger' : area.risk > 50 ? 'bg-hse-warning/10 text-hse-warning' : 'bg-hse-success/10 text-hse-success'}`}>
                      {area.risk}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">روند:</span>
                    <span className={`text-sm ${area.trend === 'افزایشی' ? 'text-hse-danger' : area.trend === 'کاهشی' ? 'text-hse-success' : 'text-muted-foreground'}`}>
                      {area.trend}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">عوامل موثر:</p>
                    <div className="flex flex-wrap gap-1">
                      {area.factors.map((factor, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Settings Content Component
const SettingsContent = ({ currentUser, users, setUsers }) => {
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');
  const [systemSettings, setSystemSettings] = useState({
    autoNotifications: true,
    emailReports: true,
    darkMode: false,
    language: 'fa',
    timezone: 'Asia/Tehran',
    autoBackup: true,
    reportFrequency: 'daily',
    alertThreshold: 'medium'
  });

  const handleSystemSettingChange = (key, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleUserStatusToggle = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
            <Settings className="w-8 h-8" />
            تنظیمات سیستم
          </h2>
          <p className="text-muted-foreground">مدیریت تنظیمات و پیکربندی سیستم</p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Card className="shadow-soft">
        <CardContent className="p-0">
          <Tabs value={activeSettingsTab} onValueChange={setActiveSettingsTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">پروفایل</TabsTrigger>
              <TabsTrigger value="system">سیستم</TabsTrigger>
              <TabsTrigger value="notifications">اعلانات</TabsTrigger>
              <TabsTrigger value="security">امنیت</TabsTrigger>
            </TabsList>

            {/* Profile Settings */}
            <TabsContent value="profile" className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">اطلاعات پروفایل</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>نام کاربری</Label>
                    <Input value={currentUser?.username || ''} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>نام کامل</Label>
                    <Input value={currentUser?.name || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label>ایمیل</Label>
                    <Input value={currentUser?.email || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label>تلفن</Label>
                    <Input value={currentUser?.phone || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label>بخش</Label>
                    <Select value={currentUser?.department || ''}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HSE">HSE</SelectItem>
                        <SelectItem value="مدیریت">مدیریت</SelectItem>
                        <SelectItem value="تولید">تولید</SelectItem>
                        <SelectItem value="نگهداری">نگهداری</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>نقش</Label>
                    <Input value={currentUser?.role === 'manager' ? 'مدیر سیستم' : currentUser?.role === 'hse_engineer' ? 'مهندس HSE' : 'افسر ایمنی'} disabled />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button className="bg-gradient-primary">ذخیره تغییرات</Button>
                  <Button variant="outline">تغییر رمز عبور</Button>
                </div>
              </div>
            </TabsContent>

            {/* System Settings */}
            <TabsContent value="system" className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">تنظیمات عمومی سیستم</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <h4 className="font-medium">حالت تاریک</h4>
                      <p className="text-sm text-muted-foreground">فعالسازی ظاهر تاریک سیستم</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={systemSettings.darkMode}
                      onChange={(e) => handleSystemSettingChange('darkMode', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <h4 className="font-medium">پشتیبان‌گیری خودکار</h4>
                      <p className="text-sm text-muted-foreground">پشتیبان‌گیری روزانه از اطلاعات</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={systemSettings.autoBackup}
                      onChange={(e) => handleSystemSettingChange('autoBackup', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="p-4 rounded-lg border border-border">
                    <h4 className="font-medium mb-2">فرکانس گزارش‌گیری</h4>
                    <Select value={systemSettings.reportFrequency} onValueChange={(value) => handleSystemSettingChange('reportFrequency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">ساعتی</SelectItem>
                        <SelectItem value="daily">روزانه</SelectItem>
                        <SelectItem value="weekly">هفتگی</SelectItem>
                        <SelectItem value="monthly">ماهانه</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 rounded-lg border border-border">
                    <h4 className="font-medium mb-2">آستانه هشدار</h4>
                    <Select value={systemSettings.alertThreshold} onValueChange={(value) => handleSystemSettingChange('alertThreshold', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">کم</SelectItem>
                        <SelectItem value="medium">متوسط</SelectItem>
                        <SelectItem value="high">بالا</SelectItem>
                        <SelectItem value="critical">بحرانی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">تنظیمات اعلانات</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <h4 className="font-medium">اعلانات خودکار</h4>
                      <p className="text-sm text-muted-foreground">دریافت اعلانات برای رویدادهای مهم</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={systemSettings.autoNotifications}
                      onChange={(e) => handleSystemSettingChange('autoNotifications', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <h4 className="font-medium">گزارش‌های ایمیلی</h4>
                      <p className="text-sm text-muted-foreground">ارسال گزارش‌های دوره‌ای به ایمیل</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={systemSettings.emailReports}
                      onChange={(e) => handleSystemSettingChange('emailReports', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">انواع اعلانات:</h4>
                    {[
                      { id: 'incidents', label: 'حوادث جدید', enabled: true },
                      { id: 'permits', label: 'مجوزهای منقضی شده', enabled: true },
                      { id: 'training', label: 'یادآوری آموزش‌ها', enabled: false },
                      { id: 'maintenance', label: 'تعمیرات دوره‌ای', enabled: true }
                    ].map((notification) => (
                      <div key={notification.id} className="flex items-center justify-between p-3 rounded border border-border">
                        <span className="text-sm">{notification.label}</span>
                        <input
                          type="checkbox"
                          defaultChecked={notification.enabled}
                          className="w-4 h-4"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">تنظیمات امنیتی</h3>
                
                {/* User Management */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">مدیریت کاربران</h4>
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.role} - {user.department}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${user.active ? 'bg-hse-success/10 text-hse-success' : 'bg-muted text-muted-foreground'}`}>
                            {user.active ? 'فعال' : 'غیرفعال'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserStatusToggle(user.id)}
                            className={user.active ? 'text-hse-danger' : 'text-hse-success'}
                          >
                            {user.active ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Policies */}
                <div>
                  <h4 className="font-medium mb-3">خط‌مشی‌های امنیتی</h4>
                  <div className="space-y-3">
                    {[
                      { policy: 'قفل خودکار پس از عدم فعالیت', value: '30 دقیقه', enabled: true },
                      { policy: 'تعداد تلاش‌های ورود', value: '3 بار', enabled: true },
                      { policy: 'پیچیدگی رمز عبور', value: 'بالا', enabled: true },
                      { policy: 'تغییر اجباری رمز عبور', value: '90 روز', enabled: false }
                    ].map((policy, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded border border-border">
                        <div>
                          <p className="text-sm font-medium">{policy.policy}</p>
                          <p className="text-xs text-muted-foreground">{policy.value}</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked={policy.enabled}
                          className="w-4 h-4"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HSEManagementPanel;
