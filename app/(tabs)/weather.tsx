import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  uvIndex: number;
  visibility: number;
  pressure: number;
}

interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

export default function WeatherScreen() {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 22,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 8,
    feelsLike: 25,
    uvIndex: 6,
    visibility: 10,
    pressure: 1013,
  });
  
  const [forecast, setForecast] = useState<ForecastDay[]>([
    { day: 'Today', high: 24, low: 18, condition: 'Partly Cloudy', icon: 'cloud.sun.fill' },
    { day: 'Tomorrow', high: 26, low: 20, condition: 'Sunny', icon: 'sun.max.fill' },
    { day: 'Thursday', high: 23, low: 17, condition: 'Rainy', icon: 'cloud.rain.fill' },
    { day: 'Friday', high: 21, low: 15, condition: 'Cloudy', icon: 'cloud.fill' },
    { day: 'Saturday', high: 25, low: 19, condition: 'Sunny', icon: 'sun.max.fill' },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState('Ho Chi Minh City');

  const fetchWeatherData = async () => {
    try {
      setIsLoading(true);
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockWeather: WeatherData = {
        temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
        feelsLike: Math.floor(Math.random() * 15) + 22, // 22-37°C
        uvIndex: Math.floor(Math.random() * 10) + 1, // 1-10
        visibility: Math.floor(Math.random() * 20) + 5, // 5-25 km
        pressure: Math.floor(Math.random() * 50) + 990, // 990-1040 hPa
      };

      setWeatherData(mockWeather);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchWeatherData();
  }, []);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return 'sun.max.fill';
      case 'partly cloudy':
        return 'cloud.sun.fill';
      case 'cloudy':
        return 'cloud.fill';
      case 'rainy':
        return 'cloud.rain.fill';
      default:
        return 'cloud.sun.fill';
    }
  };

  const getUVIndexColor = (uvIndex: number) => {
    if (uvIndex <= 2) return '#4CAF50'; // Low - Green
    if (uvIndex <= 5) return '#FFEB3B'; // Moderate - Yellow
    if (uvIndex <= 7) return '#FF9800'; // High - Orange
    if (uvIndex <= 10) return '#F44336'; // Very High - Red
    return '#9C27B0'; // Extreme - Purple
  };

  const getUVIndexLabel = (uvIndex: number) => {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
  };

  return (
    <ParallaxScrollView
      testID="weather-screen"
      headerBackgroundColor={{ light: '#2196F3', dark: '#1565C0' }}
      headerImage={
        <IconSymbol
          size={250}
          color="#ffffff"
          name={getWeatherIcon(weatherData.condition)}
          style={styles.headerImage}
        />
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          testID="weather-refresh-control"
        />
      }>
      
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Weather</ThemedText>
        {isLoading && <ActivityIndicator testID="weather-loading" size="small" />}
      </ThemedView>

      <ThemedView style={styles.locationContainer} testID="weather-location-container">
        <IconSymbol size={20} name="location.fill" color="#666" />
        <ThemedText style={styles.locationText} testID="weather-location-text">
          {location}
        </ThemedText>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={onRefresh}
          testID="weather-refresh-button"
          accessibilityLabel="Refresh weather data"
          accessibilityHint="Updates the current weather information"
        >
          <IconSymbol size={20} name="arrow.clockwise" color="#2196F3" />
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.currentWeatherContainer} testID="weather-current-container">
        <ThemedView style={styles.temperatureSection}>
          <ThemedText style={styles.temperature} testID="weather-temperature">
            {weatherData.temperature}°C
          </ThemedText>
          <ThemedText style={styles.condition} testID="weather-condition">
            {weatherData.condition}
          </ThemedText>
          <ThemedText style={styles.feelsLike} testID="weather-feels-like">
            Feels like {weatherData.feelsLike}°C
          </ThemedText>
        </ThemedView>
        <IconSymbol
          size={80}
          name={getWeatherIcon(weatherData.condition)}
          color="#2196F3"
          style={styles.weatherIcon}
        />
      </ThemedView>

      <ThemedView style={styles.detailsContainer} testID="weather-details-container">
        <ThemedText type="subtitle">Weather Details</ThemedText>
        <ThemedView style={styles.detailsGrid}>
          <ThemedView style={styles.detailItem} testID="weather-detail-humidity">
            <IconSymbol size={24} name="humidity.fill" color="#2196F3" />
            <ThemedText style={styles.detailLabel}>Humidity</ThemedText>
            <ThemedText style={styles.detailValue}>{weatherData.humidity}%</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.detailItem} testID="weather-detail-wind">
            <IconSymbol size={24} name="wind" color="#2196F3" />
            <ThemedText style={styles.detailLabel}>Wind Speed</ThemedText>
            <ThemedText style={styles.detailValue}>{weatherData.windSpeed} km/h</ThemedText>
          </ThemedView>

          <ThemedView style={styles.detailItem} testID="weather-detail-uv">
            <IconSymbol size={24} name="sun.max.fill" color={getUVIndexColor(weatherData.uvIndex)} />
            <ThemedText style={styles.detailLabel}>UV Index</ThemedText>
            <ThemedText style={[styles.detailValue, { color: getUVIndexColor(weatherData.uvIndex) }]}>
              {weatherData.uvIndex} ({getUVIndexLabel(weatherData.uvIndex)})
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.detailItem} testID="weather-detail-visibility">
            <IconSymbol size={24} name="eye.fill" color="#2196F3" />
            <ThemedText style={styles.detailLabel}>Visibility</ThemedText>
            <ThemedText style={styles.detailValue}>{weatherData.visibility} km</ThemedText>
          </ThemedView>

          <ThemedView style={styles.detailItem} testID="weather-detail-pressure">
            <IconSymbol size={24} name="barometer" color="#2196F3" />
            <ThemedText style={styles.detailLabel}>Pressure</ThemedText>
            <ThemedText style={styles.detailValue}>{weatherData.pressure} hPa</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.forecastContainer} testID="weather-forecast-container">
        <ThemedText type="subtitle">5-Day Forecast</ThemedText>
        <ThemedView style={styles.forecastList}>
          {forecast.map((day, index) => (
            <ThemedView key={index} style={styles.forecastItem} testID={`weather-forecast-${index}`}>
              <ThemedText style={styles.forecastDay} testID={`weather-forecast-day-${index}`}>
                {day.day}
              </ThemedText>
              <IconSymbol size={24} name={day.icon} color="#2196F3" />
              <ThemedView style={styles.forecastTemps}>
                <ThemedText style={styles.forecastHigh} testID={`weather-forecast-high-${index}`}>
                  {day.high}°
                </ThemedText>
                <ThemedText style={styles.forecastLow} testID={`weather-forecast-low-${index}`}>
                  {day.low}°
                </ThemedText>
              </ThemedView>
              <ThemedText style={styles.forecastCondition} testID={`weather-forecast-condition-${index}`}>
                {day.condition}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -50,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    padding: 12,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderRadius: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  refreshButton: {
    padding: 4,
  },
  currentWeatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderRadius: 12,
  },
  temperatureSection: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  condition: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 4,
  },
  feelsLike: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  weatherIcon: {
    marginLeft: 20,
  },
  detailsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    gap: 8,
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  forecastContainer: {
    gap: 16,
  },
  forecastList: {
    gap: 12,
  },
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    gap: 12,
  },
  forecastDay: {
    fontSize: 14,
    fontWeight: '500',
    width: 80,
  },
  forecastTemps: {
    flexDirection: 'row',
    gap: 8,
    minWidth: 60,
  },
  forecastHigh: {
    fontSize: 14,
    fontWeight: '600',
  },
  forecastLow: {
    fontSize: 14,
    opacity: 0.7,
  },
  forecastCondition: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
  },
});