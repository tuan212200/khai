import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            height: 88, // Ensure sufficient height for touch targets
            paddingBottom: 34, // Safe area padding
          },
          default: {
            height: 64, // Standard height for Android
          },
        }),
        tabBarItemStyle: {
          paddingVertical: 4,
          minHeight: 48, // Ensure minimum touch target
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          tabBarAccessibilityLabel: 'Home Tab',
          tabBarButton: (props) => <HapticTab {...props} testID="tab-home" />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="checkmark.circle.fill" color={color} />,
          tabBarAccessibilityLabel: 'Tasks Tab',
          tabBarButton: (props) => <HapticTab {...props} testID="tab-tasks" />,
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: 'Weather',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="cloud.sun.fill" color={color} />,
          tabBarAccessibilityLabel: 'Weather Tab',
          tabBarButton: (props) => <HapticTab {...props} testID="tab-weather" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
          tabBarAccessibilityLabel: 'Profile Tab',
          tabBarButton: (props) => <HapticTab {...props} testID="tab-profile" />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          tabBarAccessibilityLabel: 'Explore Tab',
          tabBarButton: (props) => <HapticTab {...props} testID="tab-explore" />,
        }}
      />
    </Tabs>
  );
}
