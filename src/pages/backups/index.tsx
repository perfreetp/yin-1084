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

const STATUS_TABS = [
  { value: 'active', label: '可操作' },
  { value: 'archived', label: '已封存' }
];

const BackupsPage: React.FC = () => {
  const { backups, toggleBackupSelect, archiveSelectedBackups, addNotification } = useAppStore();
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active');
  const [exportResult, setExportResult] = useState<null | {
    students: string[];
    fileCount: number;
    totalSize: string;
    createdAt: string;
  }>(null);

  const activeBackups = useMemo(() => backups.filter((b) => !b.isArchived), [backups]);
  const archivedBackups = useMemo(() => backups.filter((b) => b.isArchived), [backups]);

  const displayBackups = statusFilter === 'active' ? activeBackups : archivedBackups;

  const filteredBackups = useMemo(() => {
    let result = displayBackups;
    if (ownerFilter !== 'all') {
      result = result.filter((b) => b.ownerType === ownerFilter);
    }
    if (categoryFilter !== 'all') {
      result = result.filter((b) => b.category === categoryFilter);
    }
    return result;
  }, [displayBackups, ownerFilter, categoryFilter]);

  const selectedCount = activeBackups.filter((b) => b.isSelected).length;
  const oversizeCount = filteredBackups.filter((b) => b.isOversize).length;

  const handleBackupClick = (backup: BackupItem) => {
    console.info('[Backups] Backup clicked:', backup.id);
    if (backup.isArchived) {
      Taro.showToast({ title: '该备份已封存，不可修改', icon: 'none' });
    }
  };

  const handleExport = () => {
    if (selectedCount === 0) {
      Taro.showToast({ title: '请先勾选要导出的备份', icon: 'none' });
      return;
    }

    const selected = activeBackups.filter((b) => b.isSelected);
    const studentSet = new Set<string>();
    let totalFiles = 0;
    let totalSizeMB = 0;

    selected.forEach((b) => {
      studentSet.add(b.studentName);
      totalFiles += b.fileCount;
      const sizeStr = b.fileSize;
      if (sizeStr.includes('GB')) {
        totalSizeMB += parseFloat(sizeStr) * 1024;
      } else if (sizeStr.includes('MB')) {
        totalSizeMB += parseFloat(sizeStr);
      }
    });

    const totalSize = totalSizeMB >= 1024
      ? `${(totalSizeMB / 1024).toFixed(2)}GB`
      : `${totalSizeMB.toFixed(0)}MB`;

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    setExportResult({
      students: Array.from(studentSet),
      fileCount: totalFiles,
      totalSize,
      createdAt
    });

    addNotification({
      type: 'backup',
      typeLabel: '导出完成',
      title: '成果包导出成功',
      description: `共${studentSet.size}名学生、${totalFiles}个文件、${totalSize}`
    });

    Taro.showToast({ title: '导出成功', icon: 'success' });
  };

  const handleArchive = () => {
    if (selectedCount === 0) {
      Taro.showToast({ title: '请先勾选要封存的备份', icon: 'none' });
      return;
    }

    Taro.showModal({
      title: '确认封存',
      content: `将封存${selectedCount}个备份包，封存后数据将归入历史记录，不可恢复`,
      confirmColor: '#2BA471',
      success: (res) => {
        if (res.confirm) {
          const archivedIds = archiveSelectedBackups();
          addNotification({
            type: 'backup',
            typeLabel: '封存完成',
            title: '学期封存完成',
            description: `共${archivedIds.length}个备份包已封存`
          });
          Taro.showToast({ title: '封存成功', icon: 'success' });
        }
      }
    });
  };

  const handleCloseExportResult = () => {
    setExportResult(null);
  };

  return (
    <View className={styles.container}>
      <View className={styles.topBar}>
        <Text className={styles.topTitle}>
          备份包管理
          {oversizeCount > 0 && ` (${oversizeCount}个超大文件)`}
        </Text>
        <View className={styles.ownerTabs}>
          {STATUS_TABS.map((tab) => (
            <View
              key={tab.value}
              className={classnames(styles.ownerTab, {
                [styles.ownerTabActive]: statusFilter === tab.value
              })}
              onClick={() => setStatusFilter(tab.value)}
            >
              <Text
                className={classnames(styles.ownerTabText, {
                  [styles.ownerTabTextActive]: statusFilter === tab.value
                })}
              >
                {tab.label} ({statusFilter === 'active' ? activeBackups.length : archivedBackups.length})
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.categorySection}>
        <View className={styles.categoryRow}>
          <Text className={styles.categoryLabel}>分类</Text>
          <View className={styles.categoryScrollWrap}>
            <ScrollView scrollX className={styles.categoryScroll}>
              {OWNER_TABS.map((tab) => (
                <View
                  key={tab.value}
                  className={classnames(styles.categoryChip, {
                    [styles.categoryChipActive]: ownerFilter === tab.value
                  })}
                  onClick={() => setOwnerFilter(tab.value)}
                >
                  <Text
                    className={classnames(styles.categoryText, {
                      [styles.categoryTextActive]: ownerFilter === tab.value
                    })}
                  >
                    {tab.label}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
        <View className={styles.categoryRow}>
          <Text className={styles.categoryLabel}>类型</Text>
          <View className={styles.categoryScrollWrap}>
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
        </View>
      </View>

      {selectedCount > 0 && statusFilter === 'active' && (
        <View className={styles.selectedInfo}>
          <Text className={styles.selectedText}>已勾选 {selectedCount} 个备份包</Text>
        </View>
      )}

      {filteredBackups.length === 0 && (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📁</Text>
          <Text className={styles.emptyText}>
            {statusFilter === 'archived' ? '暂无已封存的备份' : '暂无可用备份'}
          </Text>
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

      {statusFilter === 'active' && (
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
      )}

      {exportResult && (
        <View className={styles.modalOverlay} onClick={handleCloseExportResult}>
          <View className={styles.resultModal} onClick={(e) => { e.stopPropagation(); }}>
            <View className={styles.resultHeader}>
              <Text className={styles.resultIcon}>📦</Text>
              <Text className={styles.resultTitle}>导出成功</Text>
            </View>

            <View className={styles.resultDetail}>
              <View className={styles.resultRow}>
                <Text className={styles.resultLabel}>生成时间</Text>
                <Text className={styles.resultValue}>{exportResult.createdAt}</Text>
              </View>
              <View className={styles.resultRow}>
                <Text className={styles.resultLabel}>包含学生</Text>
                <Text className={styles.resultValue}>{exportResult.students.length}名</Text>
              </View>
              <View className={styles.resultRow}>
                <Text className={styles.resultLabel}>文件数量</Text>
                <Text className={styles.resultValue}>{exportResult.fileCount}个</Text>
              </View>
              <View className={styles.resultRow}>
                <Text className={styles.resultLabel}>总大小</Text>
                <Text className={styles.resultValue}>{exportResult.totalSize}</Text>
              </View>
            </View>

            <View className={styles.resultStudents}>
              <Text className={styles.resultStudentsTitle}>学生名单</Text>
              <View className={styles.studentTags}>
                {exportResult.students.map((s, i) => (
                  <View key={i} className={styles.studentTag}>
                    <Text className={styles.studentTagText}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.resultCloseBtn} onClick={handleCloseExportResult}>
              <Text className={styles.resultCloseText}>关闭</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default BackupsPage;
