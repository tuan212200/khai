import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import NotificationCenter from '../components/NotificationCenter';

const mockNotifications = [
  {
    id: '1',
    title: 'Test Notification 1',
    message: 'This is a test message',
    type: 'info' as const,
    timestamp: new Date('2024-06-04T10:00:00Z'),
    read: false,
  },
  {
    id: '2',
    title: 'Success Notification',
    message: 'Task completed successfully',
    type: 'success' as const,
    timestamp: new Date('2024-06-04T09:00:00Z'),
    read: true,
  },
  {
    id: '3',
    title: 'Warning Alert',
    message: 'This is a warning message',
    type: 'warning' as const,
    timestamp: new Date('2024-06-04T08:00:00Z'),
    read: false,
  },
];

describe('NotificationCenter', () => {
  const mockOnNotificationPress = jest.fn();
  const mockOnClearAll = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with notifications', () => {
    const { getByTestId, getByText } = render(
      <NotificationCenter
        notifications={mockNotifications}
        onNotificationPress={mockOnNotificationPress}
        onClearAll={mockOnClearAll}
      />
    );

    expect(getByTestId('notification-center')).toBeTruthy();
    expect(getByText('Notifications (2)')).toBeTruthy(); // 2 unread notifications
    expect(getByTestId('notifications-list')).toBeTruthy();
  });

  it('displays empty state when no notifications', () => {
    const { getByTestId, getByText } = render(
      <NotificationCenter
        notifications={[]}
        onNotificationPress={mockOnNotificationPress}
        onClearAll={mockOnClearAll}
      />
    );

    expect(getByTestId('notifications-empty')).toBeTruthy();
    expect(getByText('No notifications yet')).toBeTruthy();
  });

  it('filters notifications by search query', () => {
    const { getByTestId, queryByTestId } = render(
      <NotificationCenter
        notifications={mockNotifications}
        onNotificationPress={mockOnNotificationPress}
        onClearAll={mockOnClearAll}
      />
    );

    const searchInput = getByTestId('notification-search');
    fireEvent.changeText(searchInput, 'Success');

    // Should only show the success notification
    expect(queryByTestId('notification-item-2')).toBeTruthy();
    expect(queryByTestId('notification-item-1')).toBeFalsy();
    expect(queryByTestId('notification-item-3')).toBeFalsy();
  });

  it('filters notifications by read status', () => {
    const { getByTestId, queryByTestId } = render(
      <NotificationCenter
        notifications={mockNotifications}
        onNotificationPress={mockOnNotificationPress}
        onClearAll={mockOnClearAll}
      />
    );

    const unreadFilter = getByTestId('notification-filter-unread');
    fireEvent.press(unreadFilter);

    // Should only show unread notifications
    expect(queryByTestId('notification-item-1')).toBeTruthy();
    expect(queryByTestId('notification-item-3')).toBeTruthy();
    expect(queryByTestId('notification-item-2')).toBeFalsy();
  });

  it('calls onNotificationPress when notification is pressed', () => {
    const { getByTestId } = render(
      <NotificationCenter
        notifications={mockNotifications}
        onNotificationPress={mockOnNotificationPress}
        onClearAll={mockOnClearAll}
      />
    );

    const notification = getByTestId('notification-item-1');
    fireEvent.press(notification);

    expect(mockOnNotificationPress).toHaveBeenCalledWith(mockNotifications[0]);
  });

  it('calls onClearAll when clear all button is pressed', () => {
    const { getByTestId } = render(
      <NotificationCenter
        notifications={mockNotifications}
        onNotificationPress={mockOnNotificationPress}
        onClearAll={mockOnClearAll}
      />
    );

    const clearButton = getByTestId('notification-clear-all');
    fireEvent.press(clearButton);

    expect(mockOnClearAll).toHaveBeenCalled();
  });

  it('displays correct notification types with proper icons', () => {
    const { getByTestId } = render(
      <NotificationCenter
        notifications={mockNotifications}
        onNotificationPress={mockOnNotificationPress}
        onClearAll={mockOnClearAll}
      />
    );

    // Check if all notification items are rendered
    expect(getByTestId('notification-item-1')).toBeTruthy();
    expect(getByTestId('notification-item-2')).toBeTruthy();
    expect(getByTestId('notification-item-3')).toBeTruthy();
  });

  it('shows unread indicators for unread notifications', () => {
    const { getByTestId, queryByTestId } = render(
      <NotificationCenter
        notifications={mockNotifications}
        onNotificationPress={mockOnNotificationPress}
        onClearAll={mockOnClearAll}
      />
    );

    // Unread notifications should have unread dots
    expect(getByTestId('notification-unread-1')).toBeTruthy();
    expect(getByTestId('notification-unread-3')).toBeTruthy();
    
    // Read notification should not have unread dot
    expect(queryByTestId('notification-unread-2')).toBeFalsy();
  });

  it('has proper accessibility labels', () => {
    const { getByTestId } = render(
      <NotificationCenter
        notifications={mockNotifications}
        onNotificationPress={mockOnNotificationPress}
        onClearAll={mockOnClearAll}
      />
    );

    const searchInput = getByTestId('notification-search');
    expect(searchInput.props.accessibilityLabel).toBe('Search notifications');

    const filterAll = getByTestId('notification-filter-all');
    expect(filterAll.props.accessibilityLabel).toBe('Show all notifications');

    const filterUnread = getByTestId('notification-filter-unread');
    expect(filterUnread.props.accessibilityLabel).toBe('Show unread notifications');

    const clearButton = getByTestId('notification-clear-all');
    expect(clearButton.props.accessibilityLabel).toBe('Clear all notifications');
  });

  it('shows correct unread count in title', () => {
    const { getByText } = render(
      <NotificationCenter
        notifications={mockNotifications}
        onNotificationPress={mockOnNotificationPress}
        onClearAll={mockOnClearAll}
      />
    );

    // Should show "Notifications (2)" since there are 2 unread notifications
    expect(getByText('Notifications (2)')).toBeTruthy();
  });

  it('handles empty search results', () => {
    const { getByTestId, getByText } = render(
      <NotificationCenter
        notifications={mockNotifications}
        onNotificationPress={mockOnNotificationPress}
        onClearAll={mockOnClearAll}
      />
    );

    const searchInput = getByTestId('notification-search');
    fireEvent.changeText(searchInput, 'nonexistent');

    expect(getByTestId('notifications-empty')).toBeTruthy();
    expect(getByText('No matching notifications')).toBeTruthy();
  });
});