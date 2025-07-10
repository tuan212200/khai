import { Image } from 'expo-image';
import { Platform, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import GroceryShoppingList from '@/components/GroceryShoppingList';
import NotificationCenter from '@/components/NotificationCenter';

export default function HomeScreen() {
  const [notifications] = useState([
    {
      id: '1',
      title: 'Task Completed',
      message: 'You completed "Update documentation" task',
      type: 'success' as const,
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
    },
    {
      id: '2',
      title: 'Weather Alert',
      message: 'Rain expected this afternoon in your area',
      type: 'warning' as const,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: true,
    },
    {
      id: '3',
      title: 'New Feature',
      message: 'Check out the new profile customization options',
      type: 'info' as const,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: false,
    },
  ]);

  const handleNotificationPress = (notification: any) => {
    Alert.alert(notification.title, notification.message);
  };

  const handleClearNotifications = () => {
    Alert.alert('Clear All', 'All notifications have been cleared');
  };

  return (
    <ParallaxScrollView
      testID="home-screen"
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.quickActionsContainer} testID="home-quick-actions">
        <ThemedText type="subtitle">Quick Actions</ThemedText>
        <ThemedView style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
            testID="home-add-task-button"
            accessibilityLabel="Add new task"
          >
            <IconSymbol size={24} name="plus.circle.fill" color="#ffffff" />
            <ThemedText style={styles.actionButtonText}>Add Task</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
            testID="home-check-weather-button"
            accessibilityLabel="Check weather"
          >
            <IconSymbol size={24} name="cloud.sun.fill" color="#ffffff" />
            <ThemedText style={styles.actionButtonText}>Weather</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#9C27B0' }]}
            testID="home-view-profile-button"
            accessibilityLabel="View profile"
          >
            <IconSymbol size={24} name="person.fill" color="#ffffff" />
            <ThemedText style={styles.actionButtonText}>Profile</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Grocery Shopping List Demo</ThemedText>
        <GroceryShoppingList />
      </ThemedView>

      <ThemedView style={styles.notificationsContainer}>
        <NotificationCenter
          notifications={notifications}
          onNotificationPress={handleNotificationPress}
          onClearAll={handleClearNotifications}
        />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">App Features</ThemedText>
        <ThemedText>
          This enhanced app now includes:
        </ThemedText>
        <ThemedView style={styles.featureList}>
          <ThemedView style={styles.featureItem}>
            <IconSymbol size={16} name="checkmark.circle.fill" color="#4CAF50" />
            <ThemedText style={styles.featureText}>Task management with priorities</ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureItem}>
            <IconSymbol size={16} name="cloud.sun.fill" color="#2196F3" />
            <ThemedText style={styles.featureText}>Weather forecast with details</ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureItem}>
            <IconSymbol size={16} name="person.fill" color="#9C27B0" />
            <ThemedText style={styles.featureText}>User profile and settings</ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureItem}>
            <IconSymbol size={16} name="bell.fill" color="#FF9800" />
            <ThemedText style={styles.featureText}>Notification center</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Getting Started</ThemedText>
        <ThemedText>
          Navigate through the tabs to explore all features. Each section includes:
        </ThemedText>
        <ThemedText style={styles.bulletPoint}>• Interactive components with real-time updates</ThemedText>
        <ThemedText style={styles.bulletPoint}>• Comprehensive accessibility support</ThemedText>
        <ThemedText style={styles.bulletPoint}>• Cross-platform compatibility</ThemedText>
        <ThemedText style={styles.bulletPoint}>• TypeScript interfaces for type safety</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickActionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  notificationsContainer: {
    marginBottom: 24,
    maxHeight: 400,
  },
  featureList: {
    gap: 8,
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  bulletPoint: {
    fontSize: 14,
    marginLeft: 16,
    marginTop: 4,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
