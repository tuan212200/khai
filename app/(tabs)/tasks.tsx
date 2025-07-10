import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TaskManager from '@/components/TaskManager';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Complete React Native project', completed: false, priority: 'high', dueDate: '2025-06-10' },
    { id: '2', title: 'Review code with team', completed: false, priority: 'medium', dueDate: '2025-06-08' },
    { id: '3', title: 'Update documentation', completed: true, priority: 'low' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const addTask = async (title: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    try {
      setIsLoading(true);
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        completed: false,
        priority,
      };
      setTasks(prev => [...prev, newTask]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add task');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setTasks(prev => prev.filter(task => task.id !== id))
        },
      ]
    );
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <ParallaxScrollView
      testID="tasks-screen"
      headerBackgroundColor={{ light: '#4CAF50', dark: '#2E7D32' }}
      headerImage={
        <IconSymbol
          size={250}
          color="#ffffff"
          name="checkmark.circle.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Task Manager</ThemedText>
        {isLoading && <ActivityIndicator testID="tasks-loading" size="small" />}
      </ThemedView>

      <ThemedView style={styles.progressContainer} testID="tasks-progress-container">
        <ThemedText type="subtitle">Progress Overview</ThemedText>
        <ThemedView style={styles.progressStats}>
          <ThemedText testID="tasks-progress-text">
            {completedTasks} of {totalTasks} tasks completed ({Math.round(progressPercentage)}%)
          </ThemedText>
          <ThemedView style={styles.progressBar}>
            <ThemedView 
              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
              testID="tasks-progress-bar"
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.tasksContainer}>
        <ThemedText type="subtitle">Your Tasks</ThemedText>
        <TaskManager />
      </ThemedView>

      <ThemedView style={styles.tasksContainer}>
        <ThemedText type="subtitle">Quick Tasks</ThemedText>
        <ScrollView style={styles.tasksList} testID="tasks-list">
          {tasks.map((task) => (
            <ThemedView key={task.id} style={styles.taskItem} testID={`task-item-${task.id}`}>
              <TouchableOpacity
                style={styles.taskContent}
                onPress={() => toggleTask(task.id)}
                testID={`task-toggle-${task.id}`}
                accessibilityLabel={`Toggle task: ${task.title}`}
                accessibilityHint={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                <IconSymbol
                  size={24}
                  name={task.completed ? 'checkmark.circle.fill' : 'circle'}
                  color={task.completed ? '#4CAF50' : '#666'}
                />
                <ThemedView style={styles.taskDetails}>
                  <ThemedText 
                    style={[
                      styles.taskTitle,
                      task.completed && styles.completedTask
                    ]}
                    testID={`task-title-${task.id}`}
                  >
                    {task.title}
                  </ThemedText>
                  <ThemedView style={styles.taskMeta}>
                    <ThemedView style={[styles.priorityBadge, styles[`priority${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`]]}>
                      <ThemedText style={styles.priorityText}>{task.priority.toUpperCase()}</ThemedText>
                    </ThemedView>
                    {task.dueDate && (
                      <ThemedText style={styles.dueDate} testID={`task-due-${task.id}`}>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </ThemedText>
                    )}
                  </ThemedView>
                </ThemedView>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTask(task.id)}
                testID={`task-delete-${task.id}`}
                accessibilityLabel={`Delete task: ${task.title}`}
                accessibilityHint="Remove this task from the list"
              >
                <IconSymbol size={20} name="trash" color="#FF5252" />
              </TouchableOpacity>
            </ThemedView>
          ))}
        </ScrollView>
      </ThemedView>

      <ThemedView style={styles.addTaskContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addTask('New task from quick add')}
          testID="add-task-button"
          accessibilityLabel="Add new task"
          accessibilityHint="Creates a new task with default settings"
        >
          <IconSymbol size={24} name="plus.circle.fill" color="#ffffff" />
          <ThemedText style={styles.addButtonText}>Add Quick Task</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
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
    gap: 8,
    marginBottom: 16,
  },
  progressContainer: {
    gap: 8,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  progressStats: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  tasksContainer: {
    gap: 12,
    marginBottom: 24,
  },
  tasksList: {
    maxHeight: 300,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskDetails: {
    flex: 1,
    gap: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityHigh: {
    backgroundColor: '#FF5252',
  },
  priorityMedium: {
    backgroundColor: '#FF9800',
  },
  priorityLow: {
    backgroundColor: '#4CAF50',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  dueDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  deleteButton: {
    padding: 8,
  },
  addTaskContainer: {
    marginTop: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});