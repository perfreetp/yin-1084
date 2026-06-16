import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { DeviceItem as DeviceItemType } from '@/types';

interface DeviceItemProps {
  device: DeviceItemType;
  onClick?: (device: DeviceItemType) => void;
}

const DeviceItem: React.FC<DeviceItemProps> = ({ device, onClick }) => {
  return (
    <View className={styles.item} onClick={() => onClick?.(device)}>
      <View className={styles.left}>
        <View
          className={classnames(styles.deviceNo, {
            [styles.statusCompleted]: device.status === 'completed',
            [styles.statusPartial]: device.status === 'partial',
            [styles.statusUnbackup]: device.status === 'unbackup'
          })}
        >
          <Text className={styles.deviceNoText}>{device.deviceNo}</Text>
        </View>
        <View className={styles.info}>
          <Text className={styles.studentName}>{device.studentName}</Text>
          <Text className={styles.className}>{device.className}</Text>
        </View>
      </View>
      <View className={styles.right}>
        <Text
          className={classnames(styles.statusText, {
            [styles.textCompleted]: device.status === 'completed',
            [styles.textPartial]: device.status === 'partial',
            [styles.textUnbackup]: device.status === 'unbackup'
          })}
        >
          {device.statusLabel}
        </Text>
        {device.hasOversizeFile && (
          <View className={styles.oversizeBadge}>
            <Text className={styles.oversizeText}>超大文件</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default DeviceItem;
