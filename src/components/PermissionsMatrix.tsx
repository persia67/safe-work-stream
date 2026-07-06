import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield } from 'lucide-react';
import {
  ALL_MODULES, ALL_ACTIONS, ALL_ROLES, getMatrix, setPermissions,
  type AppRole, type ModuleKey, type Action,
} from '@/lib/permissions';

const ACTION_LABELS: Record<Action, string> = {
  view: 'مشاهده', create: 'ایجاد', edit: 'ویرایش', delete: 'حذف', approve: 'تأیید',
};

const ROLE_LABELS: Record<AppRole, string> = {
  developer: 'توسعه‌دهنده',
  admin: 'مدیر سیستم',
  senior_manager: 'مدیر ارشد',
  supervisor: 'سرپرست',
  safety_officer: 'مسئول ایمنی',
  medical_officer: 'مسئول پزشکی',
  viewer: 'بازدیدکننده',
};

interface Props {
  /** Effective current role — must be `developer` for edit; otherwise the matrix is read-only. */
  currentRole: AppRole | string | null | undefined;
}

const PermissionsMatrix: React.FC<Props> = ({ currentRole }) => {
  const [matrix, setMatrix] = useState<Record<AppRole, Record<ModuleKey, Action[]>> | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const editable = currentRole === 'developer';

  useEffect(() => { getMatrix().then(setMatrix); }, []);

  const toggle = (role: AppRole, mod: ModuleKey, action: Action) => {
    if (!editable || !matrix) return;
    const current = matrix[role][mod];
    const next = current.includes(action) ? current.filter((a) => a !== action) : [...current, action];
    setMatrix({ ...matrix, [role]: { ...matrix[role], [mod]: next } });
    setDirty(true);
  };

  const save = async () => {
    if (!matrix) return;
    setSaving(true);
    try {
      for (const role of ALL_ROLES) {
        for (const { key } of ALL_MODULES) {
          await setPermissions(role, key, matrix[role][key]);
        }
      }
      toast({ title: 'ذخیره شد', description: 'ماتریس دسترسی به‌روز شد. کاربران پس از ورود مجدد اعمال می‌شوند.' });
      setDirty(false);
    } catch (e: any) {
      toast({ title: 'خطا', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (!matrix) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" /> ماتریس دسترسی نقش‌ها</CardTitle>
          <CardDescription>
            {editable
              ? 'به عنوان توسعه‌دهنده می‌توانید دسترسی هر نقش را در هر ماژول تنظیم کنید.'
              : 'فقط نقش توسعه‌دهنده می‌تواند این ماتریس را ویرایش کند. نمای فعلی خواندنی است.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 text-right sticky right-0 bg-muted">ماژول</th>
                  {ALL_ROLES.map((r) => (
                    <th key={r} className="p-2 text-center border-r min-w-[110px]">{ROLE_LABELS[r]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_MODULES.map(({ key, label }) => (
                  <tr key={key} className="border-b">
                    <td className="p-2 font-medium sticky right-0 bg-background">{label}</td>
                    {ALL_ROLES.map((r) => (
                      <td key={r} className="p-1 border-r">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {ALL_ACTIONS.map((a) => {
                            const checked = matrix[r][key].includes(a);
                            return (
                              <label key={a} className={`flex items-center gap-1 px-1 py-0.5 rounded text-[10px] ${checked ? 'bg-primary/10' : ''} ${editable ? 'cursor-pointer' : 'cursor-default'}`}>
                                <Checkbox
                                  checked={checked}
                                  disabled={!editable}
                                  onCheckedChange={() => toggle(r, key, a)}
                                />
                                <span>{ACTION_LABELS[a]}</span>
                              </label>
                            );
                          })}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {editable && (
            <div className="mt-4 flex justify-end">
              <Button onClick={save} disabled={!dirty || saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                ذخیره تغییرات
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsMatrix;
