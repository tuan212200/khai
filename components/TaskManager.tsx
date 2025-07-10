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
  Modal,
} from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TaskItem {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
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
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskCategory, setTaskCategory] = useState<string>('Personal');
  const [taskDueDate, setTaskDueDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  
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
        description: taskDescription.trim(),
        priority: taskPriority,
        category: taskCategory,
        dueDate: taskDueDate,
        completed: false,
        createdAt: new Date(),
      };
      
      const updatedTasks = [newTask, ...tasks];
      setTasks(updatedTasks);
      setTaskTitle('');
      setTaskDescription('');
      setTaskPriority('medium');
      setTaskCategory('Personal');
      setTaskDueDate(undefined);
      
      // Notify parent component if callback exists
      if (onTasksUpdate) {
        onTasksUpdate(updatedTasks);
      }

      Alert.alert('Success', 'Task added successfully!');
    } catch (error) {
      Alert.alert(
        'Error', 
        error instanceof Error ? error.message : 'Failed to add task'
      );
    } finally {
      setIsSubmitting(false);
      setIsAddModalVisible(false);
    }
  }, [taskTitle, taskDescription, taskPriority, taskCategory, taskDueDate, tasks, onTasksUpdate]);

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
   * Get color for priority badge
   */
  const getPriorityColor = (priority: string) => {
    const p = priorities.find(p => p.value === priority);
    return p?.color || '#666';
  };

  /**
   * Format due date for display
   */
  const formatDueDate = (date?: Date) => {
    if (!date) return null;
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  // Categories and priorities for demo purposes
  const categories = ['Personal', 'Work', 'Shopping', 'Health', 'Learning'];
  const priorities = [
    { value: 'low' as const, label: 'Low', color: '#4CAF50' },
    { value: 'medium' as const, label: 'Medium', color: '#FF9800' },
    { value: 'high' as const, label: 'High', color: '#F44336' },
  ];

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
            onPress={() => setIsAddModalVisible(true)}
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

        {/* Add Task Modal */}
        <Modal
          visible={isAddModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          testID="task-manager-modal"
        >
          <ThemedView style={[styles.modalContainer, { backgroundColor }]}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText type="subtitle">Add New Task</ThemedText>
              <TouchableOpacity
                onPress={() => setIsAddModalVisible(false)}
                testID="task-manager-modal-close"
                accessibilityLabel="Close modal"
              >
                <IconSymbol size={24} name="xmark.circle.fill" color="#666" />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.form}>
              <ThemedView style={styles.inputGroup}>
                <ThemedText style={styles.label}>Title *</ThemedText>
                <TextInput
                  style={[styles.input, { color: textColor, backgroundColor: backgroundColor }]}
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                  placeholder="Enter task title"
                  testID="task-manager-title-input"
                  accessibilityLabel="Task title input"
                />
              </ThemedView>

              <ThemedView style={styles.inputGroup}>
                <ThemedText style={styles.label}>Description</ThemedText>
                <TextInput
                  style={[styles.input, styles.textArea, { color: textColor, backgroundColor: backgroundColor }]}
                  value={taskDescription}
                  onChangeText={setTaskDescription}
                  placeholder="Enter task description"
                  multiline
                  numberOfLines={3}
                  testID="task-manager-description-input"
                  accessibilityLabel="Task description input"
                />
              </ThemedView>

              <ThemedView style={styles.inputGroup}>
                <ThemedText style={styles.label}>Priority</ThemedText>
                <ThemedView style={styles.priorityOptions}>
                  {priorities.map((priority) => (
                    <TouchableOpacity
                      key={priority.value}
                      style={[
                        styles.priorityOption,
                        taskPriority === priority.value && styles.selectedPriority,
                        { borderColor: priority.color }
                      ]}
                      onPress={() => setTaskPriority(priority.value)}
                      testID={`task-manager-priority-${priority.value}`}
                      accessibilityLabel={`Set priority to ${priority.label}`}
                    >
                      <ThemedText style={[
                        styles.priorityOptionText,
                        taskPriority === priority.value && { color: priority.color }
                      ]}>
                        {priority.label}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.inputGroup}>
                <ThemedText style={styles.label}>Category</ThemedText>
                <ThemedView style={styles.categoryOptions}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryOption,
                        taskCategory === category && styles.selectedCategory
                      ]}
                      onPress={() => setTaskCategory(category)}
                      testID={`task-manager-category-${category.toLowerCase()}`}
                      accessibilityLabel={`Set category to ${category}`}
                    >
                      <ThemedText style={[
                        styles.categoryOptionText,
                        taskCategory === category && styles.selectedCategoryText
                      ]}>
                        {category}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => setIsAddModalVisible(false)}
                  testID="task-manager-cancel-button"
                  accessibilityLabel="Cancel task creation"
                >
                  <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={addTask}
                  testID="task-manager-save-button"
                  accessibilityLabel="Save new task"
                >
                  <ThemedText style={styles.saveButtonText}>Add Task</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </Modal>
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
    gap: 16,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
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
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 8,
    gap: 12,
  },
  completedTask: {
    opacity: 0.6,
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
    fontWeight: '500',
    marginLeft: 10,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
  },
  taskDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  categoryText: {
    fontSize: 12,
    opacity: 0.6,
  },
  dueDateText: {
    fontSize: 12,
    opacity: 0.6,
  },
  overdue: {
    color: '#F44336',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 4,
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
  modalContainer: {
    flex: 1,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  selectedPriority: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  selectedCategory: {
    backgroundColor: '#4CAF50',
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Also export as named export for flexibility
export default TaskManager;
export { TaskManager };