import type { TaskItem } from '@/types';

export const mockTasks: TaskItem[] = [
  {
    id: '1',
    className: '七年级1班',
    taskType: 'semester',
    taskTypeLabel: '学期更替',
    status: 'in_progress',
    statusLabel: '进行中',
    totalDevices: 45,
    completedDevices: 32,
    createdAt: '2026-06-10',
    description: '2025-2026学年第二学期结束数据迁移'
  },
  {
    id: '2',
    className: '八年级3班',
    taskType: 'reinstall',
    taskTypeLabel: '机房重装',
    status: 'pending',
    statusLabel: '待开始',
    totalDevices: 45,
    completedDevices: 0,
    createdAt: '2026-06-12',
    description: '机房3系统重装前数据备份'
  },
  {
    id: '3',
    className: '竞赛小组A',
    taskType: 'contest',
    taskTypeLabel: '竞赛培训',
    status: 'completed',
    statusLabel: '已完成',
    totalDevices: 20,
    completedDevices: 20,
    createdAt: '2026-05-20',
    description: '信息学竞赛培训作品归档'
  },
  {
    id: '4',
    className: '七年级2班',
    taskType: 'semester',
    taskTypeLabel: '学期更替',
    status: 'in_progress',
    statusLabel: '进行中',
    totalDevices: 45,
    completedDevices: 18,
    createdAt: '2026-06-10',
    description: '2025-2026学年第二学期结束数据迁移'
  },
  {
    id: '5',
    className: '六年级1班',
    taskType: 'semester',
    taskTypeLabel: '学期更替',
    status: 'archived',
    statusLabel: '已封存',
    totalDevices: 40,
    completedDevices: 40,
    createdAt: '2026-01-15',
    description: '2024-2025学年第一学期封存'
  },
  {
    id: '6',
    className: '八年级1班',
    taskType: 'reinstall',
    taskTypeLabel: '机房重装',
    status: 'in_progress',
    statusLabel: '进行中',
    totalDevices: 45,
    completedDevices: 38,
    createdAt: '2026-06-08',
    description: '机房1系统升级前数据备份'
  },
  {
    id: '7',
    className: '竞赛小组B',
    taskType: 'contest',
    taskTypeLabel: '竞赛培训',
    status: 'pending',
    statusLabel: '待开始',
    totalDevices: 15,
    completedDevices: 0,
    createdAt: '2026-06-15',
    description: '机器人竞赛培训资料备份'
  },
  {
    id: '8',
    className: '七年级3班',
    taskType: 'semester',
    taskTypeLabel: '学期更替',
    status: 'in_progress',
    statusLabel: '进行中',
    totalDevices: 44,
    completedDevices: 44,
    createdAt: '2026-06-11',
    description: '2025-2026学年第二学期结束数据迁移'
  },
  {
    id: '9',
    className: '五年级2班',
    taskType: 'semester',
    taskTypeLabel: '学期更替',
    status: 'archived',
    statusLabel: '已封存',
    totalDevices: 42,
    completedDevices: 42,
    createdAt: '2026-01-10',
    description: '2024-2025学年第一学期封存'
  },
  {
    id: '10',
    className: '八年级2班',
    taskType: 'reinstall',
    taskTypeLabel: '机房重装',
    status: 'pending',
    statusLabel: '待开始',
    totalDevices: 45,
    completedDevices: 0,
    createdAt: '2026-06-14',
    description: '机房2批量重装前备份'
  }
];
