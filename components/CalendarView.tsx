
import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, Zap } from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onTaskClick }) => {
  // Mặc định khởi tạo theo ngày hiện tại của hệ thống
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Thứ 2 là 0
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(year, Number(e.target.value), 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(Number(e.target.value), month, 1));
  };

  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - startDay + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      return dayNumber;
    }
    return null;
  });

  const getTasksForDay = (day: number) => {
    return tasks.filter(task => {
      const d = new Date(task.deadline);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const monthNames = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center bg-white gap-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <CalendarIcon size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Lịch Theo Dõi <span className="text-blue-600">{monthNames[month]} {year}</span>
            </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Dropdowns */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
             <Filter size={16} className="text-slate-400" />
             <select 
               value={month} 
               onChange={handleMonthChange}
               className="bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer"
             >
                {monthNames.map((name, i) => (
                    <option key={i} value={i}>{name}</option>
                ))}
             </select>
             <div className="w-px h-4 bg-slate-300 mx-1"></div>
             <select 
               value={year} 
               onChange={handleYearChange}
               className="bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer"
             >
                {[2024, 2025, 2026, 2027].map(y => (
                    <option key={y} value={y}>{y}</option>
                ))}
             </select>
          </div>

          <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1 bg-white shadow-sm">
            <button 
              onClick={prevMonth}
              className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-md uppercase"
            >
              Hôm nay
            </button>
            <button 
              onClick={nextMonth}
              className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Header */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80">
        {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'].map(day => (
          <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-r last:border-r-0 border-slate-200">
            {day}
          </div>
        ))}
      </div>

      {/* Grid Body */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {days.map((day, idx) => {
          const dayTasks = day ? getTasksForDay(day) : [];
          const now = new Date();
          const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();

          return (
            <div 
              key={idx} 
              className={`min-h-[110px] border-b border-r border-slate-100 p-2 relative transition-all duration-200 ${
                day ? 'bg-white hover:bg-blue-50/30' : 'bg-slate-50/30'
              } ${idx % 7 === 6 ? 'border-r-0' : ''}`}
            >
              {day && (
                <>
                  <div className={`text-sm font-bold mb-1.5 w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                    isToday ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 group-hover:text-blue-500'
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-1 overflow-y-auto max-h-[75px] pr-1 scrollbar-hide">
                    {dayTasks.map(task => {
                      // Logic kiểm tra Vượt tiến độ: Đã xong VÀ ngày xong < ngày hạn
                      const isEarly = task.status === TaskStatus.COMPLETED && 
                                      task.completedDate && 
                                      new Date(task.completedDate).getTime() < new Date(task.deadline).getTime();

                      return (
                        <div 
                          key={task.id} 
                          onClick={() => onTaskClick(task)}
                          className={`text-[10px] p-1.5 rounded-md border shadow-sm truncate cursor-pointer hover:scale-[1.02] transition-transform flex items-center gap-1 ${
                            isEarly ? 'bg-indigo-600 border-indigo-700 text-white font-bold' :
                            task.status === TaskStatus.COMPLETED ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                            task.status === TaskStatus.OVERDUE ? 'bg-red-50 border-red-200 text-red-700' :
                            task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-50 border-blue-200 text-blue-700' :
                            'bg-gray-50 border-gray-200 text-gray-600'
                          }`}
                          title={`${isEarly ? '[VƯỢT TIẾN ĐỘ] ' : ''}${task.content}`}
                        >
                           {isEarly ? <Zap size={8} fill="currentColor" /> : <span className="font-bold">{task.stt}.</span>}
                           <span className="truncate">{task.content}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Footer Legend */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-4 text-[10px] font-bold justify-center uppercase tracking-wider">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div><span className="text-indigo-600">Vượt tiến độ</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div><span className="text-emerald-500">Hoàn thành</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div><span className="text-blue-500">Đang xử lý</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div><span className="text-slate-400">Chưa xử lý</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div><span className="text-red-500">Quá hạn</span></div>
      </div>
    </div>
  );
};
