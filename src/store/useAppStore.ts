import { create } from 'zustand';
import Taro from '@tarojs/taro';
import type {
  TaskItem,
  DeviceItem,
  BackupItem,
  RecoveryItem,
  NotificationItem,
  TaskType,
  DeviceStatus
} from '@/types';
import { mockTasks } from '@/data/tasks';
import { mockDevices } from '@/data/devices';
import { mockBackups } from '@/data/backups';
import { mockRecoveries } from '@/data/recoveries';
import { mockNotifications } from '@/data/notifications';

const STORAGE_KEY = 'room_data_assistant_store_v1';

interface AppState {
  tasks: TaskItem[];
  devices: DeviceItem[];
  backups: BackupItem[];
  recoveries: RecoveryItem[];
  notifications: NotificationItem[];
  currentClassName: string;
  isInitialized: boolean;

  initFromStorage: () => void;
  saveToStorage: () => void;
  resetAllData: () => void;

  setCurrentClassName: (name: string) => void;

  addTask: (task: TaskItem, devices: DeviceItem[]) => void;
  updateTaskProgress: (taskId: string) => void;

  addDevice: (device: DeviceItem) => void;
  updateDeviceStatus: (deviceId: string, status: DeviceStatus) => void;

  toggleBackupSelect: (id: string) => void;
  archiveSelectedBackups: () => string[];
  addBackup: (backup: BackupItem) => void;

  addRecovery: (recovery: RecoveryItem) => void;
  updateRecoveryProgress: (recoveryId: string, completed: number) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'isRead' | 'createdAt'>) => void;
}

const loadFromStorage = (): Partial<AppState> | null => {
  try {
    const data = Taro.getStorageSync(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (e) {
    console.error('[Store] Failed to load from storage:', e);
    return null;
  }
};

const saveToStorageInternal = (state: Partial<AppState>) => {
  try {
    const data = JSON.stringify({
      tasks: state.tasks,
      devices: state.devices,
      backups: state.backups,
      recoveries: state.recoveries,
      notifications: state.notifications,
      currentClassName: state.currentClassName
    });
    Taro.setStorageSync(STORAGE_KEY, data);
  } catch (e) {
    console.error('[Store] Failed to save to storage:', e);
  }
};

const nowStr = () => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

const nowDateStr = () => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

export const useAppStore = create<AppState>((set, get) => ({
  tasks: mockTasks,
  devices: mockDevices,
  backups: mockBackups,
  recoveries: mockRecoveries,
  notifications: mockNotifications,
  currentClassName: '全部班级',
  isInitialized: false,

  initFromStorage: () => {
    const stored = loadFromStorage();
    if (stored && stored.tasks && stored.tasks.length > 0) {
      set({
        tasks: stored.tasks,
        devices: stored.devices || [],
        backups: stored.backups || [],
        recoveries: stored.recoveries || [],
        notifications: stored.notifications || [],
        currentClassName: stored.currentClassName || '全部班级',
        isInitialized: true
      });
      console.info('[Store] Initialized from local storage');
    } else {
      set({ isInitialized: true });
      saveToStorageInternal(get());
      console.info('[Store] Initialized with mock data, saved to storage');
    }
  },

  saveToStorage: () => {
    saveToStorageInternal(get());
  },

  resetAllData: () => {
    set({
      tasks: mockTasks,
      devices: mockDevices,
      backups: mockBackups,
      recoveries: mockRecoveries,
      notifications: mockNotifications,
      currentClassName: '全部班级'
    });
    saveToStorageInternal(get());
    Taro.showToast({ title: '数据已重置', icon: 'success' });
  },

  setCurrentClassName: (name) => {
    set({ currentClassName: name });
    saveToStorageInternal(get());
  },

  addTask: (task, devices) => {
    set((state) => ({
      tasks: [task, ...state.tasks],
      devices: [...devices, ...state.devices]
    }));
    saveToStorageInternal(get());
    console.info('[Store] Task added:', task.id, 'with', devices.length, 'devices');
  },

  updateTaskProgress: (taskId) => {
    set((state) => {
      const task = state.tasks.find((t) => t.id === taskId);
      if (!task) return state;

      const taskDevices = state.devices.filter((d) => d.className === task.className && d.taskType === task.taskTypeLabel);
      const total = taskDevices.length;
      const completed = taskDevices.filter((d) => d.status === 'completed').length;

      let newStatus = task.status;
      let newStatusLabel = task.statusLabel;
      if (completed === total && total > 0) {
        newStatus = 'completed';
        newStatusLabel = '已完成';
      } else if (completed > 0) {
        newStatus = 'in_progress';
        newStatusLabel = '进行中';
      }

      return {
        tasks: state.tasks.map((t) =>
          t.id === taskId
            ? { ...t, totalDevices: total, completedDevices: completed, status: newStatus, statusLabel: newStatusLabel }
            : t
        )
      };
    });
    saveToStorageInternal(get());
  },

  addDevice: (device) => {
    set((state) => ({ devices: [device, ...state.devices] }));
    saveToStorageInternal(get());
  },

  updateDeviceStatus: (deviceId, status) => {
    set((state) => ({
      devices: state.devices.map((d) => {
        if (d.id !== deviceId) return d;
        const statusMap: Record<DeviceStatus, string> = {
          completed: '已备份',
          partial: '部分备份',
          unbackup: '未备份'
        };
        return {
          ...d,
          status,
          statusLabel: statusMap[status],
          backupTime: status !== 'unbackup' ? nowStr() : ''
        };
      })
    }));
    saveToStorageInternal(get());
  },

  toggleBackupSelect: (id) => {
    set((state) => ({
      backups: state.backups.map((b) =>
        b.id === id ? { ...b, isSelected: !b.isSelected } : b
      )
    }));
    saveToStorageInternal(get());
  },

  archiveSelectedBackups: () => {
    const selectedIds: string[] = [];
    set((state) => ({
      backups: state.backups.map((b) => {
        if (b.isSelected && !b.isArchived) {
          selectedIds.push(b.id);
          return { ...b, isArchived: true, isSelected: false };
        }
        return b;
      })
    }));
    saveToStorageInternal(get());
    console.info('[Store] Archived backups:', selectedIds.length);
    return selectedIds;
  },

  addBackup: (backup) => {
    set((state) => ({ backups: [backup, ...state.backups] }));
    saveToStorageInternal(get());
  },

  addRecovery: (recovery) => {
    set((state) => ({ recoveries: [recovery, ...state.recoveries] }));
    saveToStorageInternal(get());
  },

  updateRecoveryProgress: (recoveryId, completed) => {
    set((state) => {
      const recovery = state.recoveries.find((r) => r.id === recoveryId);
      if (!recovery) return state;

      const total = recovery.targetDevices;
      let newStatus = recovery.status;
      let newStatusLabel = recovery.statusLabel;

      if (completed >= total) {
        newStatus = 'completed';
        newStatusLabel = '已完成';
      } else if (completed > 0) {
        newStatus = 'in_progress';
        newStatusLabel = '恢复中';
      }

      return {
        recoveries: state.recoveries.map((r) =>
          r.id === recoveryId
            ? { ...r, completedDevices: completed, status: newStatus, statusLabel: newStatusLabel }
            : r
        )
      };
    });
    saveToStorageInternal(get());
  },

  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    }));
    saveToStorageInternal(get());
  },

  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true }))
    }));
    saveToStorageInternal(get());
  },

  addNotification: (notification) => {
    const newNotif: NotificationItem = {
      id: Date.now().toString(),
      ...notification,
      createdAt: nowStr(),
      isRead: false
    };
    set((state) => ({ notifications: [newNotif, ...state.notifications] }));
    saveToStorageInternal(get());
  }
}));

export { nowStr, nowDateStr };
