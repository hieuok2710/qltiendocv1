
import React from 'react';
import { X, Calendar, FileText, AlignLeft, Tag, Hash, Zap } from 'lucide-react';
import { Task, TaskStatus } from '../types';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.COMPLETED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case TaskStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-700 border-blue-200';
    case TaskStatus.OVERDUE: return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

  const isEarly = task.status === TaskStatus.COMPLETED && task.completedDate && task.completedDate < task.deadline;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Hash size={20} className="text-blue-600" />
            Chi Tiết Công Việc #{task.stt}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-200 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
            {isEarly && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-md animate-pulse">
                <Zap size={12} fill="currentColor" /> Vượt tiến độ
              </span>
            )}
          </div>

          <div className="space-y-2">
             <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                <AlignLeft size={16} />
                <span>Nội dung công việc</span>
             </div>
             <p className="text-slate-800 text-base leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
               {task.content}
             </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                  <Calendar size={16} />
                  <span>Thời hạn</span>
               </div>
               <p className="text-slate-800 font-bold">{new Date(task.deadline).toLocaleDateString('vi-VN')}</p>
            </div>
            {task.completedDate && (
              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                    <Zap size={16} />
                    <span>Ngày hoàn thành</span>
                 </div>
                 <p className="text-emerald-700 font-bold">{new Date(task.completedDate).toLocaleDateString('vi-VN')}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
             <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                <FileText size={16} />
                <span>Văn bản yêu cầu</span>
             </div>
             <p className="text-slate-800 font-medium">{task.documentRef}</p>
          </div>

          {task.notes && (
            <div className="space-y-2">
               <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                  <Tag size={16} />
                  <span>Ghi chú</span>
               </div>
               <p className="text-slate-600 italic bg-amber-50 p-3 rounded-lg border border-amber-100">{task.notes}</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
           <button onClick={onClose} className="px-5 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors">Đóng</button>
        </div>
      </div>
    </div>
  );
};
