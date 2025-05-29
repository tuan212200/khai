import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { TaskManager } from './TaskManager';

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock theme hook
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: () => '#000000',
}));

describe('TaskManager Component', () => {
  const mockOnTasksUpdate = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all elements', () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <TaskManager onTasksUpdate={mockOnTasksUpdate} />
    );

    expect(getByTestId('task-manager-container')).toBeTruthy();
    expect(getByTestId('task-manager-title')).toBeTruthy();
    expect(getByTestId('task-input')).toBeTruthy();
    expect(getByTestId('add-task-button')).toBeTruthy();
    expect(getByTestId('empty-task-list')).toBeTruthy();
    
    expect(getByText('Task Manager')).toBeTruthy();
    expect(getByPlaceholderText('Enter task title')).toBeTruthy();
    expect(getByText('No tasks yet. Add your first task above!')).toBeTruthy();
  });

  it('allows adding a task to the list', async () => {
    const { getByTestId, getByText, queryByTestId } = render(
      <TaskManager onTasksUpdate={mockOnTasksUpdate} />
    );

    const input = getByTestId('task-input');
    const addButton = getByTestId('add-task-button');

    // Add a task
    fireEvent.changeText(input, 'Buy groceries');
    fireEvent.press(addButton);

    // Wait for the loading state to finish
    await waitFor(() => {
      expect(queryByTestId('task-loading-indicator')).toBeFalsy();
    });

    // Check that task was added
    expect(getByText('Buy groceries')).toBeTruthy();
    expect(mockOnTasksUpdate).toHaveBeenCalledTimes(1);
    expect(mockOnTasksUpdate).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ title: 'Buy groceries', completed: false })
    ]));

    // Input should be cleared
    expect(input.props.value).toBe('');
  });

  it('shows error alert when trying to add an empty task', () => {
    const { getByTestId } = render(<TaskManager />);
    
    const addButton = getByTestId('add-task-button');
    fireEvent.press(addButton);

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter a task title');
    expect(mockOnTasksUpdate).not.toHaveBeenCalled();
  });

  it('allows toggling task completion status', async () => {
    const initialTasks = [{
      id: '1',
      title: 'Test Task',
      completed: false
    }];

    const { getByTestId } = render(
      <TaskManager initialTasks={initialTasks} onTasksUpdate={mockOnTasksUpdate} />
    );

    const taskToggle = getByTestId('task-toggle-1');
    fireEvent.press(taskToggle);

    expect(mockOnTasksUpdate).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ id: '1', completed: true })
    ]));

    // Press again to toggle back to incomplete
    fireEvent.press(taskToggle);

    expect(mockOnTasksUpdate).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ id: '1', completed: false })
    ]));
  });

  it('shows delete confirmation when deleting a task', () => {
    const initialTasks = [{
      id: '1',
      title: 'Test Task',
      completed: false
    }];

    const { getByTestId } = render(
      <TaskManager initialTasks={initialTasks} onTasksUpdate={mockOnTasksUpdate} />
    );

    const deleteButton = getByTestId('task-delete-1');
    fireEvent.press(deleteButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Delete Task',
      'Are you sure you want to delete this task?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Cancel' }),
        expect.objectContaining({ text: 'Delete' })
      ])
    );
  });

  it('deletes task when confirmed', () => {
    // Mock implementation to extract and call the delete action
    Alert.alert = jest.fn((title, message, buttons) => {
      // Find the delete button and call its onPress function
      const deleteButton = buttons?.find(button => button.text === 'Delete');
      if (deleteButton && deleteButton.onPress) {
        deleteButton.onPress();
      }
      return true;
    });

    const initialTasks = [{
      id: '1',
      title: 'Task to delete',
      completed: false
    }];

    const { getByTestId, queryByText } = render(
      <TaskManager initialTasks={initialTasks} onTasksUpdate={mockOnTasksUpdate} />
    );

    const deleteButton = getByTestId('task-delete-1');
    fireEvent.press(deleteButton);

    // Check that the task was deleted
    expect(queryByText('Task to delete')).toBeFalsy();
    expect(mockOnTasksUpdate).toHaveBeenCalledWith([]);
  });

  it('disables interaction when in loading state', () => {
    const { getByTestId } = render(<TaskManager isLoading={true} />);
    
    const input = getByTestId('task-input');
    const addButton = getByTestId('add-task-button');
    
    expect(input.props.editable).toBe(false);
    expect(addButton.props.disabled).toBe(true);
    expect(getByTestId('task-loading-indicator')).toBeTruthy();
  });

  it('shows loading indicator when submitting a new task', async () => {
    const { getByTestId, queryByTestId } = render(<TaskManager />);
    
    const input = getByTestId('task-input');
    const addButton = getByTestId('add-task-button');
    
    fireEvent.changeText(input, 'New Task');
    fireEvent.press(addButton);
    
    // Should show loading indicator immediately
    expect(getByTestId('task-loading-indicator')).toBeTruthy();
    expect(addButton.props.disabled).toBe(true);
    expect(input.props.editable).toBe(false);
    
    // Wait for the simulated API call to complete
    await waitFor(() => {
      expect(queryByTestId('task-loading-indicator')).toBeFalsy();
    });
    
    // Button should be enabled again
    expect(addButton.props.disabled).toBe(false);
  });

  it('has proper accessibility properties', () => {
    const initialTasks = [{
      id: '1',
      title: 'Accessibility Test Task',
      completed: false
    }];

    const { getByTestId } = render(<TaskManager initialTasks={initialTasks} />);
    
    const input = getByTestId('task-input');
    expect(input.props.accessibilityLabel).toBe('Task title input field');
    expect(input.props.accessibilityHint).toBe('Enter the title of your new task');
    
    const addButton = getByTestId('add-task-button');
    expect(addButton.props.accessibilityLabel).toBe('Add task button');
    expect(addButton.props.accessibilityHint).toBe('Tap to add the new task to your list');
    
    const taskToggle = getByTestId('task-toggle-1');
    expect(taskToggle.props.accessibilityRole).toBe('checkbox');
    expect(taskToggle.props.accessibilityState).toEqual({ checked: false });
    
    const taskItem = getByTestId('task-item-1');
    expect(taskItem.props.accessibilityLabel).toBe('Task: Accessibility Test Task, not completed');
  });
});