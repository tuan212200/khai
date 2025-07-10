import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import WeatherScreen from '../../app/(tabs)/weather';

// Mock the Alert module
jest.spyOn(Alert, 'alert');

// Mock the components
jest.mock('@/components/ParallaxScrollView', () => {
  const { View } = require('react-native');
  return ({ children, refreshControl, testID }: any) => (
    <View testID={testID}>
      {refreshControl}
      {children}
    </View>
  );
});

jest.mock('@/components/ThemedText', () => {
  const { Text } = require('react-native');
  return ({ children, testID, style }: any) => (
    <Text testID={testID} style={style}>{children}</Text>
  );
});

jest.mock('@/components/ThemedView', () => {
  const { View } = require('react-native');
  return ({ children, testID, style }: any) => (
    <View testID={testID} style={style}>{children}</View>
  );
});

jest.mock('@/components/ui/IconSymbol', () => {
  const { View } = require('react-native');
  return ({ testID, name }: any) => <View testID={testID}>{name}</View>;
});

describe('WeatherScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders weather screen correctly', () => {
    const { getByTestId, getByText } = render(<WeatherScreen />);

    expect(getByTestId('weather-screen')).toBeTruthy();
    expect(getByText('Weather')).toBeTruthy();
    expect(getByTestId('weather-location-container')).toBeTruthy();
    expect(getByTestId('weather-location-text')).toBeTruthy();
  });

  it('displays current weather information', () => {
    const { getByTestId } = render(<WeatherScreen />);

    expect(getByTestId('weather-current-temp')).toBeTruthy();
    expect(getByTestId('weather-current-condition')).toBeTruthy();
    expect(getByTestId('weather-feels-like')).toBeTruthy();
  });

  it('displays weather details grid', () => {
    const { getByTestId } = render(<WeatherScreen />);

    expect(getByTestId('weather-humidity')).toBeTruthy();
    expect(getByTestId('weather-wind-speed')).toBeTruthy();
    expect(getByTestId('weather-uv-index')).toBeTruthy();
    expect(getByTestId('weather-visibility')).toBeTruthy();
    expect(getByTestId('weather-pressure')).toBeTruthy();
  });

  it('displays forecast section', () => {
    const { getByTestId } = render(<WeatherScreen />);

    expect(getByTestId('weather-forecast-container')).toBeTruthy();
    expect(getByTestId('weather-forecast-0')).toBeTruthy();
    expect(getByTestId('weather-forecast-1')).toBeTruthy();
  });

  it('handles refresh functionality', async () => {
    const { getByTestId } = render(<WeatherScreen />);

    const refreshControl = getByTestId('weather-refresh-control');
    fireEvent(refreshControl, 'refresh');

    await waitFor(() => {
      expect(getByTestId('weather-loading')).toBeTruthy();
    });
  });

  it('handles refresh button press', () => {
    const { getByTestId } = render(<WeatherScreen />);

    const refreshButton = getByTestId('weather-refresh-button');
    fireEvent.press(refreshButton);

    // Should trigger loading state
    expect(getByTestId('weather-loading')).toBeTruthy();
  });

  it('shows proper accessibility labels', () => {
    const { getByTestId } = render(<WeatherScreen />);

    const refreshButton = getByTestId('weather-refresh-button');
    expect(refreshButton.props.accessibilityLabel).toBe('Refresh weather data');
  });
});