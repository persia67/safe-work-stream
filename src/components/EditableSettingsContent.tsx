import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Mail, Building, Save, Settings, Shield, Bell, Clock } from 'lucide-react';
import { formatPersianDate } from '@/lib/dateUtils';

interface EditableSettingsContentProps {
  currentUser: any;
}

const EditableSettingsContent: React.FC<EditableSettingsContentProps> = ({ 
  currentUser
}) => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    incidentAlerts: true,
    reportReminders: true
  });
  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    sessionTimeout: '30',
    language: 'fa',
    theme: 'system'
  });
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (currentUser) {
      fetchUserProfile();
    }
  }, [currentUser]);

  const fetchUserProfile = async () => {
    try {
      // Use the current user data directly for mock implementation
      if (currentUser) {
        setProfileData({
          name: currentUser.name || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
          department: currentUser.department || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async () => {
    if (!currentUser?.id) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          department: profileData.department,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', currentUser.id);

      if (error) throw error;

      toast({
        title: t('settings.success'),
        description: t('settings.profileUpdated')
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'خطا',
        description: 'امکان بروزرسانی پروفایل وجود ندارد',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSessionSettings = async () => {
    // Update session storage or backend configuration
    localStorage.setItem('hse_notifications', JSON.stringify(notifications));
    localStorage.setItem('hse_system_settings', JSON.stringify(systemSettings));
    
    toast({
      title: t('settings.success'),
      description: t('settings.settingsUpdated')
    });
  };

  // Session management - extended timeout for better user experience
  useEffect(() => {
    // Set longer session timeout based on user preference
    const sessionTimeout = parseInt(systemSettings.sessionTimeout) * 60 * 1000; // Convert to milliseconds
    
    // Store session info in localStorage to prevent quick logouts
    const lastActivity = Date.now();
    localStorage.setItem('hse_last_activity', lastActivity.toString());
    localStorage.setItem('hse_session_timeout', sessionTimeout.toString());
    
    // Update activity timestamp on user interactions
    const updateActivity = () => {
      localStorage.setItem('hse_last_activity', Date.now().toString());
    };
    
    // Add event listeners for user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [systemSettings.sessionTimeout]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-primary">{t('settings.title')}</h1>
          <p className="text-muted-foreground">{t('settings.profile')} & {t('settings.system')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {t('settings.profile')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">{t('settings.name')}</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                placeholder={t('settings.name')}
              />
            </div>
            
            <div>
              <Label htmlFor="email">{t('settings.email')}</Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  placeholder="example@company.com"
                  className="pr-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone">{t('settings.phone')}</Label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  placeholder="09123456789"
                  className="pr-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="department">{t('settings.department')}</Label>
              <div className="relative">
                <Building className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Select
                  value={profileData.department}
                  onValueChange={(value) => setProfileData({...profileData, department: value})}
                >
                  <SelectTrigger className="pr-10">
                    <SelectValue placeholder="انتخاب بخش" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="خط تولید A">خط تولید A</SelectItem>
                    <SelectItem value="خط تولید B">خط تولید B</SelectItem>
                    <SelectItem value="انبار">انبار</SelectItem>
                    <SelectItem value="نگهداری">نگهداری</SelectItem>
                    <SelectItem value="کنترل کیفیت">کنترل کیفیت</SelectItem>
                    <SelectItem value="HSE">HSE</SelectItem>
                    <SelectItem value="اداری">اداری</SelectItem>
                    <SelectItem value="مدیریت">مدیریت</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={updateProfile} 
              disabled={loading}
              className="w-full gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? t('settings.saving') : t('settings.saveChanges')}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              {t('settings.notifications')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>اعلانات ایمیل</Label>
                <p className="text-sm text-muted-foreground">دریافت اعلانات از طریق ایمیل</p>
              </div>
              <Switch
                checked={notifications.emailAlerts}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, emailAlerts: checked})
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>اعلانات فوری</Label>
                <p className="text-sm text-muted-foreground">اعلانات فوری حوادث</p>
              </div>
              <Switch
                checked={notifications.incidentAlerts}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, incidentAlerts: checked})
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>یادآوری گزارشات</Label>
                <p className="text-sm text-muted-foreground">یادآوری ثبت گزارشات روزانه</p>
              </div>
              <Switch
                checked={notifications.reportReminders}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, reportReminders: checked})
                }
              />
            </div>

            <Button 
              onClick={updateSessionSettings}
              className="w-full gap-2"
            >
              <Save className="w-4 h-4" />
              {t('common.save')}
            </Button>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {t('settings.system')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>پشتیبان‌گیری خودکار</Label>
                <p className="text-sm text-muted-foreground">پشتیبان‌گیری روزانه از داده‌ها</p>
              </div>
              <Switch
                checked={systemSettings.autoBackup}
                onCheckedChange={(checked) => 
                  setSystemSettings({...systemSettings, autoBackup: checked})
                }
              />
            </div>

            <Separator />

            <div>
              <Label htmlFor="sessionTimeout">مدت زمان نشست (دقیقه)</Label>
              <Select
                value={systemSettings.sessionTimeout}
                onValueChange={(value) => 
                  setSystemSettings({...systemSettings, sessionTimeout: value})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 دقیقه</SelectItem>
                  <SelectItem value="30">30 دقیقه</SelectItem>
                  <SelectItem value="60">1 ساعت</SelectItem>
                  <SelectItem value="120">2 ساعت</SelectItem>
                  <SelectItem value="480">8 ساعت</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="language">زبان</Label>
              <Select
                value={systemSettings.language}
                onValueChange={(value) => 
                  setSystemSettings({...systemSettings, language: value})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fa">فارسی</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={updateSessionSettings}
              className="w-full gap-2"
            >
              <Save className="w-4 h-4" />
              {t('common.save')}
            </Button>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t('settings.account')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">وضعیت حساب:</span>
                <Badge variant="default">فعال</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">نقش کاربری:</span>
                <Badge variant="secondary">
                  {currentUser?.user_metadata?.role || 'safety_officer'}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">آخرین ورود:</span>
                <span className="text-sm text-muted-foreground">
                  {currentUser?.last_sign_in_at 
                    ? formatPersianDate(currentUser.last_sign_in_at)
                    : 'نامشخص'
                  }
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">تاریخ عضویت:</span>
                <span className="text-sm text-muted-foreground">
                  {currentUser?.created_at 
                    ? formatPersianDate(currentUser.created_at)
                    : 'نامشخص'
                  }
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="text-center text-sm text-muted-foreground">
                برای تغییر رمز عبور با مدیر سیستم تماس بگیرید
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditableSettingsContent;