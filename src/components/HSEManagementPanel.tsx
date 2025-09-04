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
              <CardDescription className="text-base mt-2">گوره صنعتی دانیال استیل</CardDescription>
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
        {/* Sidebar */}
        <div className="w-64 bg-card border-l border-border h-screen fixed right-0 top-0 shadow-medium">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-primary">HSE Management</h1>
                <p className="text-xs text-muted-foreground">گوره صنعتی دانیال استیل</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {getMenuItems().map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-right transition-colors ${
                    activeTab === item.id
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start gap-3"
            >
              <LogOut className="w-4 h-4" />
              خروج از سیستم
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 mr-64">
          {/* Header Bar */}
          <div className="bg-card border-b border-border p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-primary">
                  {getMenuItems().find(item => item.id === activeTab)?.label || 'داشبورد'}
                </h2>
                <Badge variant="outline" className="text-xs">
                  نسخه 2.0
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {new Date().toLocaleDateString('fa-IR')}
                </div>
                <Button size="sm" variant="outline">
                  <Bell className="w-4 h-4" />
                  اعلانات
                </Button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
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
              <RiskAssessmentContent 
                assessments={riskAssessments}
                openModal={openModal}
                handleDelete={handleDelete}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
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

          {/* Other modal types content... */}
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

export default HSEManagementPanel;
