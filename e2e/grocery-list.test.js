describe('Grocery Shopping List E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display the grocery shopping list component on home screen', async () => {
    // Wait for the home screen to load
    await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(5000);
    
    // Check if grocery shopping list is visible
    await expect(element(by.id('grocery-shopping-list'))).toBeVisible();
    await expect(element(by.id('grocery-input'))).toBeVisible();
    await expect(element(by.id('add-item-button'))).toBeVisible();
  });

  it('should allow user to add a single grocery item', async () => {
    // Wait for components to be visible
    await waitFor(element(by.id('grocery-input'))).toBeVisible().withTimeout(5000);
    
    // Type in the input field
    await element(by.id('grocery-input')).typeText('Apples');
    
    // Tap the add button
    await element(by.id('add-item-button')).tap();
    
    // Check if the item appears in the list
    await expect(element(by.id('grocery-item-0'))).toBeVisible();
    await expect(element(by.text('Apples'))).toBeVisible();
    
    // Check if input field is cleared
    await expect(element(by.id('grocery-input'))).toHaveText('');
  });

  it('should allow user to add multiple grocery items', async () => {
    await waitFor(element(by.id('grocery-input'))).toBeVisible().withTimeout(5000);
    
    // Add first item
    await element(by.id('grocery-input')).typeText('Bananas');
    await element(by.id('add-item-button')).tap();
    await expect(element(by.text('Bananas'))).toBeVisible();
    
    // Add second item
    await element(by.id('grocery-input')).typeText('Milk');
    await element(by.id('add-item-button')).tap();
    await expect(element(by.text('Milk'))).toBeVisible();
    
    // Add third item
    await element(by.id('grocery-input')).typeText('Bread');
    await element(by.id('add-item-button')).tap();
    await expect(element(by.text('Bread'))).toBeVisible();
    
    // Verify all items are visible (newest first)
    await expect(element(by.id('grocery-item-0'))).toBeVisible(); // Bread
    await expect(element(by.id('grocery-item-1'))).toBeVisible(); // Milk
    await expect(element(by.id('grocery-item-2'))).toBeVisible(); // Bananas
  });

  it('should not add empty items to the list', async () => {
    await waitFor(element(by.id('grocery-input'))).toBeVisible().withTimeout(5000);
    
    // Try to add empty item
    await element(by.id('add-item-button')).tap();
    
    // Check that no item was added
    await expect(element(by.id('grocery-item-0'))).not.toBeVisible();
    
    // Try to add item with only spaces
    await element(by.id('grocery-input')).typeText('   ');
    await element(by.id('add-item-button')).tap();
    
    // Check that no item was added
    await expect(element(by.id('grocery-item-0'))).not.toBeVisible();
  });

  it('should handle long grocery item names', async () => {
    await waitFor(element(by.id('grocery-input'))).toBeVisible().withTimeout(5000);
    
    const longItemName = 'Organic Free-Range Gluten-Free Artisanal Whole Grain Bread';
    
    await element(by.id('grocery-input')).typeText(longItemName);
    await element(by.id('add-item-button')).tap();
    
    await expect(element(by.text(longItemName))).toBeVisible();
    await expect(element(by.id('grocery-item-0'))).toBeVisible();
  });

  it('should maintain items order (newest first)', async () => {
    await waitFor(element(by.id('grocery-input'))).toBeVisible().withTimeout(5000);
    
    // Add items in sequence
    const items = ['First Item', 'Second Item', 'Third Item'];
    
    for (const item of items) {
      await element(by.id('grocery-input')).typeText(item);
      await element(by.id('add-item-button')).tap();
      await element(by.id('grocery-input')).clearText();
    }
    
    // Verify order (newest first)
    await expect(element(by.id('grocery-item-0')).atIndex(0)).toHaveText('Third Item');
    await expect(element(by.id('grocery-item-1')).atIndex(0)).toHaveText('Second Item');
    await expect(element(by.id('grocery-item-2')).atIndex(0)).toHaveText('First Item');
  });
});