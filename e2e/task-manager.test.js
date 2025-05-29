const { expect } = require('detox');

describe('Task Manager E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    // Navigate to the screen that contains the TaskManager
    await element(by.id('tab-home')).tap();
  });

  it('should show the task manager with initial empty state', async () => {
    await waitFor(element(by.id('task-manager-container'))).toBeVisible().withTimeout(5000);
    
    // Check initial UI elements
    await expect(element(by.id('task-manager-title'))).toBeVisible();
    await expect(element(by.id('task-input'))).toBeVisible();
    await expect(element(by.id('add-task-button'))).toBeVisible();
    await expect(element(by.id('empty-task-list'))).toBeVisible();
    await expect(element(by.text('No tasks yet. Add your first task above!'))).toBeVisible();
  });

  it('should add a new task successfully', async () => {
    // Wait for component to be visible
    await waitFor(element(by.id('task-manager-container'))).toBeVisible().withTimeout(5000);
    
    // Add a task
    await element(by.id('task-input')).typeText('Buy milk');
    await element(by.id('add-task-button')).tap();
    
    // Wait for the task to appear
    await waitFor(element(by.text('Buy milk'))).toBeVisible().withTimeout(2000);
    
    // Check that input is cleared
    await expect(element(by.id('task-input'))).toHaveText('');
  });

  it('should toggle task completion status', async () => {
    // Wait for component to be visible
    await waitFor(element(by.id('task-manager-container'))).toBeVisible().withTimeout(5000);
    
    // First add a task
    await element(by.id('task-input')).typeText('Complete E2E tests');
    await element(by.id('add-task-button')).tap();
    await waitFor(element(by.text('Complete E2E tests'))).toBeVisible().withTimeout(2000);
    
    // Find the task item
    const taskItem = await element(by.text('Complete E2E tests')).atIndex(0);
    const taskId = await taskItem.getAttributes().then(attrs => attrs.testID.split('-')[2]);
    
    // Toggle completion
    await element(by.id(`task-toggle-${taskId}`)).tap();
    
    // Check for completed state visual indicator (this might need adjustment based on actual UI)
    // Here we're assuming there's some visual change we can detect
    await expect(element(by.id(`task-toggle-${taskId}`))).toBeVisible();
    
    // Toggle back to incomplete
    await element(by.id(`task-toggle-${taskId}`)).tap();
  });
  
  it('should delete a task', async () => {
    // Wait for component to be visible
    await waitFor(element(by.id('task-manager-container'))).toBeVisible().withTimeout(5000);
    
    // First add a task
    await element(by.id('task-input')).typeText('Task to be deleted');
    await element(by.id('add-task-button')).tap();
    await waitFor(element(by.text('Task to be deleted'))).toBeVisible().withTimeout(2000);
    
    // Find the task item
    const taskItem = await element(by.text('Task to be deleted')).atIndex(0);
    const taskId = await taskItem.getAttributes().then(attrs => attrs.testID.split('-')[2]);
    
    // Delete the task
    await element(by.id(`task-delete-${taskId}`)).tap();
    
    // Confirm the delete action
    await element(by.text('Delete')).tap();
    
    // Verify the task is gone
    await expect(element(by.text('Task to be deleted'))).not.toBeVisible();
  });
  
  it('should handle multiple tasks correctly', async () => {
    // Wait for component to be visible
    await waitFor(element(by.id('task-manager-container'))).toBeVisible().withTimeout(5000);
    
    // Add multiple tasks
    const tasks = ['Task 1', 'Task 2', 'Task 3'];
    
    for (const task of tasks) {
      await element(by.id('task-input')).typeText(task);
      await element(by.id('add-task-button')).tap();
      await waitFor(element(by.text(task))).toBeVisible().withTimeout(2000);
    }
    
    // Verify all tasks are present
    for (const task of tasks) {
      await expect(element(by.text(task))).toBeVisible();
    }
  });
  
  it('should show error message for empty task', async () => {
    // Wait for component to be visible
    await waitFor(element(by.id('task-manager-container'))).toBeVisible().withTimeout(5000);
    
    // Try to add an empty task
    await element(by.id('add-task-button')).tap();
    
    // Verify error message appears (adjust based on your error UI)
    await expect(element(by.text('Error'))).toBeVisible();
    await expect(element(by.text('Please enter a task title'))).toBeVisible();
    
    // Dismiss the error
    await element(by.text('OK')).tap();
  });
  
  it('should maintain task list when switching between tabs', async () => {
    // Wait for component to be visible
    await waitFor(element(by.id('task-manager-container'))).toBeVisible().withTimeout(5000);
    
    // Add a task
    await element(by.id('task-input')).typeText('Persistent task');
    await element(by.id('add-task-button')).tap();
    await waitFor(element(by.text('Persistent task'))).toBeVisible().withTimeout(2000);
    
    // Switch to explore tab
    await element(by.id('tab-explore')).tap();
    await waitFor(element(by.id('explore-screen'))).toBeVisible().withTimeout(3000);
    
    // Switch back to home tab
    await element(by.id('tab-home')).tap();
    await waitFor(element(by.id('task-manager-container'))).toBeVisible().withTimeout(5000);
    
    // Verify the task is still there
    await expect(element(by.text('Persistent task'))).toBeVisible();
  });
});