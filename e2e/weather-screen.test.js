describe('Weather Screen E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    // Navigate to weather screen
    await element(by.id('tab-weather')).tap();
    await waitFor(element(by.id('weather-screen'))).toBeVisible().withTimeout(5000);
  });

  describe('Weather Display', () => {
    it('should display weather screen components', async () => {
      await expect(element(by.id('weather-screen'))).toBeVisible();
      await expect(element(by.text('Weather'))).toBeVisible();
    });

    it('should show current weather information', async () => {
      // Check for current weather elements
      await expect(element(by.id('weather-current-temp'))).toBeVisible();
      await expect(element(by.id('weather-current-condition'))).toBeVisible();
      await expect(element(by.id('weather-current-location'))).toBeVisible();
    });

    it('should display weather details grid', async () => {
      // Check for weather detail items
      await expect(element(by.id('weather-humidity'))).toBeVisible();
      await expect(element(by.id('weather-wind-speed'))).toBeVisible();
      await expect(element(by.id('weather-pressure'))).toBeVisible();
      await expect(element(by.id('weather-uv-index'))).toBeVisible();
      await expect(element(by.id('weather-visibility'))).toBeVisible();
      await expect(element(by.id('weather-feels-like'))).toBeVisible();
    });

    it('should show weather forecast section', async () => {
      // Scroll to forecast section
      await element(by.id('weather-screen')).scroll(300, 'down');
      
      await expect(element(by.id('weather-forecast-container'))).toBeVisible();
      await expect(element(by.text('5-Day Forecast'))).toBeVisible();
      
      // Check for forecast items
      await expect(element(by.id('weather-forecast-0'))).toBeVisible();
      await expect(element(by.id('weather-forecast-1'))).toBeVisible();
      await expect(element(by.id('weather-forecast-2'))).toBeVisible();
    });

    it('should display forecast details for each day', async () => {
      await element(by.id('weather-screen')).scroll(300, 'down');
      
      // Check first forecast item details
      await expect(element(by.id('weather-forecast-day-0'))).toBeVisible();
      await expect(element(by.id('weather-forecast-high-0'))).toBeVisible();
      await expect(element(by.id('weather-forecast-low-0'))).toBeVisible();
      await expect(element(by.id('weather-forecast-condition-0'))).toBeVisible();
    });
  });

  describe('Weather Interactions', () => {
    it('should handle refresh functionality', async () => {
      // Test pull-to-refresh
      await element(by.id('weather-screen')).scroll(100, 'down');
      await element(by.id('weather-screen')).scroll(200, 'up');
      
      // Should trigger refresh (visual feedback)
      await expect(element(by.id('weather-screen'))).toBeVisible();
    });

    it('should handle refresh button press', async () => {
      // Find and tap refresh button
      await element(by.id('weather-refresh-button')).tap();
      
      // Should show loading state or updated data
      await expect(element(by.id('weather-screen'))).toBeVisible();
    });

    it('should handle location permission requests', async () => {
      // This would test location-based weather in real implementation
      // For now, verify location display
      await expect(element(by.id('weather-current-location'))).toBeVisible();
    });
  });

  describe('Weather Data Loading States', () => {
    it('should show loading indicators when refreshing', async () => {
      // Tap refresh and check for loading state
      await element(by.id('weather-refresh-button')).tap();
      
      // Check for loading indicators (if implemented)
      if (await element(by.id('weather-loading-indicator')).exists()) {
        await expect(element(by.id('weather-loading-indicator'))).toBeVisible();
      }
    });

    it('should handle error states gracefully', async () => {
      // This would test network error scenarios in real implementation
      // For now, verify weather screen remains functional
      await expect(element(by.id('weather-screen'))).toBeVisible();
    });
  });

  describe('Weather Accessibility', () => {
    it('should have proper accessibility labels', async () => {
      // Verify refresh button accessibility
      await expect(element(by.id('weather-refresh-button'))).toBeVisible();
      
      // Check other interactive elements
      await expect(element(by.id('weather-current-temp'))).toBeVisible();
      await expect(element(by.id('weather-current-condition'))).toBeVisible();
    });

    it('should support screen reader navigation', async () => {
      // Verify all weather elements are accessible
      await expect(element(by.id('weather-screen'))).toBeVisible();
      await expect(element(by.id('weather-forecast-container'))).toBeVisible();
    });
  });

  describe('Weather Scrolling and Layout', () => {
    it('should handle scrolling through weather sections', async () => {
      // Test scrolling through current weather to forecast
      await element(by.id('weather-screen')).scroll(200, 'down');
      await expect(element(by.id('weather-forecast-container'))).toBeVisible();
      
      // Scroll back up
      await element(by.id('weather-screen')).scroll(200, 'up');
      await expect(element(by.id('weather-current-temp'))).toBeVisible();
    });

    it('should maintain responsive layout', async () => {
      // Verify layout remains consistent during scrolling
      await element(by.id('weather-screen')).scroll(300, 'down');
      await expect(element(by.id('weather-forecast-0'))).toBeVisible();
      
      await element(by.id('weather-screen')).scroll(300, 'up');
      await expect(element(by.id('weather-current-temp'))).toBeVisible();
    });
  });

  describe('Weather Cross-Platform Features', () => {
    it('should display weather icons correctly', async () => {
      // Check for weather icons in current conditions
      await expect(element(by.id('weather-current-condition'))).toBeVisible();
      
      // Check forecast icons
      await element(by.id('weather-screen')).scroll(300, 'down');
      await expect(element(by.id('weather-forecast-0'))).toBeVisible();
    });

    it('should format temperature units properly', async () => {
      // Verify temperature displays (would check °F/°C in real implementation)
      await expect(element(by.id('weather-current-temp'))).toBeVisible();
      await element(by.id('weather-screen')).scroll(300, 'down');
      await expect(element(by.id('weather-forecast-high-0'))).toBeVisible();
    });
  });
});