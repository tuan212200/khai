/**
 * E2E Test Helpers for Detox Testing
 * Provides reusable functions for common test operations
 */

export const TestHelpers = {
  /**
   * Wait for app to fully load on home screen
   */
  async waitForAppLoad() {
    await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(5000);
  },

  /**
   * Navigate to a specific tab
   */
  async navigateToTab(tabId) {
    await element(by.id(`tab-${tabId}`)).tap();
    await waitFor(element(by.id(`${tabId}-screen`))).toBeVisible().withTimeout(3000);
  },

  /**
   * Add a grocery item to the shopping list
   */
  async addGroceryItem(itemName) {
    await element(by.id('grocery-input')).typeText(itemName);
    await element(by.id('add-item-button')).tap();
    await expect(element(by.text(itemName))).toBeVisible();
  },

  /**
   * Add multiple grocery items
   */
  async addMultipleItems(items) {
    for (const item of items) {
      await this.addGroceryItem(item);
    }
  },

  /**
   * Clear the grocery input field
   */
  async clearGroceryInput() {
    await element(by.id('grocery-input')).clearText();
  },

  /**
   * Verify grocery item exists at specific index
   */
  async verifyGroceryItem(index, expectedText) {
    await expect(element(by.id(`grocery-item-${index}`))).toBeVisible();
    if (expectedText) {
      await expect(element(by.id(`grocery-item-${index}`))).toHaveText(expectedText);
    }
  },

  /**
   * Test collapsible component expansion/collapse
   */
  async testCollapsible(collapsibleId, expectedContentText) {
    // Expand
    await element(by.id(collapsibleId)).tap();
    if (expectedContentText) {
      await waitFor(element(by.text(expectedContentText))).toBeVisible().withTimeout(2000);
    }
    
    // Collapse
    await element(by.id(collapsibleId)).tap();
  },

  /**
   * Simulate app backgrounding and foregrounding
   */
  async simulateAppStateChange() {
    await device.sendToHome();
    await device.launchApp();
    await this.waitForAppLoad();
  },

  /**
   * Test orientation changes
   */
  async testOrientationChange() {
    await device.setOrientation('landscape');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.setOrientation('portrait');
    await new Promise(resolve => setTimeout(resolve, 1000));
  },

  /**
   * Scroll within a specific element
   */
  async scrollElement(elementId, distance = 200, direction = 'down') {
    await element(by.id(elementId)).scroll(distance, direction);
  },

  /**
   * Wait for element with custom timeout
   */
  async waitForElement(elementId, timeout = 3000) {
    await waitFor(element(by.id(elementId))).toBeVisible().withTimeout(timeout);
  },

  /**
   * Type text with delay (useful for slow typing simulation)
   */
  async typeTextSlowly(elementId, text, delay = 100) {
    for (const char of text) {
      await element(by.id(elementId)).typeText(char);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  },

  /**
   * Verify multiple elements are visible
   */
  async verifyElementsVisible(elementIds) {
    for (const id of elementIds) {
      await expect(element(by.id(id))).toBeVisible();
    }
  },

  /**
   * Verify multiple elements are not visible
   */
  async verifyElementsNotVisible(elementIds) {
    for (const id of elementIds) {
      await expect(element(by.id(id))).not.toBeVisible();
    }
  }
};

export const TestData = {
  groceryItems: [
    'Apples',
    'Bananas', 
    'Milk',
    'Bread',
    'Cheese',
    'Eggs',
    'Chicken',
    'Rice',
    'Pasta',
    'Tomatoes'
  ],
  
  specialCharacterItems: [
    'Café au lait ☕',
    'Piña colada 🍹',
    'Jalapeño peppers 🌶️',
    'Crème brûlée',
    'Items with @#$% symbols'
  ],
  
  longItems: [
    'Organic Free-Range Gluten-Free Artisanal Whole Grain Bread with Ancient Grains',
    'Extra Virgin Cold-Pressed Mediterranean Olive Oil in Dark Glass Bottle'
  ],
  
  edgeCaseItems: [
    'A', // Single character
    '12345', // Numbers only
    '   Spaced Item   ', // Leading/trailing spaces
    '', // Empty string
    '!@#$%^&*()', // Special characters only
  ]
};

export const TestConstants = {
  DEFAULT_TIMEOUT: 3000,
  LONG_TIMEOUT: 5000,
  SHORT_TIMEOUT: 1000,
  ANIMATION_DELAY: 500,
  TYPING_DELAY: 100
};