import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface LoginProps {
  /**
   * Function called when login is successful
   */
  onLogin?: (email: string, password: string) => Promise<void> | void;
  /**
   * Function called when forgot password is pressed
   */
  onForgotPassword?: () => void;
  /**
   * External loading state
   */
  isLoading?: boolean;
}

export function Login({
  onLogin,
  onForgotPassword,
  isLoading: externalLoading = false
}: LoginProps): React.JSX.Element {
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);

  // Combined loading state (either external or internal)
  const isLoading = externalLoading || internalLoading;

  // Theme colors
  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const placeholderColor = useThemeColor('placeholder');
  const primaryColor = useThemeColor('primary');
  const inputBackgroundColor = useThemeColor('inputBackground');
  const errorColor = useThemeColor('error');

  /**
   * Validates email format using regex
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (): Promise<void> => {
    Keyboard.dismiss();

    // Validate inputs
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (onLogin) {
      try {
        setInternalLoading(true);
        await onLogin(email, password);
      } catch (error) {
        Alert.alert('Login Failed', 'Invalid email or password');
      } finally {
        setInternalLoading(false);
      }
    }
  };

  /**
   * Handle forgot password
   */
  const handleForgotPassword = (): void => {
    // Dismiss keyboard
    if (onForgotPassword) {
      onForgotPassword();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <ThemedView testID="login-container" style={styles.container}>
        <ThemedText
          testID="login-title"
          style={styles.title}
          accessibilityRole="header"
        >
          Welcome Back
        </ThemedText>

        <ThemedText
          testID="login-subtitle"
          style={styles.subtitle}
        >
          Sign in to your account
        </ThemedText>

        <ThemedView style={styles.formContainer}>
          <TextInput
            testID="login-email-input"
            style={[styles.input, { backgroundColor: inputBackgroundColor, color: textColor }]}
            placeholder="Email"
            placeholderTextColor={placeholderColor}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            editable={!isLoading}
            accessibilityLabel="Email input field"
            accessibilityHint="Enter your email address"
          />

          <TextInput
            testID="login-password-input"
            style={[styles.input, { backgroundColor: inputBackgroundColor, color: textColor }]}
            placeholder="Password"
            placeholderTextColor={placeholderColor}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
            editable={!isLoading}
            accessibilityLabel="Password input field"
            accessibilityHint="Enter your password"
          />

          <TouchableOpacity
            testID="login-submit-button"
            style={[styles.button, { backgroundColor: primaryColor }]}
            onPress={handleSubmit}
            disabled={isLoading}
            accessibilityLabel="Login button"
            accessibilityHint="Tap to sign in to your account"
            accessibilityRole="button"
          >
            {isLoading ? (
              <ActivityIndicator testID="login-loading" color="#ffffff" />
            ) : (
              <ThemedText style={styles.buttonText}>Sign In</ThemedText>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            testID="forgot-password-button"
            onPress={handleForgotPassword}
            disabled={isLoading}
            style={styles.forgotPasswordButton}
            accessibilityLabel="Forgot password button"
            accessibilityHint="Tap to reset your password"
            accessibilityRole="button"
          >
            <ThemedText style={styles.forgotPasswordText}>
              Forgot Password?
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    opacity: 0.7,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    height: 50,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    padding: 16,
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
});