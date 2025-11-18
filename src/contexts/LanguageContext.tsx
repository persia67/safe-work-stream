import React, { createContext, useContext, useState } from 'react';

type Language = 'fa' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  fa: {
    // Navigation - کلیدهای اصلی برای منو
    'dashboard': 'داشبورد اصلی',
    'incidents': 'مدیریت حوادث',
    'ergonomics': 'ارزیابی ارگونومی',
    'permits': 'مجوزهای کار',
    'reports': 'گزارش‌های روزانه',
    'risk': 'ارزیابی ریسک',
    'health_examinations': 'معاینات طب کار',
    'safety_training': 'آموزش‌های ایمنی',
    'analytics': 'تحلیل و آمار',
    'ai_insights': 'تحلیل هوش مصنوعی',
    'settings': 'تنظیمات',
    'user_management': 'مدیریت کاربران',
    // Navigation - کلیدهای با پیشوند nav (برای سازگاری)
    'nav.dashboard': 'داشبورد اصلی',
    'nav.incidents': 'مدیریت حوادث',
    'nav.ergonomics': 'ارزیابی ارگونومی',
    'nav.permits': 'مجوزهای کار',
    'nav.reports': 'گزارش‌های روزانه',
    'nav.risk': 'ارزیابی ریسک',
    'nav.health': 'معاینات طب کار',
    'nav.training': 'آموزش‌های ایمنی',
    'nav.analytics': 'تحلیل و آمار',
    'nav.ai': 'تحلیل هوش مصنوعی',
    'nav.settings': 'تنظیمات',
    
    // Common
    'common.add': 'افزودن',
    'common.edit': 'ویرایش',
    'common.delete': 'حذف',
    'common.save': 'ذخیره',
    'common.cancel': 'انصراف',
    'common.search': 'جستجو',
    'common.filter': 'فیلتر',
    'common.export': 'خروجی',
    'common.import': 'ورودی',
    'common.view': 'مشاهده',
    'common.status': 'وضعیت',
    'common.date': 'تاریخ',
    'common.time': 'زمان',
    'common.description': 'توضیحات',
    'common.logout': 'خروج',
    'common.notifications': 'اعلانات',
    'common.loading': 'در حال بارگذاری',
    'common.noData': 'داده‌ای موجود نیست',
    'common.actions': 'عملیات',
    'common.close': 'بستن',
    'common.submit': 'ارسال',
    'common.reset': 'بازنشانی',
    'common.welcome': 'خوش آمدید',
    
    // Login
    'login.title': 'سیستم مدیریت HSE',
    'login.username': 'نام کاربری',
    'login.password': 'رمز عبور',
    'login.button': 'ورود به سیستم',
    'login.welcome': 'خوش آمدید',
    'login.testAccounts': 'حساب‌های آزمایشی',
    'login.error': 'نام کاربری یا رمز عبور اشتباه است',
    
    // Dashboard
    'dashboard.title': 'داشبورد اصلی',
    'dashboard.totalIncidents': 'کل حوادث',
    'dashboard.openPermits': 'مجوزهای فعال',
    'dashboard.riskAssessments': 'ارزیابی‌های ریسک',
    'dashboard.trainingSessions': 'جلسات آموزشی',
    'dashboard.overview': 'نمای کلی',
    'dashboard.recentActivity': 'فعالیت‌های اخیر',
    
    // Ergonomics
    'ergo.title': 'ارزیابی ارگونومی',
    'ergo.employee': 'نام کارمند',
    'ergo.department': 'بخش',
    'ergo.position': 'سمت',
    'ergo.type': 'نوع ارزیابی',
    'ergo.riskLevel': 'سطح ریسک',
    'ergo.score': 'امتیاز',
    'ergo.recommendations': 'توصیه‌ها',
    'ergo.assessment': 'ارزیابی',
    'ergo.workstation': 'ایستگاه کار',
    'ergo.addNew': 'افزودن ارزیابی جدید',
    'ergo.assessor': 'ارزیاب',
    'ergo.shiftDuration': 'مدت شیفت',
    'ergo.followUpDate': 'تاریخ پیگیری',
    
    // Risk Levels
    'risk.low': 'کم',
    'risk.medium': 'متوسط',
    'risk.high': 'بالا',
    'risk.critical': 'بحرانی',
    
    // Incidents
    'incident.title': 'مدیریت حوادث',
    'incident.type': 'نوع حادثه',
    'incident.location': 'محل وقوع',
    'incident.severity': 'شدت',
    'incident.reporter': 'گزارش دهنده',
    'incident.addNew': 'ثبت حادثه جدید',
    
    // Permits
    'permit.title': 'مجوزهای کار',
    'permit.number': 'شماره مجوز',
    'permit.type': 'نوع مجوز',
    'permit.requester': 'درخواست کننده',
    'permit.validUntil': 'معتبر تا',
    'permit.addNew': 'صدور مجوز جدید',
    
    // Settings
    'settings.title': 'تنظیمات',
    'settings.profile': 'اطلاعات پروفایل',
    'settings.notifications': 'تنظیمات اعلانات',
    'settings.system': 'تنظیمات سیستم',
    'settings.account': 'اطلاعات حساب',
    'settings.name': 'نام و نام خانوادگی',
    'settings.email': 'ایمیل',
    'settings.phone': 'شماره تماس',
    'settings.department': 'بخش',
    'settings.saveChanges': 'ذخیره تغییرات',
    'settings.saving': 'در حال ذخیره...',
    'settings.success': 'موفقیت',
    'settings.profileUpdated': 'اطلاعات پروفایل به‌روزرسانی شد',
    'settings.settingsUpdated': 'تنظیمات به‌روزرسانی شد',
    
    // Roles
    'role.developer': 'توسعه دهنده',
    'role.admin': 'مدیر سیستم',
    'role.senior_manager': 'مدیر ارشد',
    'role.supervisor': 'سرپرست',
    'role.safety_officer': 'افسر ایمنی',
    'role.medical_officer': 'افسر پزشکی',
    'role.viewer': 'بازدیدکننده',
  },
  en: {
    // Navigation - Main keys for menu
    'dashboard': 'Main Dashboard',
    'incidents': 'Incident Management',
    'ergonomics': 'Ergonomic Assessment',
    'permits': 'Work Permits',
    'reports': 'Daily Reports',
    'risk': 'Risk Assessment',
    'health_examinations': 'Medical Examinations',
    'safety_training': 'Safety Training',
    'analytics': 'Analytics',
    'ai_insights': 'AI Insights',
    'settings': 'Settings',
    'user_management': 'User Management',
    // Navigation - Keys with nav prefix (for compatibility)
    'nav.dashboard': 'Main Dashboard',
    'nav.incidents': 'Incident Management',
    'nav.ergonomics': 'Ergonomic Assessment',
    'nav.permits': 'Work Permits',
    'nav.reports': 'Daily Reports',
    'nav.risk': 'Risk Assessment',
    'nav.health': 'Medical Examinations',
    'nav.training': 'Safety Training',
    'nav.analytics': 'Analytics',
    'nav.ai': 'AI Insights',
    'nav.settings': 'Settings',
    
    // Common
    'common.add': 'Add',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.view': 'View',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.time': 'Time',
    'common.description': 'Description',
    'common.logout': 'Logout',
    'common.notifications': 'Notifications',
    'common.loading': 'Loading',
    'common.noData': 'No Data Available',
    'common.actions': 'Actions',
    'common.close': 'Close',
    'common.submit': 'Submit',
    'common.reset': 'Reset',
    'common.welcome': 'Welcome',
    
    // Login
    'login.title': 'HSE Management System',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.button': 'Login',
    'login.welcome': 'Welcome',
    'login.testAccounts': 'Test Accounts',
    'login.error': 'Invalid username or password',
    
    // Dashboard
    'dashboard.title': 'Main Dashboard',
    'dashboard.totalIncidents': 'Total Incidents',
    'dashboard.openPermits': 'Open Permits',
    'dashboard.riskAssessments': 'Risk Assessments',
    'dashboard.trainingSessions': 'Training Sessions',
    'dashboard.overview': 'Overview',
    'dashboard.recentActivity': 'Recent Activity',
    
    // Ergonomics
    'ergo.title': 'Ergonomic Assessment',
    'ergo.employee': 'Employee Name',
    'ergo.department': 'Department',
    'ergo.position': 'Position',
    'ergo.type': 'Assessment Type',
    'ergo.riskLevel': 'Risk Level',
    'ergo.score': 'Score',
    'ergo.recommendations': 'Recommendations',
    'ergo.assessment': 'Assessment',
    'ergo.workstation': 'Workstation',
    'ergo.addNew': 'Add New Assessment',
    'ergo.assessor': 'Assessor',
    'ergo.shiftDuration': 'Shift Duration',
    'ergo.followUpDate': 'Follow-up Date',
    
    // Risk Levels
    'risk.low': 'Low',
    'risk.medium': 'Medium',
    'risk.high': 'High',
    'risk.critical': 'Critical',
    
    // Incidents
    'incident.title': 'Incident Management',
    'incident.type': 'Incident Type',
    'incident.location': 'Location',
    'incident.severity': 'Severity',
    'incident.reporter': 'Reporter',
    'incident.addNew': 'Report New Incident',
    
    // Permits
    'permit.title': 'Work Permits',
    'permit.number': 'Permit Number',
    'permit.type': 'Permit Type',
    'permit.requester': 'Requester',
    'permit.validUntil': 'Valid Until',
    'permit.addNew': 'Issue New Permit',
    
    // Settings
    'settings.title': 'Settings',
    'settings.profile': 'Profile Information',
    'settings.notifications': 'Notification Settings',
    'settings.system': 'System Settings',
    'settings.account': 'Account Information',
    'settings.name': 'Full Name',
    'settings.email': 'Email',
    'settings.phone': 'Phone Number',
    'settings.department': 'Department',
    'settings.saveChanges': 'Save Changes',
    'settings.saving': 'Saving...',
    'settings.success': 'Success',
    'settings.profileUpdated': 'Profile information updated',
    'settings.settingsUpdated': 'Settings updated',
    
    // Roles
    'role.developer': 'Developer',
    'role.admin': 'Administrator',
    'role.senior_manager': 'Senior Manager',
    'role.supervisor': 'Supervisor',
    'role.safety_officer': 'Safety Officer',
    'role.medical_officer': 'Medical Officer',
    'role.viewer': 'Viewer',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('hse-language');
    return (saved as Language) || 'fa';
  });

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === 'fa' ? 'en' : 'fa';
      localStorage.setItem('hse-language', newLang);
      document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLang;
      return newLang;
    });
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
