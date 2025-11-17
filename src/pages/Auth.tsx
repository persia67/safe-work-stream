import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { ThemeLanguageToggle } from '@/components/ThemeLanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

const authSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).max(255),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(100),
  name: z.string().trim().min(2).max(100).optional(),
});

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const t = {
    loginTitle: language === 'fa' ? 'ورود به سیستم HSE' : 'Login to HSE Management',
    signupTitle: language === 'fa' ? 'ایجاد حساب کاربری' : 'Create HSE Account',
    loginDesc: language === 'fa' ? 'اطلاعات خود را وارد کنید' : 'Enter your credentials to access the system',
    signupDesc: language === 'fa' ? 'برای شروع ثبت‌نام کنید' : 'Register for a new account to get started',
    fullName: language === 'fa' ? 'نام کامل' : 'Full Name',
    email: language === 'fa' ? 'ایمیل' : 'Email',
    password: language === 'fa' ? 'رمز عبور' : 'Password',
    loginBtn: language === 'fa' ? 'ورود' : 'Login',
    signupBtn: language === 'fa' ? 'ثبت‌نام' : 'Sign up',
    noAccount: language === 'fa' ? 'حساب کاربری ندارید؟ ثبت‌نام کنید' : "Don't have an account? Sign up",
    haveAccount: language === 'fa' ? 'حساب کاربری دارید؟ وارد شوید' : 'Already have an account? Login',
    welcomeBack: language === 'fa' ? 'خوش آمدید!' : 'Welcome back!',
    loginSuccess: language === 'fa' ? 'با موفقیت وارد شدید' : 'Successfully logged in',
    accountCreated: language === 'fa' ? 'حساب ایجاد شد' : 'Account Created',
    checkEmail: language === 'fa' ? 'لطفاً ایمیل خود را بررسی کنید' : 'Please check your email to confirm your account.',
    authFailed: language === 'fa' ? 'خطا در ورود' : 'Authentication Failed',
    invalidCreds: language === 'fa' ? 'ایمیل یا رمز عبور نادرست' : 'Invalid email or password',
    regFailed: language === 'fa' ? 'خطا در ثبت‌نام' : 'Registration Failed',
    emailExists: language === 'fa' ? 'این ایمیل قبلاً ثبت شده است' : 'This email is already registered. Please login instead.',
    error: language === 'fa' ? 'خطا' : 'Error',
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });
  }, [navigate]);

  const validateForm = () => {
    try {
      const dataToValidate = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;
      authSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: t.authFailed,
              description: t.invalidCreds,
              variant: 'destructive',
            });
          } else {
            throw error;
          }
          return;
        }

        if (data.session) {
          toast({
            title: t.welcomeBack,
            description: t.loginSuccess,
          });
          navigate('/');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name: formData.name?.trim() || formData.email.split('@')[0],
            }
          }
        });

        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: t.regFailed,
              description: t.emailExists,
              variant: 'destructive',
            });
          } else {
            throw error;
          }
          return;
        }

        if (data.user) {
          toast({
            title: t.accountCreated,
            description: t.checkEmail,
          });
          setIsLogin(true);
          setFormData({ email: '', password: '', name: '' });
        }
      }
    } catch (error: any) {
      toast({
        title: t.error,
        description: error.message || (language === 'fa' ? 'خطای غیرمنتظره' : 'An unexpected error occurred'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeLanguageToggle />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {isLogin ? t.loginTitle : t.signupTitle}
          </CardTitle>
          <CardDescription>
            {isLogin ? t.loginDesc : t.signupDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">{t.fullName}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={language === 'fa' ? 'نام و نام خانوادگی' : 'John Doe'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder={language === 'fa' ? 'name@company.com' : 'name@company.com'}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
                className={errors.email ? 'border-destructive' : ''}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
                className={errors.password ? 'border-destructive' : ''}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === 'fa' ? 'لطفاً صبر کنید...' : 'Please wait...'}
                </>
              ) : (
                <>{isLogin ? t.loginBtn : t.signupBtn}</>
              )}
            </Button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setFormData({ email: '', password: '', name: '' });
                }}
                className="text-primary hover:underline"
                disabled={loading}
              >
                {isLogin ? t.noAccount : t.haveAccount}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
