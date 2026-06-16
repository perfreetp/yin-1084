import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store/useAppStore';
import TaskCard from '@/components/TaskCard';
import StatCard from '@/components/StatCard';
import type { TaskItem, TaskType } from '@/types';

const TASK_TYPE_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'semester', label: '学期更替' },
  { value: 'reinstall', label: '机房重装' },
  { value: 'contest', label: '竞赛培训' }
];

const TasksPage: React.FC = () => {
  const { tasks, addTask } = useAppStore();
  const [activeFilter, setActiveFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newTaskType, setNewTaskType] = useState<TaskType>('semester');
  const [newDescription, setNewDescription] = useState('');

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

    const newTask: TaskItem = {
      id: Date.now().toString(),
      className: newClassName.trim(),
      taskType: newTaskType,
      taskTypeLabel: taskTypeLabelMap[newTaskType],
      status: 'pending',
      statusLabel: '待开始',
      totalDevices: 0,
      completedDevices: 0,
      createdAt: new Date().toISOString().split('T')[0],
      description: newDescription.trim() || `${newClassName.trim()}${taskTypeLabelMap[newTaskType]}任务`
    };

    addTask(newTask);
    setShowModal(false);
    setNewClassName('');
    setNewDescription('');
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
              <Text className={styles.formLabel}>任务说明</Text>
              <Input
                className={styles.formInput}
                placeholder="简要描述任务内容"
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
