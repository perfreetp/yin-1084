import React from 'react';
import { View, Text, Checkbox } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { BackupItem as BackupItemType } from '@/types';

interface BackupCardProps {
  backup: BackupItemType;
  onToggle?: (id: string) => void;
  onClick?: (backup: BackupItemType) => void;
}

const BackupCard: React.FC<BackupCardProps> = ({ backup, onToggle, onClick }) => {
  return (
    <View className={classnames(styles.card, { [styles.archived]: backup.isArchived })}>
      <View className={styles.header} onClick={() => onClick?.(backup)}>
        <View className={styles.left}>
          <View
            className={classnames(styles.categoryTag, {
              [styles.tagTeacher]: backup.ownerType === 'teacher',
              [styles.tagStudent]: backup.ownerType === 'student'
            })}
          >
            <Text className={styles.categoryText}>{backup.categoryLabel}</Text>
          </View>
          <View className={styles.info}>
            <Text className={styles.name}>{backup.studentName}</Text>
            <Text className={styles.className}>{backup.className}</Text>
          </View>
        </View>
        {!backup.isArchived && (
          <View className={styles.checkboxWrap} onClick={(e) => { e.stopPropagation(); onToggle?.(backup.id); }}>
            <Checkbox checked={backup.isSelected} color="#2BA471" />
          </View>
        )}
      </View>

      <View className={styles.detail} onClick={() => onClick?.(backup)}>
        <View className={styles.detailRow}>
          <Text className={styles.detailLabel}>文件数量</Text>
          <Text className={styles.detailValue}>{backup.fileCount}个</Text>
        </View>
        <View className={styles.detailRow}>
          <Text className={styles.detailLabel}>文件大小</Text>
          <Text className={classnames(styles.detailValue, { [styles.oversizeValue]: backup.isOversize })}>
            {backup.fileSize}
          </Text>
        </View>
        <View className={styles.detailRow}>
          <Text className={styles.detailLabel}>备份时间</Text>
          <Text className={styles.detailValue}>{backup.createdAt}</Text>
        </View>
      </View>

      {backup.isOversize && (
        <View className={styles.oversizeTip}>
          <Text className={styles.oversizeTipText}>⚠️ 该备份包含超大文件，建议单独处理</Text>
        </View>
      )}

      {backup.isArchived && (
        <View className={styles.archivedBadge}>
          <Text className={styles.archivedText}>已封存</Text>
        </View>
      )}
    </View>
  );
};

export default BackupCard;
