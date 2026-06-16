import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store/useAppStore';
import type { RecoveryItem } from '@/types';
import { calcProgress } from '@/utils';

const nowDateStr = () => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const RecoveryPage: React.FC = () => {
  const { recoveries, addRecovery, updateRecoveryProgress, addNotification } = useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [targetClassName, setTargetClassName] = useState('');
  const [deviceCount, setDeviceCount] = useState('45');
  const [fileSize, setFileSize] = useState('128MB');

  const progressTimersRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  const completedCount = recoveries.filter((r) => r.status === 'completed').length;
  const inProgressCount = recoveries.filter((r) => r.status === 'in_progress').length;
  const pendingCount = recoveries.filter((r) => r.status === 'pending').length;

  const startRecoveryProgress = (recoveryId: string, totalDevices: number) => {
    if (progressTimersRef.current[recoveryId]) {
      clearInterval(progressTimersRef.current[recoveryId]);
    }

    let completed = 0;
    progressTimersRef.current[recoveryId] = setInterval(() => {
      completed += Math.floor(Math.random() * 3) + 1;
      if (completed >= totalDevices) {
        completed = totalDevices;
        clearInterval(progressTimersRef.current[recoveryId]);
        delete progressTimersRef.current[recoveryId];
        addNotification({
          type: 'recovery',
          typeLabel: '恢复完成',
          title: '恢复任务完成',
          description: `${totalDevices}台设备已全部恢复完成`
        });
      }
      updateRecoveryProgress(recoveryId, completed);
    }, 1500);
  };

  useEffect(() => {
    return () => {
      Object.values(progressTimersRef.current).forEach((timer) => {
        if (timer) clearInterval(timer);
      });
    };
  }, []);

  const handleQuickAction = (type: string) => {
    const templates: Record<string, { name: string; size: string; devices: number; className: string }> = {
      template: { name: '统一下发教学模板', size: '256MB', devices: 45, className: '七年级1班' },
      batch: { name: '批量恢复常用文件', size: '180MB', devices: 45, className: '全年级' },
      check: { name: '状态检查', size: '0MB', devices: 45, className: '全年级' }
    };

    if (type === 'check') {
      Taro.showToast({ title: `共${recoveries.length}条恢复记录`, icon: 'none' });
      return;
    }

    const config = templates[type];
    const recoveryId = Date.now().toString();

    const newRecovery: RecoveryItem = {
      id: recoveryId,
      templateName: config.name,
      className: config.className,
      targetDevices: config.devices,
      completedDevices: 0,
      status: 'in_progress',
      statusLabel: '恢复中',
      createdAt: nowDateStr(),
      fileSize: config.size
    };

    addRecovery(newRecovery);
    addNotification({
      type: 'recovery',
      typeLabel: '恢复开始',
      title: `${config.name}已开始`,
      description: `目标${config.devices}台设备，正在恢复中...`
    });

    startRecoveryProgress(recoveryId, config.devices);

    setShowCreateModal(false);
    Taro.showToast({ title: '恢复任务已开始', icon: 'success' });
  };

  const handleCreateRecovery = () => {
    if (!templateName.trim()) {
      Taro.showToast({ title: '请输入模板名称', icon: 'none' });
      return;
    }

    const count = parseInt(deviceCount, 10) || 0;
    if (count <= 0 || count > 200) {
      Taro.showToast({ title: '设备数量需在1-200之间', icon: 'none' });
      return;
    }

    const recoveryId = Date.now().toString();
    const classNameVal = targetClassName.trim() || '全年级';

    const newRecovery: RecoveryItem = {
      id: recoveryId,
      templateName: templateName.trim(),
      className: classNameVal,
      targetDevices: count,
      completedDevices: 0,
      status: 'in_progress',
      statusLabel: '恢复中',
      createdAt: nowDateStr(),
      fileSize: fileSize.trim() || '100MB'
    };

    addRecovery(newRecovery);
    addNotification({
      type: 'recovery',
      typeLabel: '恢复开始',
      title: `${templateName.trim()}恢复已开始`,
      description: `目标${count}台设备`
    });

    startRecoveryProgress(recoveryId, count);

    setShowCreateModal(false);
    setTemplateName('');
    setTargetClassName('');
    setDeviceCount('45');
    setFileSize('128MB');

    Taro.showToast({ title: '恢复任务已开始', icon: 'success' });
  };

  const handleRecoveryClick = (item: RecoveryItem) => {
    console.info('[Recovery] Recovery clicked:', item.id);
    if (item.status === 'pending') {
      Taro.showModal({
        title: '开始恢复',
        content: `确定开始恢复 ${item.templateName} 到 ${item.targetDevices} 台设备？`,
        confirmColor: '#2BA471',
        success: (res) => {
          if (res.confirm) {
            startRecoveryProgress(item.id, item.targetDevices);
          }
        }
      });
    } else if (item.status === 'completed') {
      Taro.showToast({ title: `${item.templateName} - 已完成`, icon: 'none' });
    } else {
      Taro.showToast({ title: `正在恢复中 ${item.completedDevices}/${item.targetDevices}`, icon: 'none' });
    }
  };

  const sortedRecoveries = useMemo(() => {
    return [...recoveries].sort((a, b) => {
      const aDate = new Date(a.createdAt).getTime();
      const bDate = new Date(b.createdAt).getTime();
      return bDate - aDate;
    });
  }, [recoveries]);

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
          <View className={styles.actionCard} onClick={() => setShowCreateModal(true)}>
            <Text className={styles.actionIcon}>➕</Text>
            <Text className={styles.actionName}>新建任务</Text>
            <Text className={styles.actionDesc}>自定义恢复任务</Text>
          </View>
        </View>
      </View>

      <Text className={styles.sectionTitle}>恢复记录</Text>
      <ScrollView scrollY className={styles.recoveryList}>
        {sortedRecoveries.map((item) => {
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
                    {item.completedDevices}/{item.targetDevices}台 ({progress}%)
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
      </ScrollView>

      {showCreateModal && (
        <View className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <View className={styles.modalContent} onClick={(e) => { e.stopPropagation(); }}>
            <Text className={styles.modalTitle}>创建恢复任务</Text>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>模板名称</Text>
              <Input
                className={styles.formInput}
                placeholder="如：Scratch编程模板"
                value={templateName}
                onInput={(e) => setTemplateName(e.detail.value)}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>目标班级</Text>
              <Input
                className={styles.formInput}
                placeholder="如：七年级1班（选填）"
                value={targetClassName}
                onInput={(e) => setTargetClassName(e.detail.value)}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>设备数量</Text>
              <Input
                className={styles.formInput}
                type="number"
                placeholder="请输入设备台数"
                value={deviceCount}
                onInput={(e) => setDeviceCount(e.detail.value)}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>文件大小</Text>
              <Input
                className={styles.formInput}
                placeholder="如：128MB（选填）"
                value={fileSize}
                onInput={(e) => setFileSize(e.detail.value)}
              />
            </View>

            <View className={styles.submitBtn} onClick={handleCreateRecovery}>
              <Text className={styles.submitText}>开始恢复</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default RecoveryPage;
