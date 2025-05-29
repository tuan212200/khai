import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

interface TaskManagerProps {
  /**
   * Optional initial tasks
   */
  initialTasks?: TaskItem[];
  /**
   * Function called when tasks are updated
   */
  onTasksUpdate?: (tasks: TaskItem[]) => void;
  /**
   * Whether the component is in a loading state
   */
  isLoading?: boolean;
  /**
   * Optional title for the component
   */
  title?: string;
}

export function TaskManager({ 
  initialTasks = [],
  onTasksUpdate,
  isLoading = false,
  title = "Task Manager"
}: TaskManagerProps): React.JSX.Element {
  // State
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Combined loading state
  const loading = isLoading || isSubmitting;

  // Theme colors
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('primary');
  const placeholderColor = useThemeColor('placeholder');
  const inputBackgroundColor = useThemeColor('inputBackground');
  const completedColor = useThemeColor('success');
  const deleteColor = useThemeColor('error');

  // Update tasks when initialTasks prop changes
  useEffect(() => {
    if (initialTasks.length > 0) {
      setTasks(initialTasks);
    }
  }, [initialTasks]);

  /**
   * Add a new task to the list
   */
  const addTask = useCallback(async (): Promise<void> => {
    if (!taskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
      
      const newTask: TaskItem = {
        id: Date.now().toString(),
        title: taskTitle.trim(),
        completed: false,
        createdAt: Date.now(),
      };
      
      const updatedTasks = [newTask, ...tasks];
      setTasks(updatedTasks);
      setTaskTitle('');
      
      // Notify parent component if callback exists
      if (onTasksUpdate) {
        onTasksUpdate(updatedTasks);
      }
    } catch (error) {
      Alert.alert(
        'Error', 
        error instanceof Error ? error.message : 'Failed to add task'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [taskTitle, tasks, onTasksUpdate]);

  /**
   * Toggle task completion status
   */
  const toggleTaskCompletion = useCallback((id: string): void => {
    try {
      const updatedTasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      
      setTasks(updatedTasks);
      
      // Notify parent component if callback exists
      if (onTasksUpdate) {
        onTasksUpdate(updatedTasks);
      }
    } catch (error) {
      Alert.alert(
        'Error', 
        'Failed to update task status'
      );
    }
  }, [tasks, onTasksUpdate]);

  /**
   * Delete a task from the list
   */
  const deleteTask = useCallback((id: string): void => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              const updatedTasks = tasks.filter(task => task.id !== id);
              setTasks(updatedTasks);
              
              // Notify parent component if callback exists
              if (onTasksUpdate) {
                onTasksUpdate(updatedTasks);
              }
            } catch (error) {
              Alert.alert(
                'Error', 
                'Failed to delete task'
              );
            }
          },
        },
      ],
    );
  }, [tasks, onTasksUpdate]);

  /**
   * Render individual task item
   */
  const renderTaskItem = useCallback(({ item }: { item: TaskItem }) => (
    <ThemedView 
      testID={`task-item-${item.id}`}
      style={styles.taskItem}
      accessibilityLabel={`Task: ${item.title}, ${item.completed ? 'completed' : 'not completed'}`}
      accessibilityRole="button"
    >
      <TouchableOpacity 
        testID={`task-toggle-${item.id}`}
        style={[
          styles.checkbox, 
          item.completed && { backgroundColor: completedColor }
        ]}
        onPress={() => toggleTaskCompletion(item.id)}
        accessibilityLabel={`${item.completed ? 'Mark as incomplete' : 'Mark as complete'}`}
        accessibilityHint={`Toggle completion status of task: ${item.title}`}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.completed }}
      >
        {item.completed && (
          <ThemedText style={styles.checkmark}>✓</ThemedText>
        )}
      </TouchableOpacity>
      
      <ThemedText 
        testID={`task-title-${item.id}`}
        style={[
          styles.taskTitle,
          item.completed && styles.completedTaskTitle
        ]}
        accessibilityLabel={item.title}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {item.title}
      </ThemedText>
      
      <TouchableOpacity
        testID={`task-delete-${item.id}`}
        style={styles.deleteButton}
        onPress={() => deleteTask(item.id)}
        accessibilityLabel={`Delete task: ${item.title}`}
        accessibilityHint="Delete this task from the list"
        accessibilityRole="button"
      >
        <ThemedText style={[styles.deleteText, { color: deleteColor }]}>✕</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  ), [toggleTaskCompletion, deleteTask, completedColor, deleteColor]);

  /**
   * Handle keyboard submit event
   */
  const handleSubmitEditing = useCallback((): void => {
    void addTask();
  }, [addTask]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ThemedView testID="task-manager-container" style={styles.container}>
        <ThemedText 
          testID="task-manager-title" 
          style={styles.headerTitle}
          accessibilityRole="header"
        >
          {title}
        </ThemedText>
        
        <ThemedView style={styles.inputContainer}>
          <TextInput
            testID="task-input"
            style={[
              styles.input, 
              { backgroundColor: inputBackgroundColor, color: textColor }
            ]}
            placeholder="Enter task title"
            placeholderTextColor={placeholderColor}
            value={taskTitle}
            onChangeText={setTaskTitle}
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={handleSubmitEditing}
            accessibilityLabel="Task title input field"
            accessibilityHint="Enter the title of your new task"
            blurOnSubmit={false}
            maxLength={100}
          />
          
          <TouchableOpacity
            testID="add-task-button"
            style={[
              styles.addButton,
              { backgroundColor: primaryColor },
              loading && styles.disabledButton
            ]}
            onPress={() => void addTask()}
            disabled={loading}
            accessibilityLabel="Add task button"
            accessibilityHint="Tap to add the new task to your list"
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator 
                testID="task-loading-indicator" 
                color="#ffffff" 
                size="small"
              />
            ) : (
              <ThemedText style={styles.addButtonText}>+</ThemedText>
            )}
          </TouchableOpacity>
        </ThemedView>
        
        {tasks.length > 0 ? (
          <FlatList
            testID="task-list"
            data={tasks}
            renderItem={renderTaskItem}
            keyExtractor={(item: TaskItem): string => item.id}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            accessibilityLabel="Task list"
            accessibilityHint="List of your tasks"
            keyboardShouldPersistTaps="handled"
          />
        ) : (
          <ThemedView testID="empty-task-list" style={styles.emptyList}>
            <ThemedText 
              style={styles.emptyText}
              accessibilityLabel="No tasks message"
            >
              No tasks yet. Add your first task above!
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  addButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 25,
  },
  disabledButton: {
    opacity: 0.7,
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  list: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
  },
  taskTitle: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  deleteButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
});