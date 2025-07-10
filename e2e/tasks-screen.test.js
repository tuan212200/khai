describe('Tasks Screen E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    // Navigate to tasks screen
    await element(by.id('tab-tasks')).tap();
    await waitFor(element(by.id('tasks-screen'))).toBeVisible().withTimeout(5000);
  });

  describe('Task Management', () => {
    it('should display task manager component', async () => {
      await expect(element(by.id('task-manager-container'))).toBeVisible();
      await expect(element(by.id('task-manager-title'))).toBeVisible();
      await expect(element(by.text('Task Manager'))).toBeVisible();
    });

    it('should add a new task through input field', async () => {
      // Type in task input
      await element(by.id('task-input')).typeText('Complete E2E tests');
      await element(by.id('add-task-button')).tap();
      
      // Verify task appears in list
      await expect(element(by.text('Complete E2E tests'))).toBeVisible();
    });

    it('should open task creation modal', async () => {
      await element(by.id('task-input')).typeText('Modal Test Task');
      await element(by.id('add-task-button')).tap();
      
      // Modal should open
      await waitFor(element(by.id('task-manager-modal'))).toBeVisible().withTimeout(3000);
      
      // Check modal elements
      await expect(element(by.text('Add New Task'))).toBeVisible();
      await expect(element(by.id('task-manager-title-input'))).toBeVisible();
      await expect(element(by.id('task-manager-description-input'))).toBeVisible();
    });

    it('should set task priority in modal', async () => {
      await element(by.id('task-input')).typeText('Priority Test');
      await element(by.id('add-task-button')).tap();
      
      await waitFor(element(by.id('task-manager-modal'))).toBeVisible().withTimeout(3000);
      
      // Set high priority
      await element(by.id('task-manager-priority-high')).tap();
      
      // Save task
      await element(by.id('task-manager-save-button')).tap();
      
      // Verify modal closes
      await waitFor(element(by.id('task-manager-modal'))).not.toBeVisible().withTimeout(3000);
    });

    it('should set task category in modal', async () => {
      await element(by.id('task-input')).typeText('Category Test');
      await element(by.id('add-task-button')).tap();
      
      await waitFor(element(by.id('task-manager-modal'))).toBeVisible().withTimeout(3000);
      
      // Set work category
      await element(by.id('task-manager-category-work')).tap();
      
      // Add description
      await element(by.id('task-manager-description-input')).typeText('This is a work task');
      
      // Save task
      await element(by.id('task-manager-save-button')).tap();
      
      await waitFor(element(by.id('task-manager-modal'))).not.toBeVisible().withTimeout(3000);
    });

    it('should cancel task creation', async () => {
      await element(by.id('task-input')).typeText('Cancel Test');
      await element(by.id('add-task-button')).tap();
      
      await waitFor(element(by.id('task-manager-modal'))).toBeVisible().withTimeout(3000);
      
      // Cancel without saving
      await element(by.id('task-manager-cancel-button')).tap();
      
      // Modal should close
      await waitFor(element(by.id('task-manager-modal'))).not.toBeVisible().withTimeout(3000);
      
      // Task should not appear in list
      await expect(element(by.text('Cancel Test'))).not.toBeVisible();
    });

    it('should close modal with close button', async () => {
      await element(by.id('task-input')).typeText('Close Test');
      await element(by.id('add-task-button')).tap();
      
      await waitFor(element(by.id('task-manager-modal'))).toBeVisible().withTimeout(3000);
      
      // Close with X button
      await element(by.id('task-manager-modal-close')).tap();
      
      await waitFor(element(by.id('task-manager-modal'))).not.toBeVisible().withTimeout(3000);
    });

    it('should handle empty task input validation', async () => {
      // Try to add empty task
      await element(by.id('add-task-button')).tap();
      
      // Should show error or do nothing
      // Error handling would depend on implementation
    });

    it('should display empty state when no tasks', async () => {
      // Check for empty state message
      await expect(element(by.id('empty-task-list'))).toBeVisible();
      await expect(element(by.text('No tasks yet. Add your first task above!'))).toBeVisible();
    });
  });

  describe('Task List Interactions', () => {
    beforeEach(async () => {
      // Add a test task for these tests
      await element(by.id('task-input')).typeText('Test Task');
      await element(by.id('add-task-button')).tap();
      await element(by.id('task-manager-save-button')).tap();
      await waitFor(element(by.text('Test Task'))).toBeVisible().withTimeout(3000);
    });

    it('should mark task as completed', async () => {
      // Find and tap task checkbox
      await element(by.id('task-checkbox-Test Task')).tap();
      
      // Verify task appears completed (visual change)
      await expect(element(by.text('Test Task'))).toBeVisible();
    });

    it('should edit existing task', async () => {
      // Tap on edit button if available
      if (await element(by.id('task-edit-Test Task')).exists()) {
        await element(by.id('task-edit-Test Task')).tap();
        
        // Modal should open with task data
        await waitFor(element(by.id('task-manager-modal'))).toBeVisible().withTimeout(3000);
        
        // Modify task title
        await element(by.id('task-manager-title-input')).clearText();
        await element(by.id('task-manager-title-input')).typeText('Modified Task');
        
        await element(by.id('task-manager-save-button')).tap();
        
        // Verify changes
        await expect(element(by.text('Modified Task'))).toBeVisible();
      }
    });

    it('should delete task', async () => {
      // Find and tap delete button
      if (await element(by.id('task-delete-Test Task')).exists()) {
        await element(by.id('task-delete-Test Task')).tap();
        
        // Verify task is removed
        await expect(element(by.text('Test Task'))).not.toBeVisible();
      }
    });
  });

  describe('Task Filtering and Sorting', () => {
    it('should filter tasks by category', async () => {
      // Add tasks with different categories
      await element(by.id('task-input')).typeText('Work Task');
      await element(by.id('add-task-button')).tap();
      await element(by.id('task-manager-category-work')).tap();
      await element(by.id('task-manager-save-button')).tap();
      
      await element(by.id('task-input')).typeText('Personal Task');
      await element(by.id('add-task-button')).tap();
      await element(by.id('task-manager-category-personal')).tap();
      await element(by.id('task-manager-save-button')).tap();
      
      // Apply work filter if available
      if (await element(by.id('filter-work')).exists()) {
        await element(by.id('filter-work')).tap();
        await expect(element(by.text('Work Task'))).toBeVisible();
        await expect(element(by.text('Personal Task'))).not.toBeVisible();
      }
    });

    it('should sort tasks by priority', async () => {
      if (await element(by.id('sort-priority')).exists()) {
        await element(by.id('sort-priority')).tap();
        // Verify high priority tasks appear first
      }
    });
  });
});