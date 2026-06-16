import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store/useAppStore';
import DeviceItemComponent from '@/components/DeviceItem';
import type { DeviceItem as DeviceItemType } from '@/types';

const STATUS_FILTERS = [
  { value: 'all', label: '全部' },
  { value: 'completed', label: '已备份' },
  { value: 'partial', label: '部分备份' },
  { value: 'unbackup', label: '未备份' }
];

const DevicesPage: React.FC = () => {
  const { devices } = useAppStore();
  const [statusFilter, setStatusFilter] = useState('all');
  const [showMissed, setShowMissed] = useState(false);

  const filteredDevices = useMemo(() => {
    if (statusFilter === 'all') return devices;
    return devices.filter((d) => d.status === statusFilter);
  }, [devices, statusFilter]);

  const completedCount = devices.filter((d) => d.status === 'completed').length;
  const partialCount = devices.filter((d) => d.status === 'partial').length;
  const unbackupCount = devices.filter((d) => d.status === 'unbackup').length;
  const totalCount = devices.length;

  const missedDevices = devices.filter((d) => d.status === 'unbackup' || d.status === 'partial');

  const handleDeviceClick = (device: DeviceItemType) => {
    console.info('[Devices] Device clicked:', device.deviceNo);
    let msg = `${device.deviceNo} - ${device.studentName} - ${device.statusLabel}`;
    if (device.hasOversizeFile) {
      msg += `\n⚠️ 含超大文件: ${device.oversizeFiles.join(', ')}`;
    }
    Taro.showToast({ title: msg, icon: 'none', duration: 3000 });
  };

  const handleCheckMissed = () => {
    if (missedDevices.length === 0) {
      Taro.showToast({ title: '所有设备已完成备份', icon: 'success' });
      return;
    }
    setShowMissed(!showMissed);
  };

  return (
    <View className={styles.container}>
      <View className={styles.summaryBar}>
        <Text className={styles.summaryTitle}>设备备份概况</Text>
        <View className={styles.summaryRow}>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{totalCount}</Text>
            <Text className={styles.summaryLabel}>总设备</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{completedCount}</Text>
            <Text className={styles.summaryLabel}>已备份</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{partialCount}</Text>
            <Text className={styles.summaryLabel}>部分备份</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{unbackupCount}</Text>
            <Text className={styles.summaryLabel}>未备份</Text>
          </View>
        </View>
      </View>

      <View className={styles.filterBar}>
        <ScrollView scrollX className={styles.filterRow}>
          {STATUS_FILTERS.map((f) => (
            <View
              key={f.value}
              className={classnames(styles.filterChip, {
                [styles.filterChipActive]: statusFilter === f.value
              })}
              onClick={() => setStatusFilter(f.value)}
            >
              <Text
                className={classnames(styles.filterChipText, {
                  [styles.filterChipTextActive]: statusFilter === f.value
                })}
              >
                {f.label}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.checkSection}>
        <View className={styles.checkButton} onClick={handleCheckMissed}>
          <Text className={styles.checkText}>
            {showMissed ? '隐藏遗漏设备' : `检查遗漏设备 (${missedDevices.length}台)`}
          </Text>
        </View>
      </View>

      {showMissed && missedDevices.length > 0 && (
        <View className={styles.missedSection}>
          <Text className={styles.missedTitle}>⚠️ 以下设备尚未完成备份</Text>
          {missedDevices.map((d) => (
            <View key={d.id} className={styles.missedItem}>
              <Text className={styles.missedDeviceNo}>{d.deviceNo}</Text>
              <Text className={styles.missedStudent}>{d.studentName} - {d.statusLabel}</Text>
            </View>
          ))}
        </View>
      )}

      <View className={styles.deviceList}>
        {filteredDevices.map((device) => (
          <DeviceItemComponent key={device.id} device={device} onClick={handleDeviceClick} />
        ))}
      </View>
    </View>
  );
};

export default DevicesPage;
