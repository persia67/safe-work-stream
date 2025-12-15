import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, Loader2, Mail, Phone, ArrowRight } from 'lucide-react';
import { z } from 'zod';
import { ThemeLanguageToggle } from '@/components/ThemeLanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const authSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).max(255),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(100),
  name: z.string().trim().min(2).max(100).optional(),
});

const phoneSchema = z.object({
  phone: z.string().regex(/^(\+98|0)?9\d{9}$/, { message: 'شماره موبایل معتبر نیست' }),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'کد تایید باید ۶ رقم باشد' }),
});

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'verify-otp';
type AuthMethod = 'email' | 'phone';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    otp: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const t = {
    loginTitle: language === 'fa' ? 'ورود به سیستم HSE' : 'Login to HSE Management',
    signupTitle: language === 'fa' ? 'ایجاد حساب کاربری' : 'Create HSE Account',
    forgotTitle: language === 'fa' ? 'بازیابی رمز عبور' : 'Reset Password',
    verifyTitle: language === 'fa' ? 'تایید شماره موبایل' : 'Verify Phone Number',
    loginDesc: language === 'fa' ? 'اطلاعات خود را وارد کنید' : 'Enter your credentials to access the system',
    signupDesc: language === 'fa' ? 'برای شروع ثبت‌نام کنید' : 'Register for a new account to get started',
    forgotDesc: language === 'fa' ? 'ایمیل خود را وارد کنید' : 'Enter your email to reset password',
    verifyDesc: language === 'fa' ? 'کد ارسال شده را وارد کنید' : 'Enter the verification code',
    fullName: language === 'fa' ? 'نام کامل' : 'Full Name',
    email: language === 'fa' ? 'ایمیل' : 'Email',
    password: language === 'fa' ? 'رمز عبور' : 'Password',
    phone: language === 'fa' ? 'شماره موبایل' : 'Phone Number',
    otp: language === 'fa' ? 'کد تایید' : 'Verification Code',
    loginBtn: language === 'fa' ? 'ورود' : 'Login',
    signupBtn: language === 'fa' ? 'ثبت‌نام' : 'Sign up',
    sendCode: language === 'fa' ? 'ارسال کد تایید' : 'Send Code',
    verifyBtn: language === 'fa' ? 'تایید و ورود' : 'Verify & Login',
    sendResetLink: language === 'fa' ? 'ارسال لینک بازیابی' : 'Send Reset Link',
    noAccount: language === 'fa' ? 'حساب کاربری ندارید؟ ثبت‌نام کنید' : "Don't have an account? Sign up",
    haveAccount: language === 'fa' ? 'حساب کاربری دارید؟ وارد شوید' : 'Already have an account? Login',
    forgotPassword: language === 'fa' ? 'رمز عبور را فراموش کرده‌اید؟' : 'Forgot password?',
    backToLogin: language === 'fa' ? 'بازگشت به ورود' : 'Back to login',
    resendCode: language === 'fa' ? 'ارسال مجدد کد' : 'Resend code',
    welcomeBack: language === 'fa' ? 'خوش آمدید!' : 'Welcome back!',
    loginSuccess: language === 'fa' ? 'با موفقیت وارد شدید' : 'Successfully logged in',
    accountCreated: language === 'fa' ? 'حساب ایجاد شد' : 'Account Created',
    checkEmail: language === 'fa' ? 'لطفاً ایمیل خود را بررسی کنید' : 'Please check your email to confirm your account.',
    resetEmailSent: language === 'fa' ? 'لینک بازیابی به ایمیل شما ارسال شد' : 'Reset link sent to your email',
    codeSent: language === 'fa' ? 'کد تایید ارسال شد' : 'Verification code sent',
    authFailed: language === 'fa' ? 'خطا در ورود' : 'Authentication Failed',
    invalidCreds: language === 'fa' ? 'ایمیل یا رمز عبور نادرست' : 'Invalid email or password',
    regFailed: language === 'fa' ? 'خطا در ثبت‌نام' : 'Registration Failed',
    emailExists: language === 'fa' ? 'این ایمیل قبلاً ثبت شده است' : 'This email is already registered. Please login instead.',
    error: language === 'fa' ? 'خطا' : 'Error',
    phoneDisabled: language === 'fa' ? 'ورود با موبایل غیرفعال است' : 'Phone login is disabled',
    invalidCode: language === 'fa' ? 'کد تایید اشتباه است' : 'Invalid verification code',
    codeExpired: language === 'fa' ? 'کد منقضی شده است' : 'Code has expired',
    emailTab: language === 'fa' ? 'ایمیل' : 'Email',
    phoneTab: language === 'fa' ? 'موبایل' : 'Phone',
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const formatPhoneNumber = (phoneNumber: string): string => {
    let formatted = phoneNumber.replace(/\s/g, '');
    if (formatted.startsWith('0')) {
      formatted = '+98' + formatted.substring(1);
    } else if (!formatted.startsWith('+')) {
      formatted = '+98' + formatted;
    }
    return formatted;
  };

  const validateEmailForm = () => {
    try {
      const dataToValidate = authMode === 'login' 
        ? { email: formData.email, password: formData.password }
        : authMode === 'forgot-password'
        ? { email: formData.email, password: '123456' } // dummy password for validation
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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmailForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (authMode === 'login') {
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
      } else if (authMode === 'signup') {
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
          setAuthMode('login');
          setFormData({ ...formData, email: '', password: '', name: '' });
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailValidation = z.string().email().safeParse(formData.email);
    if (!emailValidation.success) {
      setErrors({ email: language === 'fa' ? 'ایمیل معتبر نیست' : 'Invalid email' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email.trim(), {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });

      if (error) throw error;

      setResetEmailSent(true);
      toast({
        title: language === 'fa' ? 'ایمیل ارسال شد' : 'Email Sent',
        description: t.resetEmailSent,
      });
    } catch (error: any) {
      toast({
        title: t.error,
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = phoneSchema.safeParse({ phone: formData.phone });
    if (!validation.success) {
      setErrors({ phone: validation.error.errors[0]?.message || '' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const formattedPhone = formatPhoneNumber(formData.phone);

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      setAuthMode('verify-otp');
      toast({
        title: t.codeSent,
        description: language === 'fa' ? 'کد به شماره شما ارسال شد' : 'Code sent to your phone',
      });
    } catch (error: any) {
      let message = error.message;
      if (error.message.includes('Phone signups are disabled')) {
        message = t.phoneDisabled;
      }
      toast({
        title: t.error,
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = otpSchema.safeParse({ otp: formData.otp });
    if (!validation.success) {
      setErrors({ otp: validation.error.errors[0]?.message || '' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const formattedPhone = formatPhoneNumber(formData.phone);

      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: formData.otp,
        type: 'sms',
      });

      if (error) throw error;

      toast({
        title: t.welcomeBack,
        description: t.loginSuccess,
      });
    } catch (error: any) {
      let message = error.message;
      if (error.message.includes('expired') || error.message.includes('otp_expired')) {
        message = t.codeExpired;
      } else if (error.message.includes('Invalid')) {
        message = t.invalidCode;
      }
      toast({
        title: t.error,
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };


  const getTitle = () => {
    switch (authMode) {
      case 'forgot-password': return t.forgotTitle;
      case 'verify-otp': return t.verifyTitle;
      case 'signup': return t.signupTitle;
      default: return t.loginTitle;
    }
  };

  const getDescription = () => {
    switch (authMode) {
      case 'forgot-password': return t.forgotDesc;
      case 'verify-otp': return t.verifyDesc;
      case 'signup': return t.signupDesc;
      default: return t.loginDesc;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4" dir={language === 'fa' ? 'rtl' : 'ltr'}>
      <div className="absolute top-4 left-4">
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
            {getTitle()}
          </CardTitle>
          <CardDescription>
            {getDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Forgot Password */}
          {authMode === 'forgot-password' && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAuthMode('login');
                  setResetEmailSent(false);
                }}
                className="mb-4 gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                {t.backToLogin}
              </Button>

              {resetEmailSent ? (
                <div className="text-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <Mail className="h-12 w-12 mx-auto text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {t.resetEmailSent}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setAuthMode('login');
                      setResetEmailSent(false);
                    }}
                  >
                    {t.backToLogin}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">{t.email}</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={loading}
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.sendResetLink}
                  </Button>
                </form>
              )}
            </>
          )}

          {/* Verify OTP */}
          {authMode === 'verify-otp' && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAuthMode('login');
                  setFormData({ ...formData, otp: '' });
                }}
                className="mb-4 gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                {t.backToLogin}
              </Button>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">{t.otp}</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
                    disabled={loading}
                    className={`text-center text-2xl tracking-widest ${errors.otp ? 'border-destructive' : ''}`}
                    dir="ltr"
                  />
                  {errors.otp && <p className="text-sm text-destructive">{errors.otp}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.verifyBtn}
                </Button>
                <Button 
                  type="button" 
                  variant="link" 
                  className="w-full"
                  onClick={handlePhoneAuth}
                  disabled={loading}
                >
                  {t.resendCode}
                </Button>
              </form>
            </>
          )}

          {/* Login / Signup */}
          {(authMode === 'login' || authMode === 'signup') && (
            <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as AuthMethod)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t.emailTab}
                </TabsTrigger>
                <TabsTrigger value="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {t.phoneTab}
                </TabsTrigger>
              </TabsList>

              {/* Email Auth */}
              <TabsContent value="email">
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  {authMode === 'signup' && (
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
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">{t.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={loading}
                      className={errors.email ? 'border-destructive' : ''}
                      autoComplete="email"
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
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
                      autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                    />
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>

                  {authMode === 'login' && (
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-sm"
                      onClick={() => setAuthMode('forgot-password')}
                    >
                      {t.forgotPassword}
                    </Button>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {language === 'fa' ? 'لطفاً صبر کنید...' : 'Please wait...'}
                      </>
                    ) : (
                      <>{authMode === 'login' ? t.loginBtn : t.signupBtn}</>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Phone Auth */}
              <TabsContent value="phone">
                <form onSubmit={handlePhoneAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t.phone}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="09123456789"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={loading}
                      className={`text-left ${errors.phone ? 'border-destructive' : ''}`}
                      dir="ltr"
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {language === 'fa' 
                      ? 'کد تایید به این شماره ارسال خواهد شد'
                      : 'A verification code will be sent to this number'}
                  </p>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {language === 'fa' ? 'لطفاً صبر کنید...' : 'Please wait...'}
                      </>
                    ) : (
                      t.sendCode
                    )}
                  </Button>
                </form>
              </TabsContent>

              <div className="mt-4 text-center text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'signup' : 'login');
                    setErrors({});
                  }}
                  className="text-primary hover:underline"
                  disabled={loading}
                >
                  {authMode === 'login' ? t.noAccount : t.haveAccount}
                </button>
              </div>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
