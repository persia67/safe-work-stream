import { useState, useEffect } from 'react';
import { Building2, Plus, Edit, Trash2, Search, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface Organization {
  id: string;
  name: string;
  code: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const OrganizationManagementContent = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    active: true
  });
  const [saving, setSaving] = useState(false);

  // Fetch organizations
  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error: any) {
      console.error('Error fetching organizations:', error);
      toast({
        title: t('common.error') || 'خطا',
        description: error.message || 'خطا در دریافت سازمان‌ها',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Filter organizations based on search
  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open dialog for new organization
  const handleAddNew = () => {
    setEditingOrg(null);
    setFormData({ name: '', code: '', active: true });
    setIsDialogOpen(true);
  };

  // Open dialog for editing
  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setFormData({
      name: org.name,
      code: org.code,
      active: org.active
    });
    setIsDialogOpen(true);
  };

  // Save organization (create or update)
  const handleSave = async () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      toast({
        title: 'خطا',
        description: 'لطفاً نام و کد سازمان را وارد کنید',
        variant: 'destructive'
      });
      return;
    }

    // Validate code format (alphanumeric only)
    if (!/^[A-Za-z0-9_-]+$/.test(formData.code)) {
      toast({
        title: 'خطا',
        description: 'کد سازمان فقط می‌تواند شامل حروف انگلیسی، اعداد، خط تیره و زیرخط باشد',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      if (editingOrg) {
        // Update existing
        const { error } = await supabase
          .from('organizations')
          .update({
            name: formData.name.trim(),
            code: formData.code.trim().toUpperCase(),
            active: formData.active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingOrg.id);

        if (error) throw error;

        toast({
          title: 'موفقیت',
          description: 'سازمان با موفقیت به‌روزرسانی شد'
        });
      } else {
        // Create new
        const { error } = await supabase
          .from('organizations')
          .insert({
            name: formData.name.trim(),
            code: formData.code.trim().toUpperCase(),
            active: formData.active
          });

        if (error) throw error;

        toast({
          title: 'موفقیت',
          description: 'سازمان جدید با موفقیت ایجاد شد'
        });
      }

      setIsDialogOpen(false);
      fetchOrganizations();
    } catch (error: any) {
      console.error('Error saving organization:', error);
      toast({
        title: 'خطا',
        description: error.message || 'خطا در ذخیره سازمان',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete organization
  const handleDelete = async (org: Organization) => {
    try {
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', org.id);

      if (error) throw error;

      toast({
        title: 'موفقیت',
        description: 'سازمان با موفقیت حذف شد'
      });
      fetchOrganizations();
    } catch (error: any) {
      console.error('Error deleting organization:', error);
      toast({
        title: 'خطا',
        description: error.message || 'خطا در حذف سازمان',
        variant: 'destructive'
      });
    }
  };

  // Toggle organization status
  const handleToggleStatus = async (org: Organization) => {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({ 
          active: !org.active,
          updated_at: new Date().toISOString()
        })
        .eq('id', org.id);

      if (error) throw error;

      toast({
        title: 'موفقیت',
        description: `سازمان ${org.active ? 'غیرفعال' : 'فعال'} شد`
      });
      fetchOrganizations();
    } catch (error: any) {
      console.error('Error toggling status:', error);
      toast({
        title: 'خطا',
        description: error.message || 'خطا در تغییر وضعیت',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
            <Building2 className="w-8 h-8" />
            {t('organization_management') || 'مدیریت سازمان‌ها'}
          </h2>
          <p className="text-muted-foreground">
            {t('organization_management_desc') || 'مدیریت و پیکربندی سازمان‌های مختلف سیستم'}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="bg-gradient-primary">
              <Plus className="w-4 h-4 ml-2" />
              {t('org.add_new') || 'افزودن سازمان'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingOrg ? (t('org.edit') || 'ویرایش سازمان') : (t('org.add_new') || 'افزودن سازمان جدید')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">{t('org.name') || 'نام سازمان'}</Label>
                <Input
                  id="org-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="نام سازمان را وارد کنید"
                  className="text-right"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-code">{t('org.code') || 'کد سازمان'}</Label>
                <Input
                  id="org-code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="مثال: COMP01"
                  className="text-left font-mono"
                  dir="ltr"
                />
                <p className="text-xs text-muted-foreground">
                  کد سازمان باید یکتا باشد و فقط شامل حروف انگلیسی و اعداد باشد
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="org-active">{t('org.active_status') || 'وضعیت فعال'}</Label>
                <Switch
                  id="org-active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('common.cancel') || 'انصراف'}
              </Button>
              <Button onClick={handleSave} disabled={saving} className="bg-gradient-primary">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    {t('common.saving') || 'در حال ذخیره...'}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 ml-2" />
                    {t('common.save') || 'ذخیره'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('org.search_placeholder') || 'جستجو بر اساس نام یا کد سازمان...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Organizations Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            {t('org.list') || 'لیست سازمان‌ها'}
            <Badge variant="secondary" className="mr-2">
              {filteredOrganizations.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrganizations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>{t('org.no_data') || 'سازمانی یافت نشد'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">{t('org.name') || 'نام سازمان'}</TableHead>
                    <TableHead className="text-center">{t('org.code') || 'کد'}</TableHead>
                    <TableHead className="text-center">{t('common.status') || 'وضعیت'}</TableHead>
                    <TableHead className="text-center">{t('common.created_at') || 'تاریخ ایجاد'}</TableHead>
                    <TableHead className="text-center">{t('common.actions') || 'عملیات'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrganizations.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell className="font-medium">{org.name}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono">
                          {org.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          className={org.active 
                            ? 'bg-hse-success/10 text-hse-success' 
                            : 'bg-muted text-muted-foreground'
                          }
                        >
                          {org.active ? (t('org.active') || 'فعال') : (t('org.inactive') || 'غیرفعال')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {new Date(org.created_at).toLocaleDateString('fa-IR')}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(org)}
                            title={org.active ? 'غیرفعال کردن' : 'فعال کردن'}
                          >
                            {org.active ? (
                              <X className="w-4 h-4 text-hse-warning" />
                            ) : (
                              <Check className="w-4 h-4 text-hse-success" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(org)}
                            title="ویرایش"
                          >
                            <Edit className="w-4 h-4 text-primary" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" title="حذف">
                                <Trash2 className="w-4 h-4 text-hse-danger" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>تأیید حذف سازمان</AlertDialogTitle>
                                <AlertDialogDescription>
                                  آیا از حذف سازمان "{org.name}" اطمینان دارید؟ این عمل قابل بازگشت نیست.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="gap-2">
                                <AlertDialogCancel>{t('common.cancel') || 'انصراف'}</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(org)}
                                  className="bg-hse-danger hover:bg-hse-danger/90"
                                >
                                  {t('common.delete') || 'حذف'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationManagementContent;
