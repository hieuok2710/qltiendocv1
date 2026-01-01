
import React from 'react';
import { LayoutDashboard, Table, CalendarDays, FileText, Sparkles, LogOut, Database, Settings } from 'lucide-react';
import { ViewMode, User, UserRole } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  user: User;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'list', label: 'Danh sách công việc', icon: Table },
    { id: 'calendar', label: 'Lịch theo dõi', icon: CalendarDays },
    { id: 'ai-report', label: 'Phân tích AI', icon: Sparkles, highlight: true },
    { id: 'settings', label: 'Sao lưu & Hệ thống', icon: Database },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl z-20">
      <div className="p-6 flex items-center gap-3 border-b border-slate-700 bg-slate-950/30">
        <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight uppercase tracking-tight">Quản Lý</h1>
          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Tiến độ báo cáo</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewMode)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400 group-hover:text-white'}`} />
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              {item.highlight && !isActive && (
                <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700 bg-slate-950/30 space-y-3">
        <div className="flex items-center gap-3 px-2">
           <div className={`w-8 h-8 ${user.avatarColor} rounded-lg flex items-center justify-center text-xs font-bold`}>
              {user.fullName.charAt(0)}
           </div>
           <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">{user.fullName}</p>
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">{user.role}</p>
           </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-semibold"
        >
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
        
        <div className="text-[10px] text-slate-600 text-center uppercase tracking-widest font-bold pt-2">
          v0.3.0 • Backup Enabled
        </div>
      </div>
    </div>
  );
};
