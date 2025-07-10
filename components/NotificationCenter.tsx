import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

interface Props {
  notifications?: NotificationItem[];
  onNotificationPress?: (notification: NotificationItem) => void;
  onClearAll?: () => void;
}

export default function NotificationCenter({ 
  notifications = [], 
  onNotificationPress,
  onClearAll 
}: Props) {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'unread' && !notification.read);
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return 'checkmark.circle.fill';
      case 'warning': return 'exclamationmark.triangle.fill';
      case 'error': return 'xmark.circle.fill';
      default: return 'info.circle.fill';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'error': return '#F44336';
      default: return '#2196F3';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <ThemedView style={styles.container} testID="notification-center">
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle" testID="notification-title">
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </ThemedText>
        {notifications.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={onClearAll}
            testID="notification-clear-all"
            accessibilityLabel="Clear all notifications"
          >
            <ThemedText style={styles.clearButtonText}>Clear All</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      <ThemedView style={styles.controls}>
        <TextInput
          style={[styles.searchInput, { color: textColor, backgroundColor }]}
          placeholder="Search notifications..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          testID="notification-search"
          accessibilityLabel="Search notifications"
        />
        
        <ThemedView style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
            testID="notification-filter-all"
            accessibilityLabel="Show all notifications"
          >
            <ThemedText style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'unread' && styles.filterButtonActive]}
            onPress={() => setFilter('unread')}
            testID="notification-filter-unread"
            accessibilityLabel="Show unread notifications"
          >
            <ThemedText style={[styles.filterText, filter === 'unread' && styles.filterTextActive]}>
              Unread
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      <ScrollView style={styles.notificationsList} testID="notifications-list">
        {filteredNotifications.length === 0 ? (
          <ThemedView style={styles.emptyState} testID="notifications-empty">
            <IconSymbol size={48} name="bell.slash.fill" color="#ccc" />
            <ThemedText style={styles.emptyText}>
              {searchQuery || filter === 'unread' ? 'No matching notifications' : 'No notifications yet'}
            </ThemedText>
          </ThemedView>
        ) : (
          filteredNotifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                !notification.read && styles.unreadNotification
              ]}
              onPress={() => onNotificationPress?.(notification)}
              testID={`notification-item-${notification.id}`}
              accessibilityLabel={`${notification.title}: ${notification.message}`}
              accessibilityHint={notification.read ? 'Read notification' : 'Unread notification, tap to view'}
            >
              <IconSymbol
                size={24}
                name={getTypeIcon(notification.type)}
                color={getTypeColor(notification.type)}
                style={styles.notificationIcon}
              />
              <ThemedView style={styles.notificationContent}>
                <ThemedView style={styles.notificationHeader}>
                  <ThemedText
                    style={[
                      styles.notificationTitle,
                      !notification.read && styles.unreadTitle
                    ]}
                    testID={`notification-title-${notification.id}`}
                  >
                    {notification.title}
                  </ThemedText>
                  <ThemedText style={styles.timestamp} testID={`notification-time-${notification.id}`}>
                    {formatTimestamp(notification.timestamp)}
                  </ThemedText>
                </ThemedView>
                <ThemedText
                  style={styles.notificationMessage}
                  numberOfLines={2}
                  testID={`notification-message-${notification.id}`}
                >
                  {notification.message}
                </ThemedText>
              </ThemedView>
              {!notification.read && (
                <ThemedView style={styles.unreadDot} testID={`notification-unread-${notification.id}`} />
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  controls: {
    gap: 12,
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  notificationsList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.5,
    textAlign: 'center',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    gap: 12,
  },
  unreadNotification: {
    backgroundColor: 'rgba(33, 150, 243, 0.05)',
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  notificationIcon: {
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
    gap: 4,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.6,
  },
  notificationMessage: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
    marginTop: 8,
  },
});