import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store/useAppStore';
import BackupCard from '@/components/BackupCard';
import type { BackupItem } from '@/types';

const OWNER_TABS = [
  { value: 'all', label: '全部' },
  { value: 'teacher', label: '教师资料' },
  { value: 'student', label: '学生作品' }
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: '全部类型' },
  { value: 'desktop', label: '桌面文件' },
  { value: 'documents', label: '文档资料' },
  { value: 'custom', label: '指定文件夹' },
  { value: 'teacher', label: '教师资料' },
  { value: 'student', label: '学生作品' }
];

const BackupsPage: React.FC = () => {
  const { backups, toggleBackupSelect } = useAppStore();
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredBackups = useMemo(() => {
    let result = backups;
    if (ownerFilter !== 'all') {
      result = result.filter((b) => b.ownerType === ownerFilter);
    }
    if (categoryFilter !== 'all') {
      result = result.filter((b) => b.category === categoryFilter);
    }
    return result;
  }, [backups, ownerFilter, categoryFilter]);

  const selectedCount = backups.filter((b) => b.isSelected && !b.isArchived).length;
  const oversizeCount = filteredBackups.filter((b) => b.isOversize).length;

  const handleBackupClick = (backup: BackupItem) => {
    console.info('[Backups] Backup clicked:', backup.id);
  };

  const handleExport = () => {
    if (selectedCount === 0) {
      Taro.showToast({ title: '请先勾选要导出的备份', icon: 'none' });
      return;
    }
    Taro.showToast({ title: `正在导出${selectedCount}个备份包...`, icon: 'none' });
  };

  const handleArchive = () => {
    if (selectedCount === 0) {
      Taro.showToast({ title: '请先勾选要封存的备份', icon: 'none' });
      return;
    }
    Taro.showModal({
      title: '确认封存',
      content: `将封存${selectedCount}个备份包，封存后数据将归入历史记录`,
      confirmColor: '#2BA471',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '封存成功', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.topBar}>
        <Text className={styles.topTitle}>
          备份包管理
          {oversizeCount > 0 && ` (${oversizeCount}个超大文件)`}
        </Text>
        <View className={styles.ownerTabs}>
          {OWNER_TABS.map((tab) => (
            <View
              key={tab.value}
              className={classnames(styles.ownerTab, {
                [styles.ownerTabActive]: ownerFilter === tab.value
              })}
              onClick={() => setOwnerFilter(tab.value)}
            >
              <Text
                className={classnames(styles.ownerTabText, {
                  [styles.ownerTabTextActive]: ownerFilter === tab.value
                })}
              >
                {tab.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.categorySection}>
        <Text className={styles.categoryLabel}>备份类型</Text>
        <ScrollView scrollX className={styles.categoryScroll}>
          {CATEGORY_OPTIONS.map((cat) => (
            <View
              key={cat.value}
              className={classnames(styles.categoryChip, {
                [styles.categoryChipActive]: categoryFilter === cat.value
              })}
              onClick={() => setCategoryFilter(cat.value)}
            >
              <Text
                className={classnames(styles.categoryText, {
                  [styles.categoryTextActive]: categoryFilter === cat.value
                })}
              >
                {cat.label}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {selectedCount > 0 && (
        <View className={styles.selectedInfo}>
          <Text className={styles.selectedText}>已勾选 {selectedCount} 个备份包</Text>
        </View>
      )}

      <View className={styles.backupList}>
        {filteredBackups.map((backup) => (
          <BackupCard
            key={backup.id}
            backup={backup}
            onToggle={toggleBackupSelect}
            onClick={handleBackupClick}
          />
        ))}
      </View>

      <View className={styles.bottomBar}>
        <View className={classnames(styles.actionBtn, styles.btnExport)} onClick={handleExport}>
          <Text className={classnames(styles.actionText, styles.btnExportText)}>
            导出成果包 ({selectedCount})
          </Text>
        </View>
        <View className={classnames(styles.actionBtn, styles.btnArchive)} onClick={handleArchive}>
          <Text className={classnames(styles.actionText, styles.btnArchiveText)}>
            学期封存
          </Text>
        </View>
      </View>
    </View>
  );
};

export default BackupsPage;
