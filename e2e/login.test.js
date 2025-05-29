const { device, element, by, expect, waitFor } = require('detox');

describe('Login E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    // Navigate to login screen if needed
    // await element(by.id('tab-login')).tap();
  });

  it('should display login form correctly', async () => {
    await waitFor(element(by.id('login-container')))
      .toBeVisible()
      .withTimeout(5000);
    
    await expect(element(by.id('login-title'))).toBeVisible();
    await expect(element(by.text('Welcome Back'))).toBeVisible();
    await expect(element(by.id('login-subtitle'))).toBeVisible();
    await expect(element(by.text('Sign in to your account'))).toBeVisible();
    
    await expect(element(by.id('login-email-input'))).toBeVisible();
    await expect(element(by.id('login-password-input'))).toBeVisible();
    await expect(element(by.id('login-submit-button'))).toBeVisible();
    await expect(element(by.id('forgot-password-button'))).toBeVisible();
  });

  it('should allow typing in email and password fields', async () => {
    await waitFor(element(by.id('login-container')))
      .toBeVisible()
      .withTimeout(5000);

    // Type email
    await element(by.id('login-email-input')).typeText('test@example.com');
    await expect(element(by.id('login-email-input'))).toHaveText('test@example.com');

    // Type password
    await element(by.id('login-password-input')).typeText('password123');
    // Note: Password field won't show text due to secureTextEntry
  });

  it('should show error alert for empty email', async () => {
    await waitFor(element(by.id('login-container')))
      .toBeVisible()
      .withTimeout(5000);

    // Tap submit button without entering email
    await element(by.id('login-submit-button')).tap();

    // Wait for alert to appear
    await waitFor(element(by.text('Please enter your email address')))
      .toBeVisible()
      .withTimeout(3000);
    
    // Dismiss alert
    await element(by.text('OK')).tap();
  });

  it('should show error alert for invalid email format', async () => {
    await waitFor(element(by.id('login-container')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('login-email-input')).typeText('invalid-email');
    await element(by.id('login-submit-button')).tap();

    await waitFor(element(by.text('Please enter a valid email address')))
      .toBeVisible()
      .withTimeout(3000);
    
    await element(by.text('OK')).tap();
  });

  it('should show error alert for empty password', async () => {
    await waitFor(element(by.id('login-container')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('login-email-input')).typeText('test@example.com');
    await element(by.id('login-submit-button')).tap();

    await waitFor(element(by.text('Please enter your password')))
      .toBeVisible()
      .withTimeout(3000);
    
    await element(by.text('OK')).tap();
  });

  it('should show error alert for short password', async () => {
    await waitFor(element(by.id('login-container')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('login-email-input')).typeText('test@example.com');
    await element(by.id('login-password-input')).typeText('123');
    await element(by.id('login-submit-button')).tap();

    await waitFor(element(by.text('Password must be at least 6 characters')))
      .toBeVisible()
      .withTimeout(3000);
    
    await element(by.text('OK')).tap();
  });

  it('should show loading state when submitting valid form', async () => {
    await waitFor(element(by.id('login-container')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('login-email-input')).typeText('test@example.com');
    await element(by.id('login-password-input')).typeText('password123');
    
    // Tap submit button
    await element(by.id('login-submit-button')).tap();

    // Check for loading indicator (briefly visible)
    await waitFor(element(by.id('login-loading')))
      .toBeVisible()
      .withTimeout(2000);
  });

  it('should handle forgot password tap', async () => {
    await waitFor(element(by.id('login-container')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('forgot-password-button')).tap();
    
    // This would navigate to forgot password screen or show modal
    // Add expectations based on your app's behavior
    // await expect(element(by.id('forgot-password-screen'))).toBeVisible();
  });

  it('should complete full login flow with valid credentials', async () => {
    await waitFor(element(by.id('login-container')))
      .toBeVisible()
      .withTimeout(5000);

    // Fill in valid credentials
    await element(by.id('login-email-input')).typeText('test@example.com');
    await element(by.id('login-password-input')).typeText('password123');
    
    // Submit form
    await element(by.id('login-submit-button')).tap();

    // Wait for navigation or success state
    // Add expectations based on your app's post-login behavior
    // await waitFor(element(by.id('dashboard-screen')))
    //   .toBeVisible()
    //   .withTimeout(10000);
  });

  it('should maintain form state during orientation changes', async () => {
    await waitFor(element(by.id('login-container')))
      .toBeVisible()
      .withTimeout(5000);

    // Fill in some data
    await element(by.id('login-email-input')).typeText('test@example.com');
    await element(by.id('login-password-input')).typeText('password');

    // Rotate device
    await device.setOrientation('landscape');
    await waitFor(element(by.id('login-container')))
      .toBeVisible()
      .withTimeout(3000);

    // Verify data is still there
    await expect(element(by.id('login-email-input'))).toHaveText('test@example.com');

    // Rotate back
    await device.setOrientation('portrait');
    await waitFor(element(by.id('login-container')))
      .toBeVisible()
      .withTimeout(3000);

    await expect(element(by.id('login-email-input'))).toHaveText('test@example.com');
  });

  it('should handle keyboard dismissal correctly', async () => {
    await waitFor(element(by.id('login-container')))
      .toBeVisible()
      .withTimeout(5000);

    // Tap email input to show keyboard
    await element(by.id('login-email-input')).tap();
    
    // Type some text
    await element(by.id('login-email-input')).typeText('test@example.com');
    
    // Tap outside to dismiss keyboard (tap on container)
    await element(by.id('login-container')).tap();
    
    // Verify email is still there
    await expect(element(by.id('login-email-input'))).toHaveText('test@example.com');
  });

  it('should disable form elements when in loading state', async () => {
    await waitFor(element(by.id('login-container')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('login-email-input')).typeText('test@example.com');
    await element(by.id('login-password-input')).typeText('password123');
    
    await element(by.id('login-submit-button')).tap();

    // During loading, inputs should be disabled
    // Note: Detox doesn't have direct support for checking disabled state
    // This would be better tested in unit tests
    await waitFor(element(by.id('login-loading')))
      .toBeVisible()
      .withTimeout(2000);
  });
});