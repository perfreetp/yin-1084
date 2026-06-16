import { create } from 'zustand';
import type { TaskItem, DeviceItem, BackupItem, RecoveryItem, NotificationItem } from '@/types';
import { mockTasks } from '@/data/tasks';
import { mockDevices } from '@/data/devices';
import { mockBackups } from '@/data/backups';
import { mockRecoveries } from '@/data/recoveries';
import { mockNotifications } from '@/data/notifications';

interface AppState {
  tasks: TaskItem[];
  devices: DeviceItem[];
  backups: BackupItem[];
  recoveries: RecoveryItem[];
  notifications: NotificationItem[];
  currentClassName: string;
  setCurrentClassName: (name: string) => void;
  toggleBackupSelect: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addTask: (task: TaskItem) => void;
}

export const useAppStore = create<AppState>((set) => ({
  tasks: mockTasks,
  devices: mockDevices,
  backups: mockBackups,
  recoveries: mockRecoveries,
  notifications: mockNotifications,
  currentClassName: '全部班级',
  setCurrentClassName: (name) => set({ currentClassName: name }),
  toggleBackupSelect: (id) =>
    set((state) => ({
      backups: state.backups.map((b) =>
        b.id === id ? { ...b, isSelected: !b.isSelected } : b
      )
    })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    })),
  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true }))
    })),
  addTask: (task) =>
    set((state) => ({ tasks: [task, ...state.tasks] }))
}));
