
import React, { useState, useRef } from 'react';
import { Download, Upload, Trash2, AlertCircle, CheckCircle, FileJson, Info, ShieldAlert, Database, Loader2 } from 'lucide-react';

interface BackupRestoreProps {
  onDataChange: () => void;
}

export const BackupRestore: React.FC<BackupRestoreProps> = ({ onDataChange }) => {
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'loading' | null; message: string }>({ type: null, message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      setStatus({ type: 'loading', message: 'Đang trích xuất dữ liệu...' });
      const allData: Record<string, any> = {};
      
      // Thu thập tất cả dữ liệu có tiền tố tasks_
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('tasks_')) {
          try {
            const val = localStorage.getItem(key);
            if (val) allData[key] = JSON.parse(val);
          } catch (e) {
            console.error(`Lỗi đọc khóa ${key}:`, e);
          }
        }
      }

      if (Object.keys(allData).length === 0) {
        setStatus({ type: 'error', message: 'Hệ thống trống, không có dữ liệu để sao lưu.' });
        return;
      }

      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      
      link.href = url;
      link.download = `SAO_LUU_HE_THONG_${date}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatus({ type: 'success', message: 'Đã tạo file sao lưu thành công!' });
    } catch (error) {
      console.error("Export error:", error);
      setStatus({ type: 'error', message: 'Lỗi trong quá trình tạo file sao lưu.' });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus({ type: 'loading', message: 'Đang kiểm tra tệp tin...' });

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);

        // Kiểm tra tính hợp lệ cơ bản (phải là object và có ít nhất 1 khóa tasks_)
        if (typeof importedData !== 'object' || importedData === null) {
          throw new Error('Định dạng file không hợp lệ.');
        }

        const keys = Object.keys(importedData);
        const hasTaskKeys = keys.some(k => k.startsWith('tasks_'));

        if (!hasTaskKeys) {
          throw new Error('File này không chứa dữ liệu của hệ thống báo cáo.');
        }

        if (confirm('XÁC NHẬN KHÔI PHỤC:\n\nHành động này sẽ xóa sạch dữ liệu hiện tại và thay thế bằng dữ liệu từ file sao lưu.\nBạn có chắc chắn muốn tiếp tục?')) {
          
          // Bước 1: Thu thập tất cả khóa cũ cần xóa
          const keysToDelete: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('tasks_')) {
              keysToDelete.push(key);
            }
          }

          // Bước 2: Xóa dữ liệu cũ
          keysToDelete.forEach(key => localStorage.removeItem(key));

          // Bước 3: Ghi dữ liệu mới vào localStorage
          let importedCount = 0;
          keys.forEach(key => {
            if (key.startsWith('tasks_')) {
              localStorage.setItem(key, JSON.stringify(importedData[key]));
              importedCount++;
            }
          });

          setStatus({ type: 'success', message: `Khôi phục thành công ${importedCount} tài khoản dữ liệu.` });
          
          // Bước 4: Buộc App nạp lại dữ liệu ngay lập tức
          onDataChange();
        } else {
          setStatus({ type: null, message: '' });
        }
      } catch (error: any) {
        console.error("Import error:", error);
        setStatus({ type: 'error', message: error.message || 'Tệp tin bị hỏng hoặc không đúng định dạng JSON.' });
      }
    };

    reader.onerror = () => {
      setStatus({ type: 'error', message: 'Không thể đọc tệp tin.' });
    };

    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    if (confirm('CẢNH BÁO NGUY HIỂM:\nHành động này sẽ XÓA VĨNH VIỄN toàn bộ dữ liệu trên trình duyệt này.\nBạn có chắc chắn?')) {
      const confirmCode = prompt('Vui lòng nhập "DONG Y" để xác nhận xóa:');
      if (confirmCode === 'DONG Y') {
        const keysToDelete: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('tasks_')) {
            keysToDelete.push(key);
          }
        }
        keysToDelete.forEach(key => localStorage.removeItem(key));
        setStatus({ type: 'success', message: 'Đã xóa toàn bộ dữ liệu hệ thống.' });
        onDataChange();
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-8">
           <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Database size={28} />
           </div>
           <div>
              <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">Cài Đặt Hệ Thống & Dữ Liệu</h2>
              <p className="text-sm text-slate-500 font-medium">Đảm bảo an toàn dữ liệu bằng cách sao lưu thường xuyên.</p>
           </div>
        </div>

        {status.type && (
          <div className={`mb-8 p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${
            status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
            status.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
            'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            {status.type === 'success' ? <CheckCircle size={20} /> : 
             status.type === 'error' ? <AlertCircle size={20} /> : 
             <Loader2 size={20} className="animate-spin" />}
            <span className="font-bold text-sm">{status.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50 hover:border-blue-200 transition-all group">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <Download size={24} />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Tạo bản sao lưu</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Lưu trữ toàn bộ công việc hiện có thành một file để có thể khôi phục sau này.
            </p>
            <button 
              onClick={handleExport}
              disabled={status.type === 'loading'}
              className="w-full py-3 bg-white border border-slate-200 text-blue-600 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              Tải file (.json)
            </button>
          </div>

          <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50 hover:border-indigo-200 transition-all group">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <Upload size={24} />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Phục hồi từ file</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Chọn tệp tin .json đã sao lưu để khôi phục lại trạng thái dữ liệu báo cáo.
            </p>
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              onChange={handleImport} 
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={status.type === 'loading'}
              className="w-full py-3 bg-white border border-slate-200 text-indigo-600 font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              Chọn file khôi phục
            </button>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100">
           <div className="flex items-center gap-2 mb-4 text-red-600">
              <ShieldAlert size={20} />
              <h4 className="font-black text-sm uppercase tracking-widest">Khu vực nguy hiểm</h4>
           </div>
           <div className="bg-red-50/50 border border-red-100 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                 <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
                    <Trash2 size={24} />
                 </div>
                 <div>
                    <p className="font-bold text-slate-800 text-sm">Xóa sạch toàn bộ dữ liệu</p>
                    <p className="text-xs text-slate-500">Hành động này sẽ xóa vĩnh viễn mọi báo cáo của mọi người dùng.</p>
                 </div>
              </div>
              <button 
                onClick={handleReset}
                disabled={status.type === 'loading'}
                className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-md active:scale-95 whitespace-nowrap disabled:opacity-50"
              >
                Reset Hệ Thống
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
