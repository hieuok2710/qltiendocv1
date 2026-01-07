
import { Task, TaskStatus } from '../types';

export const parseCSVToTasks = (csvText: string): Partial<Task>[] => {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];

  // Hàm helper để tách dòng CSV xử lý được các trường có dấu ngoặc kép và dấu phẩy bên trong
  const splitLine = (line: string) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = splitLine(lines[0]);
  const tasks: Partial<Task>[] = [];

  // Ánh xạ trạng thái từ tiếng Việt sang Enum
  const statusMap: Record<string, TaskStatus> = {
    'Chưa xử lý': TaskStatus.PENDING,
    'Đang xử lý': TaskStatus.IN_PROGRESS,
    'Hoàn thành': TaskStatus.COMPLETED,
    'Quá hạn': TaskStatus.OVERDUE
  };

  // Skip header, process rows
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = splitLine(lines[i]);
    
    // Giả định định dạng file xuất ra từ hệ thống: STT, Nội dung, Văn bản, Thời hạn, Trạng thái, Ghi chú
    // Headers: ['STT', 'Nội dung công việc', 'Văn bản yêu cầu', 'Thời hạn', 'Trạng thái', 'Ghi chú']
    
    const content = values[1] || '';
    const docRef = values[2] || '';
    const rawDate = values[3] || '';
    const statusStr = values[4] || '';
    const notes = values[5] || '';

    // Parse date từ định dạng dd/mm/yyyy sang yyyy-mm-dd
    let deadline = new Date().toISOString().split('T')[0];
    if (rawDate.includes('/')) {
      const parts = rawDate.split('/');
      if (parts.length === 3) {
        deadline = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }

    if (content) {
      tasks.push({
        content,
        documentRef: docRef,
        deadline,
        status: statusMap[statusStr] || TaskStatus.PENDING,
        notes: notes
      });
    }
  }

  return tasks;
};
