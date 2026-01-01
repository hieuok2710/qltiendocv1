import { Task } from '../types';

export const exportTasksToCSV = (tasks: Task[], filename: string) => {
  // Define headers
  const headers = ['STT', 'Nội dung công việc', 'Văn bản yêu cầu', 'Thời hạn', 'Trạng thái', 'Ghi chú'];
  
  // Map data to rows
  const rows = tasks.map(task => [
    task.stt,
    `"${task.content.replace(/"/g, '""')}"`, // Escape quotes
    `"${task.documentRef.replace(/"/g, '""')}"`,
    new Date(task.deadline).toLocaleDateString('vi-VN'),
    task.status,
    `"${(task.notes || '').replace(/"/g, '""')}"`
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Add BOM for Excel utf-8 compatibility
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};