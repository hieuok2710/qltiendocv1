
import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, CalendarCheck } from 'lucide-react';
import { Task, TaskStatus } from '../types';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'stt' | 'userId' | 'ownerName'>) => void;
  taskToEdit?: Task | null;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose, onSave, taskToEdit }) => {
  const [formData, setFormData] = useState({
    content: '',
    documentRef: '',
    deadline: new Date().toISOString().split('T')[0],
    status: TaskStatus.PENDING,
    notes: '',
    completedDate: '' as string | undefined
  });

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setFormData({
          content: taskToEdit.content,
          documentRef: taskToEdit.documentRef,
          deadline: taskToEdit.deadline,
          status: taskToEdit.status,
          notes: taskToEdit.notes,
          completedDate: taskToEdit.completedDate
        });
      } else {
        setFormData({
          content: '',
          documentRef: '',
          deadline: new Date().toISOString().split('T')[0],
          status: TaskStatus.PENDING,
          notes: '',
          completedDate: undefined
        });
      }
    }
  }, [isOpen, taskToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim() || !formData.documentRef.trim()) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc (*)");
      return;
    }
    
    // Nếu trạng thái không phải hoàn thành thì xóa ngày hoàn thành
    const finalData = {
      ...formData,
      completedDate: formData.status === TaskStatus.COMPLETED ? (formData.completedDate || new Date().toISOString().split('T')[0]) : undefined
    };
    
    onSave(finalData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Save size={20} />
             </div>
             <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
                {taskToEdit ? 'Cập Nhật Báo Cáo' : 'Thêm Mới Báo Cáo'}
             </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-200 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Nội dung công việc <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 text-sm"
              placeholder="Nhập nội dung công việc..."
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Văn bản yêu cầu <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm"
                value={formData.documentRef}
                onChange={e => setFormData({...formData, documentRef: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Thời hạn (Deadline)</label>
              <input
                type="date"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm"
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Trạng thái</label>
               <select
                 className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-sm"
                 value={formData.status}
                 onChange={e => setFormData({...formData, status: e.target.value as TaskStatus})}
               >
                 {Object.values(TaskStatus).filter(s => s !== TaskStatus.OVERDUE).map(status => (
                   <option key={status} value={status}>{status}</option>
                 ))}
               </select>
            </div>
            {formData.status === TaskStatus.COMPLETED && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <label className="block text-sm font-bold text-indigo-600 mb-2 flex items-center gap-1">
                  <CalendarCheck size={14} /> Ngày hoàn thành thực tế
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border-2 border-indigo-100 bg-indigo-50/30 rounded-xl text-sm font-bold text-indigo-700 outline-none focus:border-indigo-500"
                  value={formData.completedDate || new Date().toISOString().split('T')[0]}
                  onChange={e => setFormData({...formData, completedDate: e.target.value})}
                />
                <p className="text-[10px] text-indigo-500 mt-1 font-medium">* Nếu ngày này nhỏ hơn Thời hạn, hệ thống sẽ tính là Vượt tiến độ.</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Ghi chú</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm"
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <button type="button" onClick={onClose} className="px-6 py-3 text-sm font-bold text-slate-500">Hủy</button>
            <button type="submit" className="px-8 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl shadow-lg">
              {taskToEdit ? 'Cập nhật' : 'Lưu báo cáo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
