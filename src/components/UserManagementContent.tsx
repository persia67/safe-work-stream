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

type AppRole = Database['public']['Enums']['app_role'];

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  department: string | null;
  active: boolean | null;
  role?: AppRole;
}

export default function UserManagementContent() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  
  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteDepartment, setInviteDepartment] = useState('');
  const [inviteRole, setInviteRole] = useState<AppRole>('viewer');
  const [inviteLoading, setInviteLoading] = useState(false);

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
    inviteUser: { fa: 'دعوت کاربر جدید', en: 'Invite New User' },
    email: { fa: 'ایمیل', en: 'Email' },
    password: { fa: 'رمز عبور', en: 'Password' },
    name: { fa: 'نام', en: 'Name' },
    department: { fa: 'بخش', en: 'Department' },
    role: { fa: 'نقش', en: 'Role' },
    actions: { fa: 'عملیات', en: 'Actions' },
    active: { fa: 'فعال', en: 'Active' },
    inactive: { fa: 'غیرفعال', en: 'Inactive' },
    invite: { fa: 'دعوت', en: 'Invite' },
    cancel: { fa: 'انصراف', en: 'Cancel' },
    edit: { fa: 'ویرایش', en: 'Edit' },
    delete: { fa: 'حذف', en: 'Delete' },
    save: { fa: 'ذخیره', en: 'Save' },
    editUser: { fa: 'ویرایش کاربر', en: 'Edit User' },
    inviteSuccess: { fa: 'کاربر با موفقیت دعوت شد', en: 'User invited successfully' },
    updateSuccess: { fa: 'کاربر با موفقیت به‌روزرسانی شد', en: 'User updated successfully' },
    deleteSuccess: { fa: 'کاربر با موفقیت حذف شد', en: 'User deleted successfully' },
    error: { fa: 'خطا در عملیات', en: 'Operation failed' },
  };

  const t = (key: keyof typeof translations) => translations[key][language];

  useEffect(() => {
    fetchUsers();
  }, []);

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

      // Merge profiles with roles
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        role: userRoles?.find(r => r.user_id === profile.user_id)?.role || 'viewer' as AppRole
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

  const handleInviteUser = async () => {
    if (!inviteEmail || !invitePassword || !inviteName) {
      toast({
        title: t('error'),
        description: language === 'fa' ? 'لطفاً تمام فیلدهای الزامی را پر کنید' : 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setInviteLoading(true);

      // Create user via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: inviteEmail,
        password: invitePassword,
        options: {
          data: {
            name: inviteName,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Update profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({
            name: inviteName,
            department: inviteDepartment || null,
          })
          .eq('user_id', authData.user.id);

        if (profileError) throw profileError;

        // Delete default viewer role
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', authData.user.id);

        // Assign selected role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: inviteRole,
          });

        if (roleError) throw roleError;

        toast({
          title: t('inviteSuccess'),
        });

        setInviteDialogOpen(false);
        setInviteEmail('');
        setInvitePassword('');
        setInviteName('');
        setInviteDepartment('');
        setInviteRole('viewer');
        fetchUsers();
      }
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setInviteLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          name: selectedUser.name,
          department: selectedUser.department,
          active: selectedUser.active,
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
          role: selectedUser.role || 'viewer',
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
              {t('inviteUser')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('inviteUser')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="email">{t('email')} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">{t('password')} *</Label>
                <Input
                  id="password"
                  type="password"
                  value={invitePassword}
                  onChange={(e) => setInvitePassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="name">{t('name')} *</Label>
                <Input
                  id="name"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="department">{t('department')}</Label>
                <Input
                  id="department"
                  value={inviteDepartment}
                  onChange={(e) => setInviteDepartment(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="role">{t('role')} *</Label>
                <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as AppRole)}>
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
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button onClick={handleInviteUser} disabled={inviteLoading}>
                  {inviteLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {t('invite')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('email')}</TableHead>
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
