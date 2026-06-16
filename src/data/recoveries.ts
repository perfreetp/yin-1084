import type { RecoveryItem } from '@/types';

export const mockRecoveries: RecoveryItem[] = [
  {
    id: '1',
    templateName: 'Scratch编程模板',
    className: '七年级1班',
    targetDevices: 45,
    completedDevices: 45,
    status: 'completed',
    statusLabel: '已完成',
    createdAt: '2026-06-12 09:00',
    fileSize: '128MB'
  },
  {
    id: '2',
    templateName: 'Python教学环境',
    className: '八年级1班',
    targetDevices: 45,
    completedDevices: 30,
    status: 'in_progress',
    statusLabel: '恢复中',
    createdAt: '2026-06-14 10:30',
    fileSize: '256MB'
  },
  {
    id: '3',
    templateName: 'Office办公模板',
    className: '全年级',
    targetDevices: 180,
    completedDevices: 0,
    status: 'pending',
    statusLabel: '待开始',
    createdAt: '2026-06-15 08:00',
    fileSize: '64MB'
  },
  {
    id: '4',
    templateName: '信息学竞赛工具',
    className: '竞赛小组A',
    targetDevices: 20,
    completedDevices: 20,
    status: 'completed',
    statusLabel: '已完成',
    createdAt: '2026-06-11 14:00',
    fileSize: '512MB'
  },
  {
    id: '5',
    templateName: 'Photoshop教学素材',
    className: '八年级3班',
    targetDevices: 45,
    completedDevices: 12,
    status: 'in_progress',
    statusLabel: '恢复中',
    createdAt: '2026-06-14 15:00',
    fileSize: '380MB'
  },
  {
    id: '6',
    templateName: '打字练习软件',
    className: '五年级2班',
    targetDevices: 42,
    completedDevices: 42,
    status: 'completed',
    statusLabel: '已完成',
    createdAt: '2026-06-10 09:00',
    fileSize: '32MB'
  },
  {
    id: '7',
    templateName: '机器人编程工具',
    className: '竞赛小组B',
    targetDevices: 15,
    completedDevices: 0,
    status: 'pending',
    statusLabel: '待开始',
    createdAt: '2026-06-15 16:00',
    fileSize: '290MB'
  },
  {
    id: '8',
    templateName: '电子表格模板',
    className: '七年级2班',
    targetDevices: 45,
    completedDevices: 45,
    status: 'completed',
    statusLabel: '已完成',
    createdAt: '2026-06-09 11:00',
    fileSize: '16MB'
  },
  {
    id: '9',
    templateName: '多媒体教学课件',
    className: '六年级1班',
    targetDevices: 40,
    completedDevices: 40,
    status: 'completed',
    statusLabel: '已完成',
    createdAt: '2026-06-08 10:00',
    fileSize: '445MB'
  },
  {
    id: '10',
    templateName: '网络基础实验包',
    className: '八年级2班',
    targetDevices: 45,
    completedDevices: 0,
    status: 'pending',
    statusLabel: '待开始',
    createdAt: '2026-06-16 08:30',
    fileSize: '178MB'
  }
];
