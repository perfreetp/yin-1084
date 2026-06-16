import type { DeviceItem } from '@/types';

export const mockDevices: DeviceItem[] = [
  {
    id: '1',
    deviceNo: 'JF1-01',
    className: '七年级1班',
    studentName: '张小明',
    status: 'completed',
    statusLabel: '已备份',
    backupTime: '2026-06-10 14:30',
    taskType: '学期更替',
    hasOversizeFile: false,
    oversizeFiles: []
  },
  {
    id: '2',
    deviceNo: 'JF1-02',
    className: '七年级1班',
    studentName: '李小红',
    status: 'completed',
    statusLabel: '已备份',
    backupTime: '2026-06-10 14:35',
    taskType: '学期更替',
    hasOversizeFile: true,
    oversizeFiles: ['视频作品.mp4 (2.3GB)']
  },
  {
    id: '3',
    deviceNo: 'JF1-03',
    className: '七年级1班',
    studentName: '王大力',
    status: 'partial',
    statusLabel: '部分备份',
    backupTime: '2026-06-10 14:40',
    taskType: '学期更替',
    hasOversizeFile: false,
    oversizeFiles: []
  },
  {
    id: '4',
    deviceNo: 'JF1-04',
    className: '七年级1班',
    studentName: '赵小丽',
    status: 'unbackup',
    statusLabel: '未备份',
    backupTime: '',
    taskType: '学期更替',
    hasOversizeFile: false,
    oversizeFiles: []
  },
  {
    id: '5',
    deviceNo: 'JF1-05',
    className: '七年级1班',
    studentName: '孙一鸣',
    status: 'completed',
    statusLabel: '已备份',
    backupTime: '2026-06-10 15:00',
    taskType: '学期更替',
    hasOversizeFile: false,
    oversizeFiles: []
  },
  {
    id: '6',
    deviceNo: 'JF2-01',
    className: '八年级3班',
    studentName: '刘思远',
    status: 'unbackup',
    statusLabel: '未备份',
    backupTime: '',
    taskType: '机房重装',
    hasOversizeFile: false,
    oversizeFiles: []
  },
  {
    id: '7',
    deviceNo: 'JF2-02',
    className: '八年级3班',
    studentName: '陈雨涵',
    status: 'unbackup',
    statusLabel: '未备份',
    backupTime: '',
    taskType: '机房重装',
    hasOversizeFile: true,
    oversizeFiles: ['Scratch项目.sb3 (580MB)']
  },
  {
    id: '8',
    deviceNo: 'JF2-03',
    className: '八年级3班',
    studentName: '杨子轩',
    status: 'unbackup',
    statusLabel: '未备份',
    backupTime: '',
    taskType: '机房重装',
    hasOversizeFile: false,
    oversizeFiles: []
  },
  {
    id: '9',
    deviceNo: 'JS-A01',
    className: '竞赛小组A',
    studentName: '周子墨',
    status: 'completed',
    statusLabel: '已备份',
    backupTime: '2026-05-20 10:15',
    taskType: '竞赛培训',
    hasOversizeFile: true,
    oversizeFiles: ['C++项目编译文件 (1.2GB)']
  },
  {
    id: '10',
    deviceNo: 'JS-A02',
    className: '竞赛小组A',
    studentName: '吴思琪',
    status: 'completed',
    statusLabel: '已备份',
    backupTime: '2026-05-20 10:20',
    taskType: '竞赛培训',
    hasOversizeFile: false,
    oversizeFiles: []
  },
  {
    id: '11',
    deviceNo: 'JF1-06',
    className: '七年级1班',
    studentName: '黄思远',
    status: 'completed',
    statusLabel: '已备份',
    backupTime: '2026-06-10 15:10',
    taskType: '学期更替',
    hasOversizeFile: false,
    oversizeFiles: []
  },
  {
    id: '12',
    deviceNo: 'JF1-07',
    className: '七年级1班',
    studentName: '马文博',
    status: 'partial',
    statusLabel: '部分备份',
    backupTime: '2026-06-10 15:20',
    taskType: '学期更替',
    hasOversizeFile: false,
    oversizeFiles: []
  }
];
