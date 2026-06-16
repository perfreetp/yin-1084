import type { NotificationItem } from '@/types';

export const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'backup',
    typeLabel: '备份完成',
    title: '七年级1班备份完成',
    description: '32台设备已完成备份，13台待处理',
    createdAt: '2026-06-10 15:30',
    isRead: false
  },
  {
    id: '2',
    type: 'warning',
    typeLabel: '超大文件',
    title: '李小红设备发现超大文件',
    description: '视频作品.mp4 大小为2.3GB，建议单独处理',
    createdAt: '2026-06-10 14:36',
    isRead: false
  },
  {
    id: '3',
    type: 'missed',
    typeLabel: '遗漏提醒',
    title: 'JF1-04设备未备份',
    description: '赵小丽同学的设备尚未完成备份，请及时处理',
    createdAt: '2026-06-10 16:00',
    isRead: true
  },
  {
    id: '4',
    type: 'recovery',
    typeLabel: '恢复完成',
    title: 'Scratch模板下发完成',
    description: '七年级1班45台设备已全部恢复Scratch编程模板',
    createdAt: '2026-06-12 09:45',
    isRead: true
  },
  {
    id: '5',
    type: 'backup',
    typeLabel: '备份完成',
    title: '竞赛小组A归档完成',
    description: '20台设备全部备份完毕，已自动归档',
    createdAt: '2026-05-20 11:00',
    isRead: true
  },
  {
    id: '6',
    type: 'warning',
    typeLabel: '超大文件',
    title: '周子墨设备发现超大文件',
    description: 'C++项目编译文件大小1.2GB，建议单独备份',
    createdAt: '2026-05-20 10:18',
    isRead: true
  },
  {
    id: '7',
    type: 'missed',
    typeLabel: '遗漏提醒',
    title: '八年级3班设备全部未备份',
    description: '机房重装任务已创建，但45台设备均未开始备份',
    createdAt: '2026-06-13 08:00',
    isRead: false
  },
  {
    id: '8',
    type: 'recovery',
    typeLabel: '恢复进行中',
    title: 'Python教学环境恢复中',
    description: '八年级1班已恢复30/45台设备',
    createdAt: '2026-06-14 11:00',
    isRead: false
  },
  {
    id: '9',
    type: 'backup',
    typeLabel: '备份完成',
    title: '七年级3班全部备份完成',
    description: '44台设备已全部完成备份，可进行学期封存',
    createdAt: '2026-06-11 16:30',
    isRead: true
  },
  {
    id: '10',
    type: 'missed',
    typeLabel: '遗漏提醒',
    title: '马文博设备部分备份',
    description: 'JF1-07设备仅完成桌面备份，文档资料尚未备份',
    createdAt: '2026-06-10 15:25',
    isRead: true
  }
];
