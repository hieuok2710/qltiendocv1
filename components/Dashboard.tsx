
import React, { useMemo, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { Task, TaskStatus } from '../types';
import { CheckCircle2, Clock, AlertCircle, FileBarChart, CalendarDays, Filter, Zap, Award } from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
}

const COLORS = {
  [TaskStatus.COMPLETED]: '#10B981', 
  [TaskStatus.IN_PROGRESS]: '#3B82F6', 
  [TaskStatus.PENDING]: '#9CA3AF',   
  [TaskStatus.OVERDUE]: '#EF4444',   
};

export const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const currentSystemDate = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(currentSystemDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>(currentSystemDate.getMonth());

  const years = useMemo(() => {
    const uniqueYears: number[] = Array.from(new Set(tasks.map(t => new Date(t.deadline).getFullYear())));
    if (!uniqueYears.includes(currentSystemDate.getFullYear())) uniqueYears.push(currentSystemDate.getFullYear());
    return uniqueYears.sort((a: number, b: number) => b - a);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const d = new Date(task.deadline);
      return d.getFullYear() === selectedYear && (selectedMonth === 'all' || d.getMonth() === selectedMonth);
    });
  }, [tasks, selectedYear, selectedMonth]);

  const stats = useMemo(() => {
    const total = filteredTasks.length;
    const completedTasks = filteredTasks.filter(t => t.status === TaskStatus.COMPLETED);
    const earlyTasks = completedTasks.filter(t => t.completedDate && new Date(t.completedDate).getTime() < new Date(t.deadline).getTime());
    const overdueTasks = filteredTasks.filter(t => t.status === TaskStatus.OVERDUE);

    // Tính toán %
    const calculatePercent = (count: number) => {
      if (total === 0) return 0;
      return parseFloat(((count / total) * 100).toFixed(1));
    };

    return {
      total,
      completed: completedTasks.length,
      completedPercent: calculatePercent(completedTasks.length),
      processing: filteredTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      overdue: overdueTasks.length,
      overduePercent: calculatePercent(overdueTasks.length),
      early: earlyTasks.length,
      earlyPercent: calculatePercent(earlyTasks.length),
      earlyList: earlyTasks.slice(0, 5)
    };
  }, [filteredTasks]);

  const statusData = useMemo(() => {
    const counts = filteredTasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.values(TaskStatus).map(status => ({
      name: status,
      value: counts[status] || 0
    })).filter(item => item.value > 0);
  }, [filteredTasks]);

  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col xl:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
                <Award size={24} />
            </div>
            <div>
               <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
                   Tổng quan tiến độ {selectedMonth === 'all' ? selectedYear : `${monthNames[selectedMonth]} ${selectedYear}`}
               </h2>
               <p className="text-sm text-slate-500 font-medium italic">Logic vượt tiến độ: Ngày hoàn thành thực tế &lt; Ngày thời hạn</p>
            </div>
         </div>
         
         <div className="flex flex-wrap items-center gap-3">
           <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
              <Filter size={18} className="text-indigo-500" />
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="bg-transparent text-sm font-bold text-slate-800 outline-none cursor-pointer">
                  <option value="all">Tất cả tháng</option>
                  {monthNames.map((name, i) => <option key={i} value={i}>{name}</option>)}
              </select>
           </div>
           <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
              <CalendarDays size={18} className="text-blue-600" />
              <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-transparent text-sm font-bold text-slate-800 outline-none cursor-pointer">
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
           </div>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-blue-500 flex items-center gap-4 hover:shadow-md transition-all">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><FileBarChart size={32} /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Tổng nhiệm vụ</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-emerald-500 flex items-center gap-4 hover:shadow-md transition-all relative">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><CheckCircle2 size={32} /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Đã hoàn thành</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-slate-800">{stats.completed}</h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                {stats.completedPercent}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-indigo-600 flex items-center gap-4 hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-indigo-100 group-hover:scale-110 transition-transform opacity-30"><Zap size={80} /></div>
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 z-10"><Zap size={32} /></div>
          <div className="z-10">
            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Vượt tiến độ</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-indigo-600">{stats.early}</h3>
              <span className="text-xs font-bold text-white bg-indigo-600 px-1.5 py-0.5 rounded shadow-sm">
                {stats.earlyPercent}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-red-500 flex items-center gap-4 hover:shadow-md transition-all">
          <div className={`p-3 rounded-xl text-red-600 ${stats.overdue > 0 ? 'bg-red-50 animate-pulse' : 'bg-slate-50'}`}><AlertCircle size={32} /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Quá hạn</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-red-600">{stats.overdue}</h3>
              {stats.overdue > 0 && (
                <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                  {stats.overduePercent}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[400px]">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider">
              <div className="w-1 h-4 bg-blue-600"></div>
              Cấu trúc trạng thái
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[entry.name as TaskStatus] || '#94a3b8'} stroke="none" />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[400px]">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-indigo-600"></div>
                Điểm sáng tiến độ (Mới nhất)
              </div>
              <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-black">XUẤT SẮC</span>
          </h3>
          <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {stats.earlyList.length > 0 ? (
              stats.earlyList.map((task, idx) => {
                const deadlineDate = new Date(task.deadline);
                const completeDate = new Date(task.completedDate!);
                const diffTime = Math.abs(deadlineDate.getTime() - completeDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {idx + 1}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-800 line-clamp-1">{task.content}</p>
                          <p className="text-[11px] text-slate-400 font-medium">Thời hạn: {deadlineDate.toLocaleDateString('vi-VN')}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="flex items-center gap-1 text-emerald-600 font-black text-xs">
                          <Zap size={12} fill="currentColor" /> SỚM {diffDays} NGÀY
                       </div>
                       <p className="text-[10px] text-slate-400">Xong: {completeDate.toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                 <Award size={48} className="opacity-20" />
                 <p className="text-sm font-medium">Chưa có công việc nào vượt tiến độ</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
