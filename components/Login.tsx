
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ShieldCheck, User as UserIcon, Lock, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-10 text-center relative">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 rotate-3">
             <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Hệ Thống Quản Lý Báo Cáo</h1>
          <p className="text-slate-400 text-sm">Vui lòng đăng nhập để tiếp tục công việc</p>
          <div className="absolute top-4 right-4 text-amber-400 opacity-50"><Sparkles size={24} /></div>
        </div>

        <form onSubmit={handleLogin} className="p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <UserIcon size={16} className="text-slate-400" />
              Chọn tài khoản truy cập
            </label>
            <select 
              value={selectedUsername}
              onChange={(e) => setSelectedUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-800 appearance-none cursor-pointer"
            >
              {MOCK_USERS.map(u => (
                <option key={u.id} value={u.username}>
                  {u.fullName} ({u.role === UserRole.ADMIN ? 'Quyền Admin' : 'Cá nhân'})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Lock size={16} className="text-slate-400" />
              Mật khẩu (Demo)
            </label>
            <input 
              type="password" 
              disabled 
              value="••••••••" 
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed" 
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
          >
            Đăng nhập hệ thống
          </button>

          <div className="pt-4 text-center">
            <p className="text-xs text-slate-400 italic">* Hệ thống tự động phân tách dữ liệu cho từng tài khoản qua LocalStorage</p>
          </div>
        </form>
      </div>
    </div>
  );
};
