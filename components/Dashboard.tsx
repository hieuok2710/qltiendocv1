
import React, { useMemo, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { Task, TaskStatus } from '../types';
import { CheckCircle2, AlertCircle, FileBarChart, CalendarDays, Filter, Zap, Award, BarChart3, TrendingUp, Target } from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
}

// Bảng màu Aurora Modern mới - Tăng độ tương phản và chiều sâu
const STATUS_COLORS = {
  'Vượt tiến độ': '#A855F7', // Purple 500 (Tím rực rỡ)
  'Hoàn thành': '#14B8A6',   // Teal 500 (Xanh ngọc bích)
  'Đang xử lý': '#60A5FA',   // Blue 400 (Xanh biển dịu)
  'Quá hạn': '#FB7185',      // Rose 400 (Đỏ hồng)
};

const PIE_COLORS = {
  [TaskStatus.COMPLETED]: '#14B8A6',
  [TaskStatus.IN_PROGRESS]: '#60A5FA',
  [TaskStatus.PENDING]: '#94A3B8',
  [TaskStatus.OVERDUE]: '#FB7185',
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

  // Dữ liệu cho Composed Chart (Stacked Bar + Smooth Line)
  const correlationData = useMemo(() => {
    const months = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
    return months.map((m, index) => {
      const tasksInMonth = tasks.filter(t => {
        const d = new Date(t.deadline);
        return d.getMonth() === index && d.getFullYear() === selectedYear;
      });

      const earlyCount = tasksInMonth.filter(t => 
        t.status === TaskStatus.COMPLETED && 
        t.completedDate && 
        new Date(t.completedDate).getTime() < new Date(t.deadline).getTime()
      ).length;
      
      const completedCount = tasksInMonth.filter(t => t.status === TaskStatus.COMPLETED).length - earlyCount;
      const processingCount = tasksInMonth.filter(t => t.status === TaskStatus.IN_PROGRESS || t.status === TaskStatus.PENDING).length;
      const overdueCount = tasksInMonth.filter(t => t.status === TaskStatus.OVERDUE).length;
      
      const total = tasksInMonth.length;
      // Tỷ lệ xuất sắc (Vượt tiến độ / Tổng số xong)
      const excellenceRatio = (earlyCount + completedCount) > 0 
        ? parseFloat(((earlyCount / (earlyCount + completedCount)) * 100).toFixed(0)) 
        : 0;

      return {
        name: m,
        'Vượt tiến độ': earlyCount,
        'Hoàn thành': completedCount,
        'Đang xử lý': processingCount,
        'Quá hạn': overdueCount,
        'Tỷ lệ xuất sắc (%)': excellenceRatio,
        'Tổng khối lượng': total
      };
    });
  }, [tasks, selectedYear]);

  const stats = useMemo(() => {
    const total = filteredTasks.length;
    const completedTasks = filteredTasks.filter(t => t.status === TaskStatus.COMPLETED);
    const earlyTasks = completedTasks.filter(t => t.completedDate && new Date(t.completedDate).getTime() < new Date(t.deadline).getTime());
    const overdueTasks = filteredTasks.filter(t => t.status === TaskStatus.OVERDUE);

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

  const statusPieData = useMemo(() => {
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
    <div className="space-y-6 pb-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col xl:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl text-white shadow-xl shadow-indigo-100">
                <Target size={28} />
            </div>
            <div>
               <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                   Chỉ số tương quan tiến độ {selectedMonth === 'all' ? selectedYear : `${monthNames[selectedMonth]}`}
               </h2>
               <p className="text-sm text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 Dữ liệu hệ thống thời gian thực
               </p>
            </div>
         </div>
         
         <div className="flex flex-wrap items-center gap-3">
           <div className="flex items-center gap-2 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 shadow-inner">
              <Filter size={18} className="text-indigo-500" />
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="bg-transparent text-sm font-black text-slate-700 outline-none cursor-pointer">
                  <option value="all">Cả năm</option>
                  {monthNames.map((name, i) => <option key={i} value={i}>{name}</option>)}
              </select>
           </div>
           <div className="flex items-center gap-2 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 shadow-inner">
              <CalendarDays size={18} className="text-violet-500" />
              <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-transparent text-sm font-black text-slate-700 outline-none cursor-pointer">
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
           </div>
         </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-b-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><FileBarChart size={24} /></div>
            <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-1 rounded-lg">TOTAL</span>
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tổng khối lượng</p>
          <h3 className="text-3xl font-black text-slate-800">{stats.total}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-b-emerald-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle2 size={24} /></div>
            <span className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-2 py-1 rounded-lg">DONE</span>
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Đã hoàn thành</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-800">{stats.completed}</h3>
            <span className="text-xs font-bold text-emerald-600">({stats.completedPercent}%)</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-b-violet-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform"><Zap size={60} className="text-violet-600" /></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl"><Zap size={24} /></div>
            <span className="text-[10px] font-black bg-violet-100 text-violet-600 px-2 py-1 rounded-lg">EARLY</span>
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider relative z-10">Hoàn thành sớm</p>
          <div className="flex items-baseline gap-2 relative z-10">
            <h3 className="text-3xl font-black text-violet-600">{stats.early}</h3>
            <span className="text-xs font-bold text-violet-400">({stats.earlyPercent}%)</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-b-rose-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl text-rose-600 ${stats.overdue > 0 ? 'bg-rose-50 animate-pulse' : 'bg-slate-50'}`}><AlertCircle size={24} /></div>
            <span className="text-[10px] font-black bg-rose-100 text-rose-600 px-2 py-1 rounded-lg">DELAY</span>
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Báo cáo quá hạn</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-rose-600">{stats.overdue}</h3>
            {stats.overdue > 0 && <span className="text-xs font-bold text-rose-400">({stats.overduePercent}%)</span>}
          </div>
        </div>
      </div>

      {/* BIỂU ĐỒ TƯƠNG QUAN: COMPOSED STACKED BAR + LINE */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
           <div className="flex items-center gap-4">
              <div className="p-3.5 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200">
                 <BarChart3 size={24} />
              </div>
              <div>
                 <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Tương quan Khối lượng & Hiệu suất thực tế</h3>
                 <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Chiều cao cột = Khối lượng việc | Đường Line = Tỷ lệ vượt hạn (Năm {selectedYear})</p>
              </div>
           </div>
           
           <div className="flex flex-wrap items-center gap-4 bg-slate-50/80 p-4 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-2 px-2 border-r border-slate-200">
                <div className="w-3.5 h-3.5 bg-[#A855F7] rounded-md shadow-sm"></div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">Vượt hạn</span>
              </div>
              <div className="flex items-center gap-2 px-2 border-r border-slate-200">
                <div className="w-3.5 h-3.5 bg-[#14B8A6] rounded-md shadow-sm"></div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">Đúng hạn</span>
              </div>
              <div className="flex items-center gap-2 px-2 border-r border-slate-200">
                <div className="w-3.5 h-3.5 bg-[#60A5FA] rounded-md shadow-sm"></div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">Đang làm</span>
              </div>
              <div className="flex items-center gap-2 px-2 border-r border-slate-200">
                <div className="w-3.5 h-3.5 bg-[#FB7185] rounded-md shadow-sm"></div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">Trễ hạn</span>
              </div>
              <div className="flex items-center gap-2 px-2">
                <TrendingUp size={16} className="text-amber-500" />
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-tighter">Tỷ lệ xuất sắc</span>
              </div>
           </div>
        </div>

        <div className="h-[450px] w-full">
           <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={correlationData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 13, fontWeight: 800 }} 
                  dy={15}
                />
                <YAxis 
                  yAxisId="left"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                  label={{ value: 'SỐ LƯỢNG (VIỆC)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10, fontWeight: 900, offset: 10 }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#f59e0b', fontSize: 11, fontWeight: 700 }}
                  label={{ value: 'TỶ LỆ (%)', angle: 90, position: 'insideRight', fill: '#f59e0b', fontSize: 10, fontWeight: 900, offset: 10 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc', opacity: 0.6 }}
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                    padding: '20px'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: '800', padding: '4px 0', textTransform: 'uppercase' }}
                />
                
                {/* Cột chồng: Cấu trúc Aurora Modern */}
                <Bar yAxisId="left" dataKey="Quá hạn" stackId="report" fill="#FB7185" barSize={45} radius={[0, 0, 0, 0]} />
                <Bar yAxisId="left" dataKey="Đang xử lý" stackId="report" fill="#60A5FA" barSize={45} radius={[0, 0, 0, 0]} />
                <Bar yAxisId="left" dataKey="Hoàn thành" stackId="report" fill="#14B8A6" barSize={45} radius={[0, 0, 0, 0]} />
                <Bar yAxisId="left" dataKey="Vượt tiến độ" stackId="report" fill="#A855F7" barSize={45} radius={[12, 12, 0, 0]} />
                
                {/* Đường biểu diễn tỷ lệ hoàn thành xuất sắc */}
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="Tỷ lệ xuất sắc (%)" 
                  stroke="#F59E0B" 
                  strokeWidth={4}
                  dot={{ r: 6, fill: '#F59E0B', strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0, shadow: '0 0 10px rgba(245, 158, 11, 0.5)' }}
                />
              </ComposedChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-[450px]">
          <h3 className="text-sm font-black text-slate-800 mb-8 flex items-center gap-3 uppercase tracking-widest">
              <div className="w-2 h-5 bg-indigo-600 rounded-full"></div>
              Phân bổ trạng thái tổng thể
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={statusPieData} 
                  cx="50%" cy="50%" 
                  innerRadius={70} 
                  outerRadius={100} 
                  paddingAngle={8} 
                  dataKey="value"
                  animationBegin={200}
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name as TaskStatus] || '#cbd5e1'} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-[450px]">
          <h3 className="text-sm font-black text-slate-800 mb-8 flex items-center gap-3 uppercase tracking-widest justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-5 bg-violet-600 rounded-full"></div>
                Ngôi sao năng suất (Vượt hạn)
              </div>
              <span className="text-[10px] bg-violet-600 text-white px-4 py-1.5 rounded-full font-black tracking-widest shadow-lg shadow-violet-100">TOP PERFORMANCE</span>
          </h3>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {stats.earlyList.length > 0 ? (
              stats.earlyList.map((task, idx) => {
                const deadlineDate = new Date(task.deadline);
                const completeDate = new Date(task.completedDate!);
                const diffTime = Math.abs(deadlineDate.getTime() - completeDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={task.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 hover:border-violet-300 transition-all group hover:bg-white hover:shadow-xl">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-violet-600 shadow-sm group-hover:bg-violet-600 group-hover:text-white transition-all border border-slate-100 group-hover:rotate-6">
                          #{idx + 1}
                       </div>
                       <div>
                          <p className="text-base font-black text-slate-800 line-clamp-1 group-hover:text-violet-600 transition-colors">{task.content}</p>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Phụ trách: {task.ownerName}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="flex items-center justify-end gap-1.5 text-emerald-600 font-black text-xs uppercase tracking-tight">
                          <Zap size={14} fill="currentColor" /> XONG SỚM {diffDays} NGÀY
                       </div>
                       <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Hạn chót: {deadlineDate.toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 italic p-10">
                 <div className="p-6 bg-slate-50 rounded-full border-2 border-dashed border-slate-200">
                    <Award size={64} className="opacity-20" />
                 </div>
                 <p className="text-sm font-bold text-slate-400 text-center uppercase tracking-widest">Đang chờ sự bứt phá từ các đầu việc của bạn</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
