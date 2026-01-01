
export enum TaskStatus {
  PENDING = 'Chưa xử lý',
  IN_PROGRESS = 'Đang xử lý',
  COMPLETED = 'Hoàn thành',
  OVERDUE = 'Quá hạn'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  avatarColor: string;
  position: string;
}

export interface Task {
  id: string;
  stt: number;
  content: string;
  documentRef: string;
  deadline: string;
  status: TaskStatus;
  notes: string;
  userId: string;
  ownerName?: string;
  completedDate?: string; // Ngày thực tế hoàn thành
}

export type ViewMode = 'dashboard' | 'list' | 'calendar' | 'ai-report' | 'settings';
