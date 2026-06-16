import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store/useAppStore';
import type { RecoveryItem } from '@/types';
import { calcProgress } from '@/utils';

const RecoveryPage: React.FC = () => {
  const { recoveries } = useAppStore();

  const completedCount = recoveries.filter((r) => r.status === 'completed').length;
  const inProgressCount = recoveries.filter((r) => r.status === 'in_progress').length;
  const pendingCount = recoveries.filter((r) => r.status === 'pending').length;

  const handleQuickAction = (type: string) => {
    const actionMap: Record<string, string> = {
      template: '统一下发模板',
      batch: '批量恢复文件',
      check: '检查恢复状态'
    };
    Taro.showToast({ title: `${actionMap[type]}功能准备中`, icon: 'none' });
  };

  const handleRecoveryClick = (item: RecoveryItem) => {
    console.info('[Recovery] Recovery clicked:', item.id);
    Taro.showToast({ title: `${item.templateName} - ${item.statusLabel}`, icon: 'none' });
  };

  return (
    <View className={styles.container}>
      <View className={styles.headerSection}>
        <Text className={styles.headerTitle}>恢复操作</Text>
        <View className={styles.headerStats}>
          <View className={styles.headerStat}>
            <Text className={styles.headerStatValue}>{completedCount}</Text>
            <Text className={styles.headerStatLabel}>已完成</Text>
          </View>
          <View className={styles.headerStat}>
            <Text className={styles.headerStatValue}>{inProgressCount}</Text>
            <Text className={styles.headerStatLabel}>恢复中</Text>
          </View>
          <View className={styles.headerStat}>
            <Text className={styles.headerStatValue}>{pendingCount}</Text>
            <Text className={styles.headerStatLabel}>待开始</Text>
          </View>
        </View>
      </View>

      <View className={styles.quickActions}>
        <Text className={styles.quickTitle}>快速操作</Text>
        <View className={styles.actionGrid}>
          <View className={styles.actionCard} onClick={() => handleQuickAction('template')}>
            <Text className={styles.actionIcon}>📋</Text>
            <Text className={styles.actionName}>下发模板</Text>
            <Text className={styles.actionDesc}>统一下发恢复模板</Text>
          </View>
          <View className={styles.actionCard} onClick={() => handleQuickAction('batch')}>
            <Text className={styles.actionIcon}>📦</Text>
            <Text className={styles.actionName}>批量恢复</Text>
            <Text className={styles.actionDesc}>一键恢复常用文件</Text>
          </View>
          <View className={styles.actionCard} onClick={() => handleQuickAction('check')}>
            <Text className={styles.actionIcon}>🔍</Text>
            <Text className={styles.actionName}>状态检查</Text>
            <Text className={styles.actionDesc}>检查恢复结果</Text>
          </View>
        </View>
      </View>

      <Text className={styles.sectionTitle}>恢复记录</Text>
      <View className={styles.recoveryList}>
        {recoveries.map((item) => {
          const progress = calcProgress(item.completedDevices, item.targetDevices);
          return (
            <View
              key={item.id}
              className={styles.recoveryCard}
              onClick={() => handleRecoveryClick(item)}
            >
              <View className={styles.recoveryHeader}>
                <View className={styles.recoveryLeft}>
                  <Text className={styles.recoveryIcon}>📁</Text>
                  <View className={styles.recoveryInfo}>
                    <Text className={styles.recoveryName}>{item.templateName}</Text>
                    <Text className={styles.recoveryClass}>{item.className}</Text>
                  </View>
                </View>
                <View
                  className={classnames(styles.recoveryStatus, {
                    [styles.statusCompletedBg]: item.status === 'completed',
                    [styles.statusInProgressBg]: item.status === 'in_progress',
                    [styles.statusPendingBg]: item.status === 'pending'
                  })}
                >
                  <Text className={styles.recoveryStatusText}>{item.statusLabel}</Text>
                </View>
              </View>

              <View className={styles.recoveryProgress}>
                <View className={styles.recoveryProgressInfo}>
                  <Text className={styles.recoveryProgressLabel}>恢复进度</Text>
                  <Text className={styles.recoveryProgressValue}>
                    {item.completedDevices}/{item.targetDevices}台
                  </Text>
                </View>
                <View className={styles.recoveryProgressBar}>
                  <View
                    className={styles.recoveryProgressFill}
                    style={{ width: `${progress}%` }}
                  />
                </View>
              </View>

              <View className={styles.recoveryFooter}>
                <Text className={styles.recoveryDate}>{item.createdAt}</Text>
                <Text className={styles.recoverySize}>{item.fileSize}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default RecoveryPage;
