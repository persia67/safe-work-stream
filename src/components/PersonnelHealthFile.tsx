// Simplified personnel health file.
// - One "file" (base record) per employee: chronic conditions, allergies, work restrictions.
// - Many "events" per employee: illness / near-miss health / periodic check / leave.
// No occupational-medicine physician workflow — this is data entry for downstream modules
// (Risk Assessment, Work Permits, Training) to consume.

import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeartPulse, UserPlus, Plus, AlertTriangle, Activity, Ban } from 'lucide-react';

type Restriction = 'none' | 'height' | 'confined_space' | 'lifting' | 'noise' | 'chemicals' | 'shift_night';
const RESTRICTION_LABELS: Record<Restriction, string> = {
  none: 'بدون محدودیت',
  height: 'کار در ارتفاع',
  confined_space: 'فضای بسته',
  lifting: 'بلند کردن بار',
  noise: 'محیط پرصدا',
  chemicals: 'مواد شیمیایی',
  shift_night: 'شیفت شب',
};

interface HealthFile {
  id: string;
  employee_id: string;
  employee_name: string;
  department?: string;
  national_code?: string;
  chronic_conditions?: string;
  allergies?: string;
  base_restrictions?: Restriction[];
  notes?: string;
}

type EventType = 'illness' | 'injury' | 'periodic_check' | 'sick_leave' | 'return_to_work';
const EVENT_LABELS: Record<EventType, string> = {
  illness: 'بیماری',
  injury: 'حادثه سلامتی',
  periodic_check: 'معاینه دوره‌ای',
  sick_leave: 'مرخصی استعلاجی',
  return_to_work: 'بازگشت به کار',
};

interface HealthEvent {
  id: string;
  file_id: string;
  employee_id: string;
  event_date: string;
  type: EventType;
  severity: 'low' | 'medium' | 'high';
  temporary_restrictions?: Restriction[];
  restriction_until?: string; // ISO date; empty = ongoing
  notes?: string;
  created_at?: string;
}

/** Helpers exported for other modules (risk, permits, training) to consume. */
export async function getActiveRestrictions(employeeId: string): Promise<Restriction[]> {
  const { data: files } = await supabase.from('personnel_health_files').select('*').eq('employee_id', employeeId);
  const base = ((files?.[0] as any)?.base_restrictions ?? []) as Restriction[];
  const { data: events } = await supabase.from('personnel_health_events').select('*').eq('employee_id', employeeId);
  const today = new Date().toISOString().slice(0, 10);
  const active = ((events ?? []) as HealthEvent[])
    .filter((e) => e.temporary_restrictions && e.temporary_restrictions.length > 0)
    .filter((e) => !e.restriction_until || e.restriction_until >= today)
    .flatMap((e) => e.temporary_restrictions || []);
  return Array.from(new Set([...base, ...active])).filter((r) => r !== 'none');
}

const PersonnelHealthFile: React.FC = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<HealthFile[]>([]);
  const [events, setEvents] = useState<HealthEvent[]>([]);
  const [selected, setSelected] = useState<HealthFile | null>(null);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);

  const [fileForm, setFileForm] = useState<HealthFile>({
    id: '', employee_id: '', employee_name: '', department: '',
    national_code: '', chronic_conditions: '', allergies: '', base_restrictions: [], notes: '',
  });
  const [eventForm, setEventForm] = useState<HealthEvent>({
    id: '', file_id: '', employee_id: '',
    event_date: new Date().toISOString().slice(0, 10),
    type: 'illness', severity: 'low',
    temporary_restrictions: [], restriction_until: '', notes: '',
  });

  const load = async () => {
    const [{ data: f }, { data: e }] = await Promise.all([
      supabase.from('personnel_health_files').select('*'),
      supabase.from('personnel_health_events').select('*'),
    ]);
    setFiles((f ?? []) as any);
    setEvents((e ?? []) as any);
  };
  useEffect(() => { load(); }, []);

  const saveFile = async () => {
    if (!fileForm.employee_id || !fileForm.employee_name) {
      toast({ title: 'خطا', description: 'کد و نام پرسنل الزامی است', variant: 'destructive' });
      return;
    }
    if (fileForm.id) {
      await supabase.from('personnel_health_files').update(fileForm).eq('id', fileForm.id);
    } else {
      await supabase.from('personnel_health_files').insert({ ...fileForm });
    }
    toast({ title: 'ذخیره شد' });
    setFileDialogOpen(false);
    setFileForm({ id: '', employee_id: '', employee_name: '', department: '', national_code: '', chronic_conditions: '', allergies: '', base_restrictions: [], notes: '' });
    load();
  };

  const openNewEvent = (f: HealthFile) => {
    setEventForm({
      id: '', file_id: f.id, employee_id: f.employee_id,
      event_date: new Date().toISOString().slice(0, 10),
      type: 'illness', severity: 'low', temporary_restrictions: [], restriction_until: '', notes: '',
    });
    setSelected(f);
    setEventDialogOpen(true);
  };

  const saveEvent = async () => {
    await supabase.from('personnel_health_events').insert({ ...eventForm });
    toast({ title: 'رویداد ثبت شد' });
    setEventDialogOpen(false);
    load();
  };

  const eventsByFile = useMemo(() => {
    const map: Record<string, HealthEvent[]> = {};
    events.forEach((e) => { (map[e.file_id] ??= []).push(e); });
    return map;
  }, [events]);

  const toggleRestriction = (arr: Restriction[] | undefined, r: Restriction): Restriction[] => {
    const a = arr ?? [];
    return a.includes(r) ? a.filter((x) => x !== r) : [...a, r];
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><HeartPulse className="w-5 h-5" /> پرونده سلامت پرسنل</CardTitle>
            <CardDescription>ثبت پرونده پایه و رویدادهای سلامتی. نتایج به ماژول‌های ارزیابی ریسک و مجوز کار متصل می‌شود.</CardDescription>
          </div>
          <Dialog open={fileDialogOpen} onOpenChange={setFileDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setFileForm({ id: '', employee_id: '', employee_name: '', department: '', national_code: '', chronic_conditions: '', allergies: '', base_restrictions: [], notes: '' })}>
                <UserPlus className="w-4 h-4 mr-2" /> پرونده جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{fileForm.id ? 'ویرایش' : 'ایجاد'} پرونده سلامت</DialogTitle></DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><Label>کد پرسنلی *</Label><Input value={fileForm.employee_id} onChange={(e) => setFileForm({ ...fileForm, employee_id: e.target.value })} /></div>
                <div><Label>نام و نام خانوادگی *</Label><Input value={fileForm.employee_name} onChange={(e) => setFileForm({ ...fileForm, employee_name: e.target.value })} /></div>
                <div><Label>کد ملی</Label><Input value={fileForm.national_code} onChange={(e) => setFileForm({ ...fileForm, national_code: e.target.value })} /></div>
                <div><Label>واحد/دپارتمان</Label><Input value={fileForm.department} onChange={(e) => setFileForm({ ...fileForm, department: e.target.value })} /></div>
                <div className="md:col-span-2"><Label>بیماری‌های مزمن</Label><Textarea value={fileForm.chronic_conditions} onChange={(e) => setFileForm({ ...fileForm, chronic_conditions: e.target.value })} /></div>
                <div className="md:col-span-2"><Label>حساسیت‌ها</Label><Textarea value={fileForm.allergies} onChange={(e) => setFileForm({ ...fileForm, allergies: e.target.value })} /></div>
                <div className="md:col-span-2">
                  <Label>محدودیت‌های شغلی پایه</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(Object.keys(RESTRICTION_LABELS) as Restriction[]).map((r) => {
                      const on = (fileForm.base_restrictions ?? []).includes(r);
                      return (
                        <Badge key={r} variant={on ? 'default' : 'outline'} className="cursor-pointer"
                          onClick={() => setFileForm({ ...fileForm, base_restrictions: toggleRestriction(fileForm.base_restrictions, r) })}>
                          {RESTRICTION_LABELS[r]}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <div className="md:col-span-2"><Label>یادداشت</Label><Textarea value={fileForm.notes} onChange={(e) => setFileForm({ ...fileForm, notes: e.target.value })} /></div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setFileDialogOpen(false)}>انصراف</Button>
                <Button onClick={saveFile}>ذخیره</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>کد</TableHead>
                <TableHead>نام</TableHead>
                <TableHead>واحد</TableHead>
                <TableHead>محدودیت‌های فعال</TableHead>
                <TableHead>رویدادها</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((f) => {
                const evts = eventsByFile[f.id] || [];
                const today = new Date().toISOString().slice(0, 10);
                const activeTemp = evts
                  .filter((e) => e.temporary_restrictions?.length && (!e.restriction_until || e.restriction_until >= today))
                  .flatMap((e) => e.temporary_restrictions || []);
                const activeAll = Array.from(new Set([...(f.base_restrictions ?? []), ...activeTemp])).filter((r) => r !== 'none');
                return (
                  <TableRow key={f.id}>
                    <TableCell>{f.employee_id}</TableCell>
                    <TableCell>{f.employee_name}</TableCell>
                    <TableCell>{f.department || '—'}</TableCell>
                    <TableCell>
                      {activeAll.length === 0 ? <span className="text-muted-foreground text-xs">—</span> :
                        <div className="flex flex-wrap gap-1">
                          {activeAll.map((r) => (
                            <Badge key={r} variant="destructive" className="text-[10px]"><Ban className="w-3 h-3 mr-1" />{RESTRICTION_LABELS[r]}</Badge>
                          ))}
                        </div>}
                    </TableCell>
                    <TableCell>{evts.length}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setFileForm(f); setFileDialogOpen(true); }}>ویرایش</Button>
                      <Button size="sm" onClick={() => openNewEvent(f)}><Plus className="w-3 h-3 mr-1" /> رویداد</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {files.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">هیچ پرونده‌ای ثبت نشده است</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>ثبت رویداد سلامتی — {selected?.employee_name}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>نوع رویداد</Label>
              <Select value={eventForm.type} onValueChange={(v) => setEventForm({ ...eventForm, type: v as EventType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(EVENT_LABELS) as EventType[]).map((t) => (
                    <SelectItem key={t} value={t}>{EVENT_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>شدت</Label>
              <Select value={eventForm.severity} onValueChange={(v) => setEventForm({ ...eventForm, severity: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">کم</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="high">بالا</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>محدودیت موقت</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(Object.keys(RESTRICTION_LABELS) as Restriction[]).map((r) => {
                  const on = (eventForm.temporary_restrictions ?? []).includes(r);
                  return (
                    <Badge key={r} variant={on ? 'default' : 'outline'} className="cursor-pointer"
                      onClick={() => setEventForm({ ...eventForm, temporary_restrictions: toggleRestriction(eventForm.temporary_restrictions, r) })}>
                      {RESTRICTION_LABELS[r]}
                    </Badge>
                  );
                })}
              </div>
            </div>
            <div>
              <Label>تا تاریخ (اختیاری — خالی = ادامه‌دار)</Label>
              <Input type="date" value={eventForm.restriction_until} onChange={(e) => setEventForm({ ...eventForm, restriction_until: e.target.value })} />
            </div>
            <div className="md:col-span-2"><Label>یادداشت</Label><Textarea value={eventForm.notes} onChange={(e) => setEventForm({ ...eventForm, notes: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setEventDialogOpen(false)}>انصراف</Button>
            <Button onClick={saveEvent}>ثبت رویداد</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonnelHealthFile;
