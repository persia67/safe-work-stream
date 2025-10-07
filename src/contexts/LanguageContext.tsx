import React, { createContext, useContext, useState } from 'react';

type Language = 'fa' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  fa: {
    // Navigation
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
    
    // Login
    'login.title': 'سیستم مدیریت HSE',
    'login.username': 'نام کاربری',
    'login.password': 'رمز عبور',
    'login.button': 'ورود به سیستم',
    'login.welcome': 'خوش آمدید',
    'login.testAccounts': 'حساب‌های آزمایشی',
    
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
    
    // Risk Levels
    'risk.low': 'کم',
    'risk.medium': 'متوسط',
    'risk.high': 'بالا',
    'risk.critical': 'بحرانی',
    
    // Incidents
    'incident.type': 'نوع حادثه',
    'incident.location': 'محل وقوع',
    'incident.severity': 'شدت',
    'incident.reporter': 'گزارش دهنده',
    
    // Permits
    'permit.number': 'شماره مجوز',
    'permit.type': 'نوع مجوز',
    'permit.requester': 'درخواست کننده',
    'permit.validUntil': 'معتبر تا',
  },
  en: {
    // Navigation
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
    
    // Login
    'login.title': 'HSE Management System',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.button': 'Login',
    'login.welcome': 'Welcome',
    'login.testAccounts': 'Test Accounts',
    
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
    
    // Risk Levels
    'risk.low': 'Low',
    'risk.medium': 'Medium',
    'risk.high': 'High',
    'risk.critical': 'Critical',
    
    // Incidents
    'incident.type': 'Incident Type',
    'incident.location': 'Location',
    'incident.severity': 'Severity',
    'incident.reporter': 'Reporter',
    
    // Permits
    'permit.number': 'Permit Number',
    'permit.type': 'Permit Type',
    'permit.requester': 'Requester',
    'permit.validUntil': 'Valid Until',
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
