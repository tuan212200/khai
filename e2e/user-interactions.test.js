describe('Complex User Interaction E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should handle rapid user interactions without errors', async () => {
    await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(5000);
    
    // Rapidly add multiple items
    const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
    
    for (let i = 0; i < items.length; i++) {
      await element(by.id('grocery-input')).typeText(items[i]);
      await element(by.id('add-item-button')).tap();
      // Small delay to ensure proper processing
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Verify all items are present
    for (let i = 0; i < items.length; i++) {
      await expect(element(by.id(`grocery-item-${i}`))).toBeVisible();
    }
  });

  it('should handle keyboard interactions and text editing', async () => {
    await waitFor(element(by.id('grocery-input'))).toBeVisible().withTimeout(5000);
    
    // Type text and then edit it
    await element(by.id('grocery-input')).typeText('Appl');
    await element(by.id('grocery-input')).typeText('e'); // Complete the word
    await element(by.id('add-item-button')).tap();
    
    await expect(element(by.text('Apple'))).toBeVisible();
    
    // Test text replacement
    await element(by.id('grocery-input')).replaceText('Orange');
    await element(by.id('add-item-button')).tap();
    
    await expect(element(by.text('Orange'))).toBeVisible();
  });

  it('should handle app state changes and recovery', async () => {
    await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(5000);
    
    // Add some items
    await element(by.id('grocery-input')).typeText('Persistent Item');
    await element(by.id('add-item-button')).tap();
    
    // Simulate app backgrounding and foregrounding
    await device.sendToHome();
    await device.launchApp();
    
    // Verify the app recovers properly
    await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(5000);
    await expect(element(by.text('Persistent Item'))).toBeVisible();
  });

  it('should handle orientation changes gracefully', async () => {
    await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(5000);
    
    // Add an item in portrait mode
    await element(by.id('grocery-input')).typeText('Portrait Item');
    await element(by.id('add-item-button')).tap();
    
    // Rotate to landscape
    await device.setOrientation('landscape');
    
    // Verify item is still visible and add another
    await expect(element(by.text('Portrait Item'))).toBeVisible();
    await element(by.id('grocery-input')).typeText('Landscape Item');
    await element(by.id('add-item-button')).tap();
    
    // Rotate back to portrait
    await device.setOrientation('portrait');
    
    // Verify both items are still visible
    await expect(element(by.text('Portrait Item'))).toBeVisible();
    await expect(element(by.text('Landscape Item'))).toBeVisible();
  });

  it('should handle edge cases and error conditions', async () => {
    await waitFor(element(by.id('grocery-input'))).toBeVisible().withTimeout(5000);
    
    // Test special characters
    const specialItem = 'Item with émojis 🍎🥕 & symbols @#$%';
    await element(by.id('grocery-input')).typeText(specialItem);
    await element(by.id('add-item-button')).tap();
    await expect(element(by.text(specialItem))).toBeVisible();
    
    // Test numbers
    await element(by.id('grocery-input')).typeText('12345');
    await element(by.id('add-item-button')).tap();
    await expect(element(by.text('12345'))).toBeVisible();
    
    // Test very short text
    await element(by.id('grocery-input')).typeText('A');
    await element(by.id('add-item-button')).tap();
    await expect(element(by.text('A'))).toBeVisible();
  });

  it('should maintain performance with many items', async () => {
    await waitFor(element(by.id('grocery-input'))).toBeVisible().withTimeout(5000);
    
    // Add many items to test performance
    for (let i = 1; i <= 20; i++) {
      await element(by.id('grocery-input')).typeText(`Item ${i}`);
      await element(by.id('add-item-button')).tap();
    }
    
    // Verify first and last items are visible
    await expect(element(by.text('Item 20'))).toBeVisible(); // Most recent
    
    // Scroll to see older items
    await element(by.id('grocery-list')).scroll(500, 'down');
    
    // The list should still be responsive
    await element(by.id('grocery-input')).typeText('Performance Test');
    await element(by.id('add-item-button')).tap();
    await expect(element(by.text('Performance Test'))).toBeVisible();
  });
});