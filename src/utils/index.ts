import dayjs from 'dayjs';

export const formatTime = (time: string): string => {
  if (!time) return '';
  return dayjs(time).format('MM-DD HH:mm');
};

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    completed: '#00b42a',
    in_progress: '#4080FF',
    pending: '#ff7d00',
    partial: '#ff7d00',
    unbackup: '#f53f3f',
    archived: '#86909c'
  };
  return map[status] || '#86909c';
};

export const getTaskTypeIcon = (type: string): string => {
  const map: Record<string, string> = {
    semester: '📚',
    reinstall: '🔧',
    contest: '🏆'
  };
  return map[type] || '📋';
};

export const getNotificationIcon = (type: string): string => {
  const map: Record<string, string> = {
    backup: '✅',
    recovery: '🔄',
    warning: '⚠️',
    missed: '🔔'
  };
  return map[type] || '📢';
};

export const calcProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};
