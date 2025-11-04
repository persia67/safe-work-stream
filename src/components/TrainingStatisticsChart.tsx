import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Award, Activity } from 'lucide-react';

interface TrainingStats {
  trainings: any[];
}

export const TrainingStatisticsChart: React.FC<TrainingStats> = ({ trainings }) => {
  // آمار کلی
  const totalTrainings = trainings.length;
  const totalParticipants = trainings.reduce((sum, t) => sum + (t.attendance_count || 0), 0);
  const totalPassed = trainings.reduce((sum, t) => sum + (t.pass_count || 0), 0);
  const avgSuccessRate = totalParticipants > 0 
    ? Math.round((totalPassed / totalParticipants) * 100) 
    : 0;

  // آمار بر اساس نوع آموزش
  const trainingTypeStats = trainings.reduce((acc, t) => {
    const type = t.training_type || 'نامشخص';
    if (!acc[type]) {
      acc[type] = { name: type, count: 0, participants: 0, passed: 0 };
    }
    acc[type].count += 1;
    acc[type].participants += t.attendance_count || 0;
    acc[type].passed += t.pass_count || 0;
    return acc;
  }, {});

  const typeData = Object.values(trainingTypeStats);

  // آمار بر اساس بخش
  const departmentStats = trainings.reduce((acc, t) => {
    const dept = t.department || 'نامشخص';
    if (!acc[dept]) {
      acc[dept] = { name: dept, count: 0, participants: 0 };
    }
    acc[dept].count += 1;
    acc[dept].participants += t.attendance_count || 0;
    return acc;
  }, {});

  const deptData = Object.values(departmentStats).slice(0, 6);

  // آمار وضعیت آموزش‌ها
  const statusStats = trainings.reduce((acc, t) => {
    const status = t.status || 'نامشخص';
    if (!acc[status]) {
      acc[status] = 0;
    }
    acc[status] += 1;
    return acc;
  }, {});

  const statusData = Object.keys(statusStats).map(key => ({
    name: key,
    value: statusStats[key]
  }));

  // روند آموزش‌ها در طول زمان
  const monthlyTrend = trainings.reduce((acc, t) => {
    if (!t.training_date) return acc;
    const month = t.training_date.substring(0, 7);
    if (!acc[month]) {
      acc[month] = { month, count: 0, participants: 0 };
    }
    acc[month].count += 1;
    acc[month].participants += t.attendance_count || 0;
    return acc;
  }, {});

  const trendData = Object.values(monthlyTrend).sort((a: any, b: any) => 
    a.month.localeCompare(b.month)
  ).slice(-6);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* کارت‌های آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">کل آموزش‌ها</p>
                <p className="text-3xl font-bold text-primary">{totalTrainings}</p>
              </div>
              <Activity className="h-12 w-12 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">کل شرکت‌کنندگان</p>
                <p className="text-3xl font-bold text-blue-600">{totalParticipants}</p>
              </div>
              <Users className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">قبولی‌ها</p>
                <p className="text-3xl font-bold text-green-600">{totalPassed}</p>
              </div>
              <Award className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">نرخ موفقیت</p>
                <p className="text-3xl font-bold text-purple-600">{avgSuccessRate}%</p>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* نمودارها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* نمودار میله‌ای: آموزش‌ها بر اساس نوع */}
        <Card>
          <CardHeader>
            <CardTitle>آموزش‌ها بر اساس نوع</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  tick={{ fontSize: 11 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="تعداد دوره" />
                <Bar dataKey="participants" fill="#10b981" name="شرکت‌کنندگان" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* نمودار دایره‌ای: وضعیت آموزش‌ها */}
        <Card>
          <CardHeader>
            <CardTitle>وضعیت آموزش‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* نمودار میله‌ای: آموزش‌ها بر اساس بخش */}
        <Card>
          <CardHeader>
            <CardTitle>آموزش‌ها بر اساس بخش</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#f59e0b" name="تعداد دوره" />
                <Bar dataKey="participants" fill="#8b5cf6" name="شرکت‌کنندگان" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* نمودار خطی: روند آموزش‌ها */}
        <Card>
          <CardHeader>
            <CardTitle>روند آموزش‌ها در 6 ماه اخیر</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="تعداد دوره"
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="participants" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="شرکت‌کنندگان"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
