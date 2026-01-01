
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TaskTable } from './components/TaskTable';
import { CalendarView } from './components/CalendarView';
import { AIInsights } from './components/AIInsights';
import { NewTaskModal } from './components/NewTaskModal';
import { TaskDetailsModal } from './components/TaskDetailsModal';
import { BackupRestore } from './components/BackupRestore';
import { Login } from './components/Login';
import { Task, TaskStatus, ViewMode, User, UserRole } from './types';
import { Bell, Search } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadAllTasks = useCallback(() => {
    if (!currentUser) return;

    if (currentUser.role === UserRole.ADMIN) {
      const allTasks: Task[] = [];
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith('tasks_')) {
          try {
            const userTasks = JSON.parse(localStorage.getItem(key) || '[]');
            allTasks.push(...userTasks);
          } catch (e) {
            console.error("Lỗi đọc dữ liệu:", key, e);
          }
        }
      }
      setTasks([...allTasks].sort((a, b) => (a.stt || 0) - (b.stt || 0)));
    } else {
      const storageKey = `tasks_${currentUser.id}`;
      const savedTasks = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setTasks([...savedTasks].sort((a: Task, b: Task) => (a.stt || 0) - (b.stt || 0)));
    }
  }, [currentUser]);

  useEffect(() => {
    loadAllTasks();
  }, [loadAllTasks, refreshKey]);

  const handleDataRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const enrichedTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]; 
    return tasks.map(task => {
      if (task.status !== TaskStatus.COMPLETED && new Date(task.deadline).getTime() < new Date(today).getTime()) {
        return { ...task, status: TaskStatus.OVERDUE };
      }
      return task;
    });
  }, [tasks]);

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'stt' | 'userId' | 'ownerName'>) => {
    if (!currentUser) return;

    const targetUserId = editingTask ? editingTask.userId : currentUser.id;
    const storageKey = `tasks_${targetUserId}`;
    const today = new Date().toISOString().split('T')[0];
    
    let userTasks = JSON.parse(localStorage.getItem(storageKey) || '[]');

    const finalTaskData = {
      ...taskData,
      completedDate: taskData.status === TaskStatus.COMPLETED ? (taskData.completedDate || today) : undefined
    };

    if (editingTask) {
      userTasks = userTasks.map((t: Task) => 
        String(t.id) === String(editingTask.id) ? { ...t, ...finalTaskData } : t
      );
    } else {
      const nextStt = userTasks.length > 0 ? Math.max(...userTasks.map((t: Task) => t.stt)) + 1 : 1;
      const newTask: Task = { 
        ...finalTaskData, 
        id: Date.now().toString(), 
        stt: nextStt, 
        userId: currentUser.id,
        ownerName: currentUser.fullName
      };
      userTasks.push(newTask);
    }

    localStorage.setItem(storageKey, JSON.stringify(userTasks));
    loadAllTasks();
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    let success = false;
    // Lấy danh sách khóa một cách tĩnh để tránh lỗi khi dữ liệu thay đổi trong vòng lặp
    const keys = Object.keys(localStorage).filter(k => k.startsWith('tasks_'));
    
    for (const key of keys) {
      try {
        const storedTasks = JSON.parse(localStorage.getItem(key) || '[]');
        const initialCount = storedTasks.length;
        
        // Lọc bỏ task, đảm bảo so sánh chuỗi để tránh lỗi kiểu dữ liệu
        const filtered = storedTasks.filter((t: any) => String(t.id) !== String(taskId));
        
        if (filtered.length < initialCount) {
          // Cập nhật lại số thứ tự (STT) cho đẹp
          const updated = filtered.map((t: any, index: number) => ({
            ...t,
            stt: index + 1
          }));
          
          localStorage.setItem(key, JSON.stringify(updated));
          success = true;
          break; // Đã tìm thấy và xóa xong ở một user, không cần quét tiếp
        }
      } catch (e) {
        console.error("Lỗi khi xóa:", key, e);
      }
    }

    if (success) {
      // Cập nhật State cục bộ ngay lập tức để UI phản hồi nhanh
      setTasks(prev => prev.filter(t => String(t.id) !== String(taskId)));
      // Sau đó nạp lại toàn bộ để đồng bộ STT nếu cần
      loadAllTasks();
    } else {
      alert("Không thể xóa công việc này. Dữ liệu có thể đã thay đổi hoặc không tồn tại.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setTasks([]);
    setCurrentView('dashboard');
  };

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} user={currentUser} onLogout={handleLogout} />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
             <div className="relative w-96">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={18} /></span>
                <input type="text" placeholder="Tìm kiếm công việc..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
             {currentUser.role === UserRole.ADMIN && (
               <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full border border-indigo-200 uppercase tracking-wider animate-pulse">
                 Chế độ Admin
               </span>
             )}
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-800">{currentUser.fullName}</p>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">{currentUser.position}</p>
              </div>
              <div className={`w-10 h-10 ${currentUser.avatarColor} rounded-full flex items-center justify-center text-white font-bold shadow-md`}>
                {currentUser.fullName.charAt(0)}
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto h-full">
            {currentView === 'dashboard' && <Dashboard tasks={enrichedTasks} />}
            {currentView === 'list' && (
               <TaskTable 
                 tasks={enrichedTasks} 
                 showOwner={currentUser.role === UserRole.ADMIN}
                 onAddNewClick={() => { setEditingTask(null); setIsModalOpen(true); }}
                 onEditClick={(t) => { setEditingTask(t); setIsModalOpen(true); }}
                 onDeleteClick={handleDeleteTask}
                 onViewClick={(t) => { setViewingTask(t); setIsDetailModalOpen(true); }}
               />
            )}
            {currentView === 'calendar' && <CalendarView tasks={enrichedTasks} onTaskClick={(t) => { setViewingTask(t); setIsDetailModalOpen(true); }} />}
            {currentView === 'ai-report' && <AIInsights tasks={enrichedTasks} />}
            {currentView === 'settings' && <BackupRestore onDataChange={handleDataRefresh} />}
          </div>
        </div>
      </main>
      <NewTaskModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTask(null); }} onSave={handleSaveTask} taskToEdit={editingTask} />
      <TaskDetailsModal isOpen={isDetailModalOpen} onClose={() => { setIsDetailModalOpen(false); setViewingTask(null); }} task={viewingTask} />
    </div>
  );
};

export default App;
