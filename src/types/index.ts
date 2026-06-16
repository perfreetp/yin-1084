export type TaskType = 'semester' | 'reinstall' | 'contest';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'archived';

export interface TaskItem {
  id: string;
  className: string;
  taskType: TaskType;
  taskTypeLabel: string;
  status: TaskStatus;
  statusLabel: string;
  totalDevices: number;
  completedDevices: number;
  createdAt: string;
  description: string;
}

export type DeviceStatus = 'unbackup' | 'partial' | 'completed';

export interface DeviceItem {
  id: string;
  deviceNo: string;
  className: string;
  studentName: string;
  status: DeviceStatus;
  statusLabel: string;
  backupTime: string;
  taskType: string;
  hasOversizeFile: boolean;
  oversizeFiles: string[];
}

export type BackupCategory = 'desktop' | 'documents' | 'custom' | 'teacher' | 'student';

export interface BackupItem {
  id: string;
  studentName: string;
  className: string;
  category: BackupCategory;
  categoryLabel: string;
  fileSize: string;
  fileCount: number;
  createdAt: string;
  isOversize: boolean;
  isArchived: boolean;
  isSelected: boolean;
  ownerType: 'teacher' | 'student';
}

export interface RecoveryItem {
  id: string;
  templateName: string;
  className: string;
  targetDevices: number;
  completedDevices: number;
  status: 'pending' | 'in_progress' | 'completed';
  statusLabel: string;
  createdAt: string;
  fileSize: string;
}

export type NotificationType = 'backup' | 'recovery' | 'warning' | 'missed';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  typeLabel: string;
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
}
