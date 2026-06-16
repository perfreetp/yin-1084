import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => {
  return (
    <View className={styles.card}>
      <Text className={styles.value} style={{ color: color || '#2BA471' }}>
        {value}
      </Text>
      <Text className={styles.label}>{label}</Text>
    </View>
  );
};

export default StatCard;
