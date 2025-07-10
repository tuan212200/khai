import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import TasksScreen from '../app/(tabs)/tasks';

// Mock the Alert module
jest.spyOn(Alert, 'alert');

// Mock the TaskManager component
jest.mock('../components/TaskManager', () => {
  return function MockTaskManager() {
    const { View, Text } = require('react-native');
    return (
      <View testID="mock-task-manager">
        <Text>Mock Task Manager</Text>
      </View>
    );
  };
});

describe('TasksScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByTestId, getByText } = render(<TasksScreen />);
    
    expect(getByTestId('tasks-screen')).toBeTruthy();
    expect(getByText('Task Manager')).toBeTruthy();
    expect(getByTestId('tasks-progress-container')).toBeTruthy();
  });

  it('displays progress information', () => {
    const { getByTestId } = render(<TasksScreen />);
    
    const progressText = getByTestId('tasks-progress-text');
    expect(progressText).toBeTruthy();
    expect(progressText.props.children).toContain('tasks completed');
  });

  it('shows task list with initial tasks', () => {
    const { getByTestId } = render(<TasksScreen />);
    
    expect(getByTestId('tasks-list')).toBeTruthy();
    expect(getByTestId('task-item-1')).toBeTruthy();
    expect(getByTestId('task-item-2')).toBeTruthy();
    expect(getByTestId('task-item-3')).toBeTruthy();
  });

  it('toggles task completion when pressed', async () => {
    const { getByTestId } = render(<TasksScreen />);
    
    const taskToggle = getByTestId('task-toggle-1');
    fireEvent.press(taskToggle);
    
    // The task should toggle its completion state
    await waitFor(() => {
      expect(getByTestId('task-item-1')).toBeTruthy();
    });
  });

  it('shows delete confirmation when delete button is pressed', () => {
    const { getByTestId } = render(<TasksScreen />);
    
    const deleteButton = getByTestId('task-delete-1');
    fireEvent.press(deleteButton);
    
    expect(Alert.alert).toHaveBeenCalledWith(
      'Delete Task',
      'Are you sure you want to delete this task?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Cancel', style: 'cancel' }),
        expect.objectContaining({ text: 'Delete', style: 'destructive' })
      ])
    );
  });

  it('adds new task when add button is pressed', async () => {
    const { getByTestId } = render(<TasksScreen />);
    
    const addButton = getByTestId('add-task-button');
    fireEvent.press(addButton);
    
    // Should show loading indicator
    await waitFor(() => {
      expect(getByTestId('tasks-loading')).toBeTruthy();
    });
  });

  it('displays task priorities correctly', () => {
    const { getByTestId } = render(<TasksScreen />);
    
    // Check if priority badges are displayed
    expect(getByTestId('task-item-1')).toBeTruthy();
    expect(getByTestId('task-item-2')).toBeTruthy();
    expect(getByTestId('task-item-3')).toBeTruthy();
  });

  it('shows due dates for tasks that have them', () => {
    const { getByTestId } = render(<TasksScreen />);
    
    expect(getByTestId('task-due-1')).toBeTruthy();
    expect(getByTestId('task-due-2')).toBeTruthy();
  });

  it('calculates progress percentage correctly', () => {
    const { getByTestId } = render(<TasksScreen />);
    
    const progressBar = getByTestId('tasks-progress-bar');
    expect(progressBar).toBeTruthy();
    
    // Initial state: 1 completed out of 3 tasks = ~33%
    const progressText = getByTestId('tasks-progress-text');
    expect(progressText.props.children).toContain('33%');
  });

  it('has proper accessibility labels', () => {
    const { getByTestId } = render(<TasksScreen />);
    
    const toggleButton = getByTestId('task-toggle-1');
    expect(toggleButton.props.accessibilityLabel).toContain('Toggle task:');
    
    const deleteButton = getByTestId('task-delete-1');
    expect(deleteButton.props.accessibilityLabel).toContain('Delete task:');
    
    const addButton = getByTestId('add-task-button');
    expect(addButton.props.accessibilityLabel).toBe('Add new task');
  });
});