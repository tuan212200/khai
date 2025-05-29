describe('App Navigation and UI Flow Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show the home screen on app launch', async () => {
    // Wait for the app to fully load
    await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(5000);
    
    // Verify main components are visible
    await expect(element(by.text('Welcome!'))).toBeVisible();
    await expect(element(by.text('Grocery Shopping List Demo'))).toBeVisible();
  });

  it('should navigate between tabs successfully', async () => {
    // Ensure we start on home screen
    await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(5000);
    
    // Navigate to explore tab
    await element(by.id('tab-explore')).tap();
    await waitFor(element(by.id('explore-screen'))).toBeVisible().withTimeout(3000);
    await expect(element(by.text('Explore'))).toBeVisible();
    
    // Navigate back to home tab
    await element(by.id('tab-home')).tap();
    await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(3000);
    await expect(element(by.text('Welcome!'))).toBeVisible();
  });

  it('should expand and collapse collapsible components on explore screen', async () => {
    // Navigate to explore screen
    await element(by.id('tab-explore')).tap();
    await waitFor(element(by.id('explore-screen'))).toBeVisible().withTimeout(3000);
    
    // Test file routing collapsible
    await element(by.id('collapsible-file-routing')).tap();
    await waitFor(element(by.text('This app has two screens:'))).toBeVisible().withTimeout(2000);
    
    // Collapse it
    await element(by.id('collapsible-file-routing')).tap();
    
    // Test platform support collapsible
    await element(by.id('collapsible-platform-support')).tap();
    await waitFor(element(by.text('You can open this project on Android, iOS, and the web.'))).toBeVisible().withTimeout(2000);
  });

  it('should handle scrolling on both screens', async () => {
    // Test scrolling on home screen
    await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(5000);
    await element(by.id('home-screen')).scroll(200, 'down');
    await element(by.id('home-screen')).scroll(200, 'up');
    
    // Test scrolling on explore screen
    await element(by.id('tab-explore')).tap();
    await waitFor(element(by.id('explore-screen'))).toBeVisible().withTimeout(3000);
    await element(by.id('explore-screen')).scroll(300, 'down');
    await element(by.id('explore-screen')).scroll(300, 'up');
  });

  it('should maintain state when switching between tabs', async () => {
    // Start on home screen and add a grocery item
    await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(5000);
    await element(by.id('grocery-input')).typeText('Test Item');
    await element(by.id('add-item-button')).tap();
    
    // Switch to explore tab
    await element(by.id('tab-explore')).tap();
    await waitFor(element(by.id('explore-screen'))).toBeVisible().withTimeout(3000);
    
    // Switch back to home tab
    await element(by.id('tab-home')).tap();
    await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(3000);
    
    // Verify the grocery item is still there
    await expect(element(by.text('Test Item'))).toBeVisible();
  });
});
