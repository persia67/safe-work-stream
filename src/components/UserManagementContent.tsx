import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, UserPlus, Trash2, Edit } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';
import { z } from 'zod';

type AppRole = Database['public']['Enums']['app_role'];

// Input validation schema for user registration
const userRegisterSchema = z.object({
  email: z.string().trim().email('ایمیل نامعتبر است').max(255, 'ایمیل بیش از حد طولانی است'),
  password: z.string()
    .min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد')
    .max(100, 'رمز عبور بیش از حد طولانی است'),
  name: z.string().trim().min(2, 'نام باید حداقل ۲ کاراکتر باشد').max(100, 'نام بیش از حد طولانی است'),
  department: z.string().trim().max(100, 'نام بخش بیش از حد طولانی است').optional(),
  phone: z.string().trim().max(20, 'شماره تلفن بیش از حد طولانی است').optional(),
  role: z.enum(['developer', 'admin', 'senior_manager', 'supervisor', 'safety_officer', 'medical_officer', 'viewer'])
});

// Input validation schema for user updates
const userUpdateSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  department: z.string().trim().max(100, 'Department must be less than 100 characters').optional().nullable(),
  role: z.enum(['developer', 'admin', 'senior_manager', 'supervisor', 'safety_officer', 'medical_officer', 'viewer'])
});

interface Organization {
  id: string;
  name: string;
  code: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  department: string | null;
  active: boolean | null;
  role?: AppRole;
  organization_id: string | null;
  organization_name?: string;
}

export default function UserManagementContent() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  
  // Register form state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerDepartment, setRegisterDepartment] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerRole, setRegisterRole] = useState<AppRole>('viewer');
  const [registerOrganization, setRegisterOrganization] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  const roles: { value: AppRole; label: { fa: string; en: string } }[] = [
    { value: 'developer', label: { fa: 'توسعه‌دهنده', en: 'Developer' } },
    { value: 'admin', label: { fa: 'مدیر سیستم', en: 'Admin' } },
    { value: 'senior_manager', label: { fa: 'مدیر ارشد', en: 'Senior Manager' } },
    { value: 'supervisor', label: { fa: 'سرپرست', en: 'Supervisor' } },
    { value: 'safety_officer', label: { fa: 'مسئول ایمنی', en: 'Safety Officer' } },
    { value: 'medical_officer', label: { fa: 'مسئول پزشکی', en: 'Medical Officer' } },
    { value: 'viewer', label: { fa: 'بازدیدکننده', en: 'Viewer' } },
  ];

  const translations = {
    title: { fa: 'مدیریت کاربران', en: 'User Management' },
    registerUser: { fa: 'ثبت کاربر جدید', en: 'Register New User' },
    email: { fa: 'ایمیل (نام کاربری)', en: 'Email (Username)' },
    password: { fa: 'رمز عبور', en: 'Password' },
    name: { fa: 'نام و نام خانوادگی', en: 'Full Name' },
    department: { fa: 'بخش', en: 'Department' },
    phone: { fa: 'شماره تلفن', en: 'Phone' },
    role: { fa: 'نقش', en: 'Role' },
    organization: { fa: 'سازمان', en: 'Organization' },
    actions: { fa: 'عملیات', en: 'Actions' },
    active: { fa: 'فعال', en: 'Active' },
    inactive: { fa: 'غیرفعال', en: 'Inactive' },
    register: { fa: 'ثبت کاربر', en: 'Register' },
    cancel: { fa: 'انصراف', en: 'Cancel' },
    edit: { fa: 'ویرایش', en: 'Edit' },
    delete: { fa: 'حذف', en: 'Delete' },
    save: { fa: 'ذخیره', en: 'Save' },
    editUser: { fa: 'ویرایش کاربر', en: 'Edit User' },
    registerSuccess: { fa: 'کاربر با موفقیت ثبت شد', en: 'User registered successfully' },
    updateSuccess: { fa: 'کاربر با موفقیت به‌روزرسانی شد', en: 'User updated successfully' },
    deleteSuccess: { fa: 'کاربر با موفقیت حذف شد', en: 'User deleted successfully' },
    error: { fa: 'خطا در عملیات', en: 'Operation failed' },
    passwordHint: { fa: 'حداقل ۶ کاراکتر', en: 'At least 6 characters' },
    userCanLogin: { fa: 'کاربر می‌تواند با این ایمیل و رمز عبور وارد شود', en: 'User can login with this email and password' },
    selectOrganization: { fa: 'انتخاب سازمان', en: 'Select Organization' },
    noOrganization: { fa: 'بدون سازمان', en: 'No Organization' },
  };

  const t = (key: keyof typeof translations) => translations[key][language];

  useEffect(() => {
    fetchUsers();
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name, code')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error: any) {
      console.error('Error fetching organizations:', error.message);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch all user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Fetch organizations for mapping
      const { data: orgs } = await supabase
        .from('organizations')
        .select('id, name');

      const orgMap = new Map(orgs?.map(o => [o.id, o.name]) || []);

      // Merge profiles with roles and organization names
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        role: userRoles?.find(r => r.user_id === profile.user_id)?.role || 'viewer' as AppRole,
        organization_name: profile.organization_id ? orgMap.get(profile.organization_id) : undefined
      })) || [];

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterUser = async () => {
    // Validate input using Zod schema
    const validationResult = userRegisterSchema.safeParse({
      email: registerEmail,
      password: registerPassword,
      name: registerName,
      department: registerDepartment || undefined,
      phone: registerPhone || undefined,
      role: registerRole
    });

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0].message;
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive',
      });
      return;
    }

    try {
      setRegisterLoading(true);

      const validatedData = validationResult.data;

      // Get current session for authorization
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: t('error'),
          description: 'لطفا دوباره وارد شوید',
          variant: 'destructive',
        });
        return;
      }

      // Call Edge Function to create user with admin privileges
      const response = await fetch(
        `https://thaghdaioherrbiyjpnf.supabase.co/functions/v1/admin-create-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            email: validatedData.email,
            password: validatedData.password,
            name: validatedData.name,
            department: validatedData.department || null,
            phone: validatedData.phone || null,
            role: validatedData.role,
            organization_id: registerOrganization || null,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'خطا در ثبت کاربر');
      }

      toast({
        title: t('registerSuccess'),
        description: language === 'fa' 
          ? `کاربر ${validatedData.name} با موفقیت ثبت شد. اکنون می‌تواند با ایمیل و رمز عبور وارد شود.`
          : `User ${validatedData.name} registered successfully. They can now login with email and password.`,
      });

      setInviteDialogOpen(false);
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterName('');
      setRegisterDepartment('');
      setRegisterPhone('');
      setRegisterRole('viewer');
      setRegisterOrganization('');
      fetchUsers();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    // Validate input using Zod schema
    const validationResult = userUpdateSchema.safeParse({
      name: selectedUser.name,
      department: selectedUser.department,
      role: selectedUser.role || 'viewer'
    });

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0].message;
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive',
      });
      return;
    }

    try {
      const validatedData = validationResult.data;

      // Update profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          name: validatedData.name,
          department: validatedData.department,
          active: selectedUser.active,
          organization_id: selectedUser.organization_id,
        })
        .eq('user_id', selectedUser.user_id);

      if (profileError) throw profileError;

      // Delete existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', selectedUser.user_id);

      // Insert new role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: selectedUser.user_id,
          role: validatedData.role,
        });

      if (roleError) throw roleError;

      toast({
        title: t('updateSuccess'),
      });

      setEditDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(language === 'fa' ? 'آیا مطمئن هستید؟' : 'Are you sure?')) return;

    try {
      // Note: Deleting from auth.users requires service role key
      // For now, just deactivate the user
      const { error } = await supabase
        .from('user_profiles')
        .update({ active: false })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: t('deleteSuccess'),
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('title')}</h2>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              {t('registerUser')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('registerUser')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                {t('userCanLogin')}
              </div>
              <div>
                <Label htmlFor="email">{t('email')} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="user@example.com"
                  dir="ltr"
                />
              </div>
              <div>
                <Label htmlFor="password">{t('password')} *</Label>
                <Input
                  id="password"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  dir="ltr"
                />
                <p className="text-xs text-muted-foreground mt-1">{t('passwordHint')}</p>
              </div>
              <div>
                <Label htmlFor="name">{t('name')} *</Label>
                <Input
                  id="name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">{t('phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  placeholder="09123456789"
                  dir="ltr"
                />
              </div>
              <div>
                <Label htmlFor="department">{t('department')}</Label>
                <Select value={registerDepartment} onValueChange={setRegisterDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'fa' ? 'انتخاب بخش' : 'Select Department'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="خط قدیم">خط قدیم</SelectItem>
                    <SelectItem value="خط جدید">خط جدید</SelectItem>
                    <SelectItem value="نورد سرد">نورد سرد</SelectItem>
                    <SelectItem value="اسیدشویی">اسیدشویی</SelectItem>
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
                <Label htmlFor="role">{t('role')} *</Label>
                <Select value={registerRole} onValueChange={(value) => setRegisterRole(value as AppRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label[language]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="organization">{t('organization')}</Label>
                <Select value={registerOrganization} onValueChange={setRegisterOrganization}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectOrganization')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('noOrganization')}</SelectItem>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name} ({org.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button onClick={handleRegisterUser} disabled={registerLoading}>
                  {registerLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {t('register')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('email')}</TableHead>
              <TableHead>{t('organization')}</TableHead>
              <TableHead>{t('department')}</TableHead>
              <TableHead>{t('role')}</TableHead>
              <TableHead>{t('active')}</TableHead>
              <TableHead>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.organization_name || '-'}</TableCell>
                <TableCell>{user.department || '-'}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {roles.find(r => r.value === user.role)?.label[language]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.active ? 'default' : 'secondary'}>
                    {user.active ? t('active') : t('inactive')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.user_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('editUser')}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 mt-4">
              <div>
                <Label>{t('name')}</Label>
                <Input
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>
              <div>
                <Label>{t('department')}</Label>
                <Input
                  value={selectedUser.department || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, department: e.target.value })}
                />
              </div>
              <div>
                <Label>{t('organization')}</Label>
                <Select
                  value={selectedUser.organization_id || ''}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, organization_id: value || null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectOrganization')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('noOrganization')}</SelectItem>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name} ({org.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t('role')}</Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value as AppRole })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label[language]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={selectedUser.active || false}
                  onChange={(e) => setSelectedUser({ ...selectedUser, active: e.target.checked })}
                />
                <Label htmlFor="active">{t('active')}</Label>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button onClick={handleUpdateUser}>
                  {t('save')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
