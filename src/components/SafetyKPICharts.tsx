import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadialBarChart, RadialBar, Legend } from 'recharts';
import { Activity, TrendingDown, AlertOctagon, Gauge } from 'lucide-react';

interface KPIProps {
  incidents: any[];
  /** total worked man-hours in the reporting period (default: 12 months * 200 employees * 176h) */
  totalManHours?: number;
}

/**
 * Safety KPI charts:
 *  - FSI  (Frequency Severity Index) = sqrt((FR * SR)/1000)
 *  - LTIFR (Lost Time Injury Frequency Rate) = (LTI * 1,000,000) / manhours
 *  - TRIR  (Total Recordable Incident Rate)  = (TR  * 200,000)   / manhours
 *  - SR    (Severity Rate) = (lostDays * 1,000,000) / manhours
 *  - Near-miss ratio
 */
export const SafetyKPICharts: React.FC<KPIProps> = ({ incidents, totalManHours }) => {
  const manhours = totalManHours ?? 200 * 176 * 12; // default assumption

  const { fsi, ltifr, trir, sr, nearMissRatio, monthly, byDept } = useMemo(() => {
    const isLTI = (i: any) => Number(i.lost_days ?? i.lostDays ?? 0) > 0;
    const isRecordable = (i: any) => {
      const sev = String(i.severity ?? '').toLowerCase();
      return sev.includes('serious') || sev.includes('lost') || sev.includes('medical') ||
             sev.includes('جدی') || sev.includes('شدید') || sev.includes('متوسط') || isLTI(i);
    };
    const isNearMiss = (i: any) => {
      const t = String(i.type ?? '').toLowerCase();
      return t.includes('near') || t.includes('شبه');
    };

    const lti = incidents.filter(isLTI).length;
    const recordable = incidents.filter(isRecordable).length;
    const nearMiss = incidents.filter(isNearMiss).length;
    const lostDays = incidents.reduce((s, i) => s + Number(i.lost_days ?? i.lostDays ?? 0), 0);

    const ltifrV = manhours > 0 ? (lti * 1_000_000) / manhours : 0;
    const trirV  = manhours > 0 ? (recordable * 200_000) / manhours : 0;
    const srV    = manhours > 0 ? (lostDays * 1_000_000) / manhours : 0;
    const frV    = manhours > 0 ? (recordable * 1_000_000) / manhours : 0;
    const fsiV   = Math.sqrt((frV * srV) / 1000);
    const nmRatio = incidents.length > 0 ? (nearMiss / incidents.length) * 100 : 0;

    // Monthly trend (last 12 months)
    const now = new Date();
    const buckets: { month: string; incidents: number; recordable: number; lti: number }[] = [];
    for (let k = 11; k >= 0; k--) {
      const d = new Date(now.getFullYear(), now.getMonth() - k, 1);
      buckets.push({
        month: d.toLocaleDateString('fa-IR', { month: 'short' }),
        incidents: 0, recordable: 0, lti: 0,
      });
    }
    incidents.forEach((i) => {
      const raw = i.date || i.incident_date;
      if (!raw) return;
      const d = new Date(raw);
      if (isNaN(d.getTime())) return;
      const diffMonths = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      if (diffMonths < 0 || diffMonths > 11) return;
      const idx = 11 - diffMonths;
      buckets[idx].incidents += 1;
      if (isRecordable(i)) buckets[idx].recordable += 1;
      if (isLTI(i)) buckets[idx].lti += 1;
    });

    // By department
    const depMap: Record<string, number> = {};
    incidents.forEach((i) => {
      const dep = i.department || i.location || 'نامشخص';
      depMap[dep] = (depMap[dep] || 0) + 1;
    });
    const byDept = Object.entries(depMap).map(([department, count]) => ({ department, count }));

    return {
      fsi: Number(fsiV.toFixed(2)),
      ltifr: Number(ltifrV.toFixed(2)),
      trir: Number(trirV.toFixed(2)),
      sr: Number(srV.toFixed(2)),
      nearMissRatio: Number(nmRatio.toFixed(1)),
      monthly: buckets,
      byDept,
    };
  }, [incidents, manhours]);

  const kpiCards = [
    { name: 'FSI', value: fsi, icon: Gauge, color: 'hse-danger', help: 'شاخص فرکانس-شدت' },
    { name: 'LTIFR', value: ltifr, icon: AlertOctagon, color: 'hse-warning', help: 'ضریب حوادث منجر به از دست دادن زمان' },
    { name: 'TRIR', value: trir, icon: Activity, color: 'hse-info', help: 'ضریب کل حوادث ثبت‌شده' },
    { name: 'SR', value: sr, icon: TrendingDown, color: 'hse-success', help: 'ضریب شدت (روزهای از دست‌رفته)' },
    { name: 'Near-Miss %', value: nearMissRatio, icon: Gauge, color: 'primary', help: 'نسبت شبه‌حوادث' },
  ];

  const gaugeData = kpiCards.map((k, idx) => ({
    name: k.name,
    value: Math.min(k.value, 100),
    fill: `hsl(var(--${k.color}))`,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpiCards.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.name} className="shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{k.name}</p>
                    <p className="text-2xl font-bold">{k.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{k.help}</p>
                  </div>
                  <Icon className={`w-8 h-8 text-${k.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader><CardTitle>روند ۱۲ ماه اخیر</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="incidents" name="کل" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="recordable" name="ثبت‌شده" stroke="hsl(var(--hse-warning))" strokeWidth={2} />
                  <Line type="monotone" dataKey="lti" name="LTI" stroke="hsl(var(--hse-danger))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader><CardTitle>مقایسه شاخص‌ها (Radial)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="20%" outerRadius="90%" data={gaugeData} startAngle={180} endAngle={0}>
                  <RadialBar background dataKey="value" />
                  <Tooltip />
                  <Legend />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {byDept.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader><CardTitle>حوادث به تفکیک دپارتمان</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byDept}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SafetyKPICharts;
