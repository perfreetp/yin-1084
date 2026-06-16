import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store/useAppStore';
import TaskCard from '@/components/TaskCard';
import StatCard from '@/components/StatCard';
import type { TaskItem, TaskType, DeviceItem } from '@/types';

const TASK_TYPE_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'semester', label: '学期更替' },
  { value: 'reinstall', label: '机房重装' },
  { value: 'contest', label: '竞赛培训' }
];

const SAMPLE_NAMES = [
  '张小明', '李小红', '王大力', '赵小丽', '孙一鸣',
  '刘思远', '陈雨涵', '杨子轩', '周子墨', '吴思琪',
  '黄思远', '马文博', '徐子涵', '孙浩然', '朱雨婷',
  '胡俊杰', '林诗涵', '郭博文', '何雨轩', '高梦瑶',
  '罗思成', '梁佳怡', '宋雨泽', '郑子萱', '谢雨阳',
  '唐子豪', '韩思语', '曹雨欣', '许子轩', '邓雨彤',
  '冯思远', '袁雨涵', '董子墨', '肖雨泽', '程思琪',
  '潘博文', '田子琪', '蒋雨晨', '蔡子涵', '余思妍',
  '杜雨泽', '叶思成', '程雨欣', '苏子墨', '魏雨彤'
];

const generateDevices = (
  className: string,
  taskTypeLabel: string,
  count: number,
  taskId: string
): DeviceItem[] => {
  const devices: DeviceItem[] = [];
  const pad = (n: number) => n.toString().padStart(2, '0');

  for (let i = 0; i < count; i++) {
    const deviceNo = `JF${taskId.slice(-2)}-${pad(i + 1)}`;
    const studentName = SAMPLE_NAMES[i % SAMPLE_NAMES.length];
    devices.push({
      id: `${taskId}-${i}`,
      deviceNo,
      className,
      studentName,
      status: 'unbackup',
      statusLabel: '未备份',
      backupTime: '',
      taskType: taskTypeLabel,
      hasOversizeFile: false,
      oversizeFiles: []
    });
  }
  return devices;
};

const nowDateStr = () => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const TasksPage: React.FC = () => {
  const { tasks, addTask, addNotification } = useAppStore();
  const [activeFilter, setActiveFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newTaskType, setNewTaskType] = useState<TaskType>('semester');
  const [newDescription, setNewDescription] = useState('');
  const [deviceCount, setDeviceCount] = useState('45');

  const filteredTasks = useMemo(() => {
    if (activeFilter === 'all') return tasks;
    return tasks.filter((t) => t.taskType === activeFilter);
  }, [tasks, activeFilter]);

  const activeTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;

  const taskTypeLabelMap: Record<TaskType, string> = {
    semester: '学期更替',
    reinstall: '机房重装',
    contest: '竞赛培训'
  };

  const handleTaskClick = (task: TaskItem) => {
    console.info('[Tasks] Task clicked:', task.id);
    Taro.showToast({ title: `${task.className} - ${task.taskTypeLabel}`, icon: 'none' });
  };

  const handleCreateTask = () => {
    if (!newClassName.trim()) {
      Taro.showToast({ title: '请输入班级名称', icon: 'none' });
      return;
    }

    const count = parseInt(deviceCount, 10) || 0;
    if (count <= 0 || count > 100) {
      Taro.showToast({ title: '设备数量需在1-100之间', icon: 'none' });
      return;
    }

    const taskId = Date.now().toString();
    const taskTypeLabel = taskTypeLabelMap[newTaskType];

    const newTask: TaskItem = {
      id: taskId,
      className: newClassName.trim(),
      taskType: newTaskType,
      taskTypeLabel,
      status: 'pending',
      statusLabel: '待开始',
      totalDevices: count,
      completedDevices: 0,
      createdAt: nowDateStr(),
      description: newDescription.trim() || `${newClassName.trim()}${taskTypeLabel}任务`
    };

    const devices = generateDevices(newClassName.trim(), taskTypeLabel, count, taskId);

    addTask(newTask, devices);

    addNotification({
      type: 'backup',
      typeLabel: '任务创建',
      title: `${newClassName.trim()}${taskTypeLabel}任务已创建`,
      description: `共${count}台设备待备份`
    });

    setShowModal(false);
    setNewClassName('');
    setNewDescription('');
    setDeviceCount('45');

    Taro.showToast({ title: '任务创建成功', icon: 'success' });
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.greeting}>机房数据助手</Text>
        <Text className={styles.subGreeting}>学期更替，数据无忧</Text>
      </View>

      <View className={styles.statsRow}>
        <StatCard label="进行中" value={activeTasks} color="#4080FF" />
        <StatCard label="已完成" value={completedTasks} color="#00b42a" />
        <StatCard label="待开始" value={pendingTasks} color="#ff7d00" />
      </View>

      <View className={styles.filterSection}>
        <Text className={styles.filterLabel}>任务类型</Text>
        <ScrollView scrollX className={styles.filterScroll}>
          {TASK_TYPE_OPTIONS.map((opt) => (
            <View
              key={opt.value}
              className={classnames(styles.filterItem, {
                [styles.filterItemActive]: activeFilter === opt.value
              })}
              onClick={() => setActiveFilter(opt.value)}
            >
              <Text
                className={classnames(styles.filterText, {
                  [styles.filterTextActive]: activeFilter === opt.value
                })}
              >
                {opt.label}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.taskList}>
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
        ))}
      </View>

      <View className={styles.createButton} onClick={() => setShowModal(true)}>
        <Text className={styles.createButtonText}>+</Text>
      </View>

      {showModal && (
        <View className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <View className={styles.modalContent} onClick={(e) => { e.stopPropagation(); }}>
            <Text className={styles.modalTitle}>创建迁移任务</Text>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>班级名称</Text>
              <Input
                className={styles.formInput}
                placeholder="如：七年级1班"
                value={newClassName}
                onInput={(e) => setNewClassName(e.detail.value)}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>任务类型</Text>
              <View className={styles.typeRow}>
                {(['semester', 'reinstall', 'contest'] as TaskType[]).map((type) => (
                  <View
                    key={type}
                    className={classnames(styles.typeItem, {
                      [styles.typeItemActive]: newTaskType === type
                    })}
                    onClick={() => setNewTaskType(type)}
                  >
                    <Text
                      className={classnames(styles.typeText, {
                        [styles.typeTextActive]: newTaskType === type
                      })}
                    >
                      {taskTypeLabelMap[type]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>设备数量</Text>
              <Input
                className={styles.formInput}
                type="number"
                placeholder="请输入设备台数，默认45台"
                value={deviceCount}
                onInput={(e) => setDeviceCount(e.detail.value)}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>任务说明</Text>
              <Input
                className={styles.formInput}
                placeholder="简要描述任务内容（选填）"
                value={newDescription}
                onInput={(e) => setNewDescription(e.detail.value)}
              />
            </View>

            <View className={styles.submitBtn} onClick={handleCreateTask}>
              <Text className={styles.submitText}>确认创建</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default TasksPage;
