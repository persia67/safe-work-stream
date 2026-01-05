import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, FileText, Activity, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DashboardContentProps {
  incidents: any[];
  trainings: any[];
  ergonomicAssessments: any[];
  workPermits: any[];
  healthExaminations: any[];
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  incidents, 
  trainings, 
  ergonomicAssessments, 
  workPermits, 
  healthExaminations 
}) => {
  // Calculate real stats from data
  const activePermits = workPermits.filter(p => p.status === 'تایید شده' || p.status === 'در انتظار تایید').length;
  const totalParticipants = trainings.reduce((sum, t) => sum + (t.attendance_count || 0), 0);

  const statsData = [
    { name: 'حوادث ثبت شده', value: incidents.length, icon: AlertTriangle, color: 'hse-danger' },
    { name: 'مجوزهای کار', value: workPermits.length, icon: FileText, color: 'hse-info' },
    { name: 'ارزیابی‌های ارگونومی', value: ergonomicAssessments.length, icon: Activity, color: 'hse-warning' },
    { name: 'شرکت‌کنندگان آموزش', value: totalParticipants, icon: Users, color: 'hse-success' }
  ];

  // Process incident data for monthly trend chart
  const incidentTrendData = (() => {
    const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    const monthCounts: Record<string, number> = {};
    
    incidents.forEach(incident => {
      if (incident.date) {
        const date = new Date(incident.date);
        const monthIndex = date.getMonth();
        const monthName = months[monthIndex];
        monthCounts[monthName] = (monthCounts[monthName] || 0) + 1;
      }
    });

    // Return last 6 months with data or zeros
    return months.slice(0, 6).map(month => ({
      month,
      incidents: monthCounts[month] || 0
    }));
  })();

  // Process incident types for bar chart
  const incidentTypeData = (() => {
    const typeCounts: Record<string, number> = {};
    incidents.forEach(incident => {
      const type = incident.type || 'نامشخص';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    return Object.entries(typeCounts).map(([type, count]) => ({ type, count }));
  })();

  // Get recent activities from real data
  const recentActivities = [
    ...incidents.slice(0, 2).map(i => ({
      type: 'incident',
      title: `${i.type} در ${i.location}`,
      time: i.date,
      status: 'danger'
    })),
    ...workPermits.slice(0, 2).map(p => ({
      type: 'permit',
      title: `${p.type} - ${p.status}`,
      time: p.date,
      status: p.status === 'تایید شده' ? 'success' : 'warning'
    })),
    ...trainings.slice(0, 2).map(t => ({
      type: 'training',
      title: t.training_title,
      time: t.training_date,
      status: 'info'
    }))
  ].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-${stat.color}/10 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              روند حوادث ماهانه
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {incidentTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={incidentTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="incidents" stroke="hsl(var(--hse-danger))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  داده‌ای برای نمایش وجود ندارد
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              انواع حوادث
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {incidentTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incidentTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  داده‌ای برای نمایش وجود ندارد
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>فعالیت‌های اخیر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className={`w-2 h-2 rounded-full bg-hse-${activity.status}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                فعالیتی ثبت نشده است
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;
