
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ShieldCheck, User as UserIcon, Lock, Sparkles, LayoutDashboard, Target, Zap } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const MOCK_USERS: User[] = [
  { id: 'u1', username: 'admin', fullName: 'Lãnh Đạo Đơn Vị', role: UserRole.ADMIN, avatarColor: 'bg-indigo-600', position: 'Chủ tịch' },
  { id: 'u2', username: 'kyduyen', fullName: 'Nguyễn Thái Ngọc Kỳ Duyên', role: UserRole.USER, avatarColor: 'bg-blue-500', position: 'Phó CVP HĐND và UBND' },
  { id: 'u3', username: 'vananh', fullName: 'Trần Thị Vân Anh', role: UserRole.USER, avatarColor: 'bg-emerald-500', position: 'Chuyên viên tổng hợp' }
];

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedUsername, setSelectedUsername] = useState('admin');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => u.username === selectedUsername);
    if (user) onLogin(user);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* BACKGROUND DECORATIONS (The Banner Base) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Abstract Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      {/* CENTERED HERO BANNER CONTENT */}
      <div className="w-full max-w-5xl flex flex-col items-center relative z-10">
        
        {/* Intro Header Section */}
        <div className="text-center mb-10 space-y-4 animate-in fade-in slide-in-from-top-8 duration-700">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-4">
              <Sparkles size={14} />
              Quản trị thông minh 4.0
           </div>
           <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              Hệ Thống <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Theo Dõi</span> <br/> 
              Tiến Độ Báo Cáo
           </h1>
           <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
              Nâng cao hiệu suất làm việc với nền tảng quản trị báo cáo tập trung, 
              trực quan hóa dữ liệu và phân tích thông minh bằng AI.
           </p>

           <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-slate-500">
                 <div className="p-1.5 bg-slate-800 rounded-lg text-emerald-400"><LayoutDashboard size={18} /></div>
                 <span className="text-xs font-bold uppercase tracking-wider">Trực quan</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                 <div className="p-1.5 bg-slate-800 rounded-lg text-blue-400"><Target size={18} /></div>
                 <span className="text-xs font-bold uppercase tracking-wider">Chính xác</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                 <div className="p-1.5 bg-slate-800 rounded-lg text-amber-400"><Zap size={18} /></div>
                 <span className="text-xs font-bold uppercase tracking-wider">Nhanh chóng</span>
              </div>
           </div>
        </div>

        {/* LOGIN FORM (Centered in Banner Area) */}
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-500 delay-300">
          <div className="bg-gradient-to-br from-slate-50 to-white p-8 pb-4 border-b border-slate-100 flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/40 mb-4 rotate-3">
               <ShieldCheck size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Xác thực truy cập</h2>
            <p className="text-slate-400 text-xs font-bold mt-1">Sử dụng tài khoản nội bộ đơn vị</p>
          </div>

          <form onSubmit={handleLogin} className="p-10 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <UserIcon size={14} />
                Chọn tài khoản đăng nhập
              </label>
              <div className="relative group">
                <select 
                  value={selectedUsername}
                  onChange={(e) => setSelectedUsername(e.target.value)}
                  className="w-full pl-4 pr-10 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                >
                  {MOCK_USERS.map(u => (
                    <option key={u.id} value={u.username}>
                      {u.fullName} — {u.position}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                   <LayoutDashboard size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Lock size={14} />
                Mật khẩu hệ thống
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  disabled 
                  value="••••••••" 
                  className="w-full px-4 py-4 bg-slate-100 border-2 border-slate-50 rounded-2xl text-slate-400 cursor-not-allowed font-mono" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] bg-slate-200 text-slate-500 px-2 py-1 rounded font-black">DEMO</span>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/30 transition-all active:scale-[0.97] flex items-center justify-center gap-2 group uppercase tracking-wider"
            >
              <span>Vào hệ thống</span>
              <Zap size={18} className="group-hover:translate-x-1 transition-transform" fill="white" />
            </button>

            <div className="pt-2 text-center">
              <div className="flex items-center justify-center gap-2 text-slate-400 mb-1">
                 <div className="h-px w-8 bg-slate-200"></div>
                 <span className="text-[10px] font-bold uppercase tracking-tighter">Bảo mật đa lớp</span>
                 <div className="h-px w-8 bg-slate-200"></div>
              </div>
              <p className="text-[9px] text-slate-400 italic">Dữ liệu được mã hóa và lưu trữ cục bộ trên trình duyệt cá nhân</p>
            </div>
          </form>
        </div>
        
        {/* Footer info in Banner area */}
        <div className="mt-12 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4 opacity-50">
            <span>Phiên bản v0.4.5</span>
            <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
            <span>Phát triển bởi Trung tâm CNTT</span>
        </div>
      </div>
    </div>
  );
};
