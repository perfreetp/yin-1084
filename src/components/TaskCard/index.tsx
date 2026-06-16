import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { TaskItem } from '@/types';
import { getTaskTypeIcon, calcProgress } from '@/utils';

interface TaskCardProps {
  task: TaskItem;
  onClick?: (task: TaskItem) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const progress = calcProgress(task.completedDevices, task.totalDevices);

  return (
    <View className={styles.card} onClick={() => onClick?.(task)}>
      <View className={styles.header}>
        <View className={styles.left}>
          <Text className={styles.icon}>{getTaskTypeIcon(task.taskType)}</Text>
          <View className={styles.info}>
            <Text className={styles.className}>{task.className}</Text>
            <Text className={styles.taskType}>{task.taskTypeLabel}</Text>
          </View>
        </View>
        <View
          className={classnames(styles.statusBadge, {
            [styles.statusCompleted]: task.status === 'completed',
            [styles.statusInProgress]: task.status === 'in_progress',
            [styles.statusPending]: task.status === 'pending',
            [styles.statusArchived]: task.status === 'archived'
          })}
        >
          <Text className={styles.statusText}>{task.statusLabel}</Text>
        </View>
      </View>

      <Text className={styles.description}>{task.description}</Text>

      <View className={styles.progressSection}>
        <View className={styles.progressInfo}>
          <Text className={styles.progressLabel}>备份进度</Text>
          <Text className={styles.progressValue}>{task.completedDevices}/{task.totalDevices}台</Text>
        </View>
        <View className={styles.progressBar}>
          <View className={styles.progressFill} style={{ width: `${progress}%` }} />
        </View>
      </View>

      <View className={styles.footer}>
        <Text className={styles.date}>{task.createdAt}</Text>
      </View>
    </View>
  );
};

export default TaskCard;
