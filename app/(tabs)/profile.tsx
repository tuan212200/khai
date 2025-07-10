import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Image } from 'expo-image';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  joinDate: string;
  tasksCompleted: number;
  streakDays: number;
}

interface SettingItem {
  id: string;
  title: string;
  icon: string;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
}

export default function ProfileScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Nguyen Quang Khai',
    email: 'khai@example.com',
    phone: '+84 123 456 789',
    bio: 'React Native developer passionate about creating amazing mobile experiences.',
    location: 'Ho Chi Minh City, Vietnam',
    joinDate: '2024-01-15',
    tasksCompleted: 127,
    streakDays: 15,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [settings, setSettings] = useState<SettingItem[]>([
    { id: '1', title: 'Push Notifications', icon: 'bell.fill', type: 'toggle', value: true },
    { id: '2', title: 'Dark Mode', icon: 'moon.fill', type: 'toggle', value: false },
    { id: '3', title: 'Location Services', icon: 'location.fill', type: 'toggle', value: true },
    { id: '4', title: 'Privacy Settings', icon: 'lock.fill', type: 'navigation' },
    { id: '5', title: 'Help & Support', icon: 'questionmark.circle.fill', type: 'navigation' },
    { id: '6', title: 'Export Data', icon: 'square.and.arrow.up.fill', type: 'action' },
    { id: '7', title: 'Sign Out', icon: 'rectangle.portrait.and.arrow.right.fill', type: 'action' },
  ]);

  const handleSaveProfile = () => {
    try {
      setProfile(editedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleToggleSetting = (id: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id && setting.type === 'toggle'
          ? { ...setting, value: !setting.value }
          : setting
      )
    );
  };

  const handleSettingPress = (setting: SettingItem) => {
    switch (setting.type) {
      case 'toggle':
        handleToggleSetting(setting.id);
        break;
      case 'navigation':
        Alert.alert('Navigation', `Navigate to ${setting.title}`);
        break;
      case 'action':
        if (setting.title === 'Sign Out') {
          Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Out', style: 'destructive', onPress: () => Alert.alert('Signed Out', 'You have been signed out successfully') },
            ]
          );
        } else if (setting.title === 'Export Data') {
          Alert.alert('Export Data', 'Your data has been prepared for export');
        }
        break;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const daysSinceJoined = Math.floor((new Date().getTime() - new Date(profile.joinDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ParallaxScrollView
        testID="profile-screen"
        headerBackgroundColor={{ light: '#9C27B0', dark: '#7B1FA2' }}
        headerImage={
          <IconSymbol
            size={250}
            color="#ffffff"
            name="person.fill"
            style={styles.headerImage}
          />
        }>
        
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Profile</ThemedText>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
            testID="profile-edit-button"
            accessibilityLabel={isEditing ? 'Cancel editing' : 'Edit profile'}
            accessibilityHint={isEditing ? 'Cancels profile editing mode' : 'Enables profile editing mode'}
          >
            <IconSymbol 
              size={24} 
              name={isEditing ? 'xmark.circle.fill' : 'pencil.circle.fill'} 
              color="#9C27B0" 
            />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.profileContainer} testID="profile-info-container">
          <ThemedView style={styles.avatarContainer}>
            <ThemedView style={styles.avatar} testID="profile-avatar">
              <IconSymbol size={60} name="person.fill" color="#ffffff" />
            </ThemedView>
            {isEditing && (
              <TouchableOpacity 
                style={styles.avatarEditButton}
                testID="profile-avatar-edit"
                accessibilityLabel="Change profile picture"
              >
                <IconSymbol size={20} name="camera.fill" color="#9C27B0" />
              </TouchableOpacity>
            )}
          </ThemedView>

          <ThemedView style={styles.profileInfo}>
            {isEditing ? (
              <ThemedView style={styles.editContainer}>
                <TextInput
                  style={[styles.input, { color: textColor, backgroundColor }]}
                  value={editedProfile.name}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, name: text }))}
                  placeholder="Full Name"
                  testID="profile-name-input"
                  accessibilityLabel="Full name input"
                />
                <TextInput
                  style={[styles.input, { color: textColor, backgroundColor }]}
                  value={editedProfile.email}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, email: text }))}
                  placeholder="Email"
                  keyboardType="email-address"
                  testID="profile-email-input"
                  accessibilityLabel="Email input"
                />
                <TextInput
                  style={[styles.input, { color: textColor, backgroundColor }]}
                  value={editedProfile.phone}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, phone: text }))}
                  placeholder="Phone"
                  keyboardType="phone-pad"
                  testID="profile-phone-input"
                  accessibilityLabel="Phone number input"
                />
                <TextInput
                  style={[styles.input, styles.bioInput, { color: textColor, backgroundColor }]}
                  value={editedProfile.bio}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, bio: text }))}
                  placeholder="Bio"
                  multiline
                  numberOfLines={3}
                  testID="profile-bio-input"
                  accessibilityLabel="Bio input"
                />
                <TextInput
                  style={[styles.input, { color: textColor, backgroundColor }]}
                  value={editedProfile.location}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, location: text }))}
                  placeholder="Location"
                  testID="profile-location-input"
                  accessibilityLabel="Location input"
                />
                
                <ThemedView style={styles.editActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={handleCancelEdit}
                    testID="profile-cancel-button"
                    accessibilityLabel="Cancel changes"
                  >
                    <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.saveButton]}
                    onPress={handleSaveProfile}
                    testID="profile-save-button"
                    accessibilityLabel="Save changes"
                  >
                    <ThemedText style={styles.saveButtonText}>Save</ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
            ) : (
              <ThemedView style={styles.displayContainer}>
                <ThemedText style={styles.name} testID="profile-name-display">
                  {profile.name}
                </ThemedText>
                <ThemedText style={styles.email} testID="profile-email-display">
                  {profile.email}
                </ThemedText>
                <ThemedText style={styles.phone} testID="profile-phone-display">
                  {profile.phone}
                </ThemedText>
                <ThemedText style={styles.bio} testID="profile-bio-display">
                  {profile.bio}
                </ThemedText>
                <ThemedView style={styles.locationContainer}>
                  <IconSymbol size={16} name="location.fill" color="#666" />
                  <ThemedText style={styles.location} testID="profile-location-display">
                    {profile.location}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.statsContainer} testID="profile-stats-container">
          <ThemedText type="subtitle">Statistics</ThemedText>
          <ThemedView style={styles.statsGrid}>
            <ThemedView style={styles.statItem} testID="profile-stat-tasks">
              <IconSymbol size={32} name="checkmark.circle.fill" color="#4CAF50" />
              <ThemedText style={styles.statValue}>{profile.tasksCompleted}</ThemedText>
              <ThemedText style={styles.statLabel}>Tasks Completed</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.statItem} testID="profile-stat-streak">
              <IconSymbol size={32} name="flame.fill" color="#FF9800" />
              <ThemedText style={styles.statValue}>{profile.streakDays}</ThemedText>
              <ThemedText style={styles.statLabel}>Day Streak</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.statItem} testID="profile-stat-days">
              <IconSymbol size={32} name="calendar.fill" color="#2196F3" />
              <ThemedText style={styles.statValue}>{daysSinceJoined}</ThemedText>
              <ThemedText style={styles.statLabel}>Days Active</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedText style={styles.joinDate} testID="profile-join-date">
            Member since {formatDate(profile.joinDate)}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.settingsContainer} testID="profile-settings-container">
          <ThemedText type="subtitle">Settings</ThemedText>
          <ThemedView style={styles.settingsList}>
            {settings.map((setting) => (
              <TouchableOpacity
                key={setting.id}
                style={styles.settingItem}
                onPress={() => handleSettingPress(setting)}
                testID={`profile-setting-${setting.id}`}
                accessibilityLabel={setting.title}
                accessibilityHint={
                  setting.type === 'toggle' 
                    ? `Toggle ${setting.title}, currently ${setting.value ? 'enabled' : 'disabled'}`
                    : `Navigate to ${setting.title}`
                }
              >
                <ThemedView style={styles.settingContent}>
                  <IconSymbol size={24} name={setting.icon} color="#9C27B0" />
                  <ThemedText style={styles.settingTitle}>{setting.title}</ThemedText>
                </ThemedView>
                {setting.type === 'toggle' ? (
                  <ThemedView 
                    style={[
                      styles.toggle, 
                      setting.value ? styles.toggleActive : styles.toggleInactive
                    ]}
                    testID={`profile-toggle-${setting.id}`}
                  >
                    <ThemedView 
                      style={[
                        styles.toggleThumb,
                        setting.value ? styles.toggleThumbActive : styles.toggleThumbInactive
                      ]}
                    />
                  </ThemedView>
                ) : (
                  <IconSymbol size={20} name="chevron.right" color="#666" />
                )}
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -50,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  editButton: {
    padding: 8,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'rgba(156, 39, 176, 0.1)',
    borderRadius: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#9C27B0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    flex: 1,
  },
  displayContainer: {
    gap: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
  },
  phone: {
    fontSize: 14,
    opacity: 0.7,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    opacity: 0.7,
  },
  editContainer: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#9C27B0',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  statsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9C27B0',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  joinDate: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 8,
  },
  settingsContainer: {
    gap: 16,
  },
  settingsList: {
    gap: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 2,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#9C27B0',
    alignItems: 'flex-end',
  },
  toggleInactive: {
    backgroundColor: '#ddd',
    alignItems: 'flex-start',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  toggleThumbActive: {
    transform: [{ translateX: 0 }],
  },
  toggleThumbInactive: {
    transform: [{ translateX: 0 }],
  },
});