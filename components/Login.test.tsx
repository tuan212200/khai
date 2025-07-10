import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Login } from './Login';

describe('Login Component', () => {
  const mockOnLogin = jest.fn();
  const mockOnForgotPassword = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByTestId } = render(<Login />);
    expect(getByTestId('login-container')).toBeTruthy();
    expect(getByTestId('login-title').props.children).toBe('Welcome Back');
    expect(getByTestId('login-subtitle').props.children).toBe('Sign in to your account');
    expect(getByTestId('login-email-input')).toBeTruthy();
    expect(getByTestId('login-password-input')).toBeTruthy();
    expect(getByTestId('login-submit-button')).toBeTruthy();
    expect(getByTestId('forgot-password-button')).toBeTruthy();
  });

  it('calls onLogin with valid inputs', async () => {
    const { getByTestId } = render(<Login onLogin={mockOnLogin} />);
    const emailInput = getByTestId('login-email-input');
    const passwordInput = getByTestId('login-password-input');
    const submitButton = getByTestId('login-submit-button');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('shows error for invalid email', async () => {
    const { getByTestId, getByText } = render(<Login onLogin={mockOnLogin} />);
    const emailInput = getByTestId('login-email-input');
    const passwordInput = getByTestId('login-password-input');
    const submitButton = getByTestId('login-submit-button');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Error')).toBeTruthy();
      expect(getByText('Please enter a valid email address')).toBeTruthy();
      expect(mockOnLogin).not.toHaveBeenCalled();
    });
  });

  it('shows error for empty password', async () => {
    const { getByTestId, getByText } = render(<Login onLogin={mockOnLogin} />);
    const emailInput = getByTestId('login-email-input');
    const passwordInput = getByTestId('login-password-input');
    const submitButton = getByTestId('login-submit-button');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, '');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Error')).toBeTruthy();
      expect(getByText('Please enter your password')).toBeTruthy();
      expect(mockOnLogin).not.toHaveBeenCalled();
    });
  });

  it('disables inputs and button when loading', () => {
    const { getByTestId } = render(<Login isLoading={true} />);
    const emailInput = getByTestId('login-email-input');
    const passwordInput = getByTestId('login-password-input');
    const submitButton = getByTestId('login-submit-button');

    expect(emailInput.props.editable).toBe(false);
    expect(passwordInput.props.editable).toBe(false);
    expect(submitButton.props.disabled).toBe(true);
  });

  it('calls onForgotPassword when forgot password button is pressed', () => {
    const { getByTestId } = render(<Login onForgotPassword={mockOnForgotPassword} />);
    const forgotPasswordButton = getByTestId('forgot-password-button');

    fireEvent.press(forgotPasswordButton);

    expect(mockOnForgotPassword).toHaveBeenCalled();
  });
});