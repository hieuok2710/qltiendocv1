
import React, { useState, useMemo } from 'react';
import { Task, TaskStatus } from '../types';
import { Eye, Pencil, Trash2, Zap, AlertTriangle, Filter, CalendarDays, ChevronRight } from 'lucide-react';

interface TaskTableProps {
  tasks: Task[];
  showOwner?: boolean;
  onAddNewClick?: () => void;
  onEditClick: (task: Task) => void;
  onDeleteClick: (taskId: string) => void;
  onViewClick: (task: Task) => void;
}

const getStatusBadge = (task: Task) => {
  const isEarly = task.status === TaskStatus.COMPLETED && 
                  task.completedDate && 
                  new Date(task.completedDate).getTime() < new Date(task.deadline).getTime();
  
  let diffDays = 0;
  if (isEarly) {
    const d1 = new Date(task.deadline);
    const d2 = new Date(task.completedDate!);
    diffDays = Math.ceil(Math.abs(d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
  }

  switch (task.status) {
    case TaskStatus.COMPLETED:
      return (
        <div className="flex flex-col items-center gap-1">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">Hoàn thành</span>
          {isEarly && (
            <span className="flex items-center gap-1 text-[10px] font-black text-white bg-indigo-600 px-2 py-0.5 rounded-md shadow-sm animate-pulse">
              < Zap size={10} fill="currentColor" /> SỚM {diffDays}N
            </span>
          )}
        </div>
      );
    case TaskStatus.IN_PROGRESS:
      return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 border border-blue-200">Đang xử lý</span>;
    case TaskStatus.OVERDUE:
      return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700 border border-red-200 flex items-center gap-1"><AlertTriangle size={12} /> Quá hạn</span>;
    default:
      return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Chưa xử lý</span>;
  }
};

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, showOwner, onAddNewClick, onEditClick, onDeleteClick, onViewClick }) => {
  const currentSystemDate = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(currentSystemDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>(currentSystemDate.getMonth());

  const years = useMemo(() => {
    const uniqueYears: number[] = Array.from(new Set(tasks.map(t => new Date(t.deadline).getFullYear())));
    if (!uniqueYears.includes(currentSystemDate.getFullYear())) uniqueYears.push(currentSystemDate.getFullYear());
    return uniqueYears.sort((a, b) => b - a);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
        const d = new Date(task.deadline);
        return d.getFullYear() === selectedYear && (selectedMonth === 'all' || d.getMonth() === selectedMonth);
    });
  }, [tasks, selectedYear, selectedMonth]);

  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center bg-slate-50/50 gap-4">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-100">
              <ChevronRight size={24} />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Chi tiết báo cáo</h2>
             <p className="text-xs text-slate-500 font-medium">Tổng số {filteredTasks.length} đầu việc • Đã xong {filteredTasks.filter(t => t.status === TaskStatus.COMPLETED).length}</p>
           </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border shadow-sm">
            <Filter size={16} className="text-slate-400" />
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="text-sm font-bold bg-transparent outline-none">
                <option value="all">Tất cả tháng</option>
                {monthNames.map((name, i) => <option key={i} value={i}>{name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border shadow-sm">
            <CalendarDays size={16} className="text-slate-400" />
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="text-sm font-bold bg-transparent outline-none">
                {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button onClick={onAddNewClick} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95">
            + THÊM MỚI
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] text-slate-400 uppercase bg-slate-50 border-b font-black tracking-widest">
            <tr>
              <th className="px-6 py-4 w-12 text-center">STT</th>
              <th className="px-6 py-4">NỘI DUNG VÀ VĂN BẢN</th>
              {showOwner && <th className="px-6 py-4">PHỤ TRÁCH</th>}
              <th className="px-6 py-4">MỐC THỜI GIAN</th>
              <th className="px-6 py-4 text-center">TÌNH TRẠNG</th>
              <th className="px-4 py-4 w-28 text-center">THAO TÁC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTasks.map((task) => (
              <tr key={task.id} className="group hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-center font-black text-slate-300 group-hover:text-blue-500 transition-colors">{task.stt}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col max-w-md">
                    <span className="font-bold text-slate-800 leading-tight mb-1 cursor-pointer" onClick={() => onViewClick(task)}>{task.content}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{task.documentRef}</span>
                  </div>
                </td>
                {showOwner && (
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-600">{task.ownerName}</span>
                  </td>
                )}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      Hạn: {new Date(task.deadline).toLocaleDateString('vi-VN')}
                    </div>
                    {task.completedDate && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Xong: {new Date(task.completedDate).toLocaleDateString('vi-VN')}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">{getStatusBadge(task)}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onViewClick(task)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Xem chi tiết"><Eye size={16} /></button>
                    <button onClick={() => onEditClick(task)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Sửa công việc"><Pencil size={16} /></button>
                    <button 
                      onClick={() => {
                        if (confirm(`Bạn có chắc chắn muốn xóa công việc này?\n\n"${task.content}"`)) {
                          onDeleteClick(task.id);
                        }
                      }} 
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Xóa công việc"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
