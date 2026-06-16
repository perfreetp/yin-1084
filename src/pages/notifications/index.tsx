import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store/useAppStore';
import type { NotificationType } from '@/types';
import { getNotificationIcon } from '@/utils';

const TYPE_FILTERS = [
  { value: 'all', label: '全部' },
  { value: 'backup', label: '备份通知' },
  { value: 'recovery', label: '恢复通知' },
  { value: 'warning', label: '超大文件' },
  { value: 'missed', label: '遗漏提醒' }
];

const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppStore();
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredNotifications = useMemo(() => {
    if (typeFilter === 'all') return notifications;
    return notifications.filter((n) => n.type === typeFilter);
  }, [notifications, typeFilter]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    if (notification && !notification.isRead) {
      markNotificationRead(id);
    }
    console.info('[Notifications] Notification clicked:', id);
  };

  const handleMarkAllRead = () => {
    if (unreadCount === 0) {
      Taro.showToast({ title: '没有未读通知', icon: 'none' });
      return;
    }
    markAllNotificationsRead();
    Taro.showToast({ title: '已全部标记为已读', icon: 'success' });
  };

  const getTypeTagStyle = (type: NotificationType) => {
    const map: Record<string, string> = {
      backup: styles.tagBackup,
      recovery: styles.tagRecovery,
      warning: styles.tagWarning,
      missed: styles.tagMissed
    };
    return map[type] || styles.tagBackup;
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.headerLeft}>
          <Text className={styles.headerTitle}>通知记录</Text>
          <Text className={styles.headerSub}>
            {unreadCount > 0 ? `${unreadCount}条未读` : '暂无未读通知'}
          </Text>
        </View>
        <View className={styles.markAllBtn} onClick={handleMarkAllRead}>
          <Text className={styles.markAllText}>全部已读</Text>
        </View>
      </View>

      <View className={styles.filterRow}>
        <ScrollView scrollX style={{ width: '100%' }}>
          <View style={{ display: 'flex', gap: '16rpx' }}>
            {TYPE_FILTERS.map((f) => (
              <View
                key={f.value}
                className={classnames(styles.filterChip, {
                  [styles.filterChipActive]: typeFilter === f.value
                })}
                onClick={() => setTypeFilter(f.value)}
              >
                <Text
                  className={classnames(styles.filterChipText, {
                    [styles.filterChipTextActive]: typeFilter === f.value
                  })}
                >
                  {f.label}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className={styles.notificationList}>
        {filteredNotifications.map((notification) => (
          <View
            key={notification.id}
            className={classnames(styles.notificationCard, {
              [styles.notificationUnread]: !notification.isRead
            })}
            onClick={() => handleNotificationClick(notification.id)}
          >
            {!notification.isRead && <View className={styles.unreadDot} />}
            <View className={styles.notificationHeader}>
              <Text className={styles.notificationIcon}>
                {getNotificationIcon(notification.type)}
              </Text>
              <View className={classnames(styles.notificationTypeTag, getTypeTagStyle(notification.type))}>
                <Text className={styles.notificationTypeText}>{notification.typeLabel}</Text>
              </View>
              <Text className={styles.notificationTime}>{notification.createdAt}</Text>
            </View>
            <Text className={styles.notificationTitle}>{notification.title}</Text>
            <Text className={styles.notificationDesc}>{notification.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default NotificationsPage;
