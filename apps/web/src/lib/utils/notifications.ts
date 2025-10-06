/**
 * Browser Notification utilities for timeline step alerts
 */

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Show a notification to the user
 */
export function showNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return null;
  }

  return new Notification(title, {
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'timeline-notification',
    ...options,
  });
}

/**
 * Schedule a notification for a specific time
 */
export function scheduleNotification(
  title: string,
  time: Date,
  options?: NotificationOptions
): NodeJS.Timeout | null {
  const now = new Date();
  const delay = time.getTime() - now.getTime();

  if (delay <= 0) {
    console.warn('Cannot schedule notification in the past');
    return null;
  }

  return setTimeout(() => {
    showNotification(title, options);
  }, delay);
}

/**
 * Check if notifications are supported and enabled
 */
export function areNotificationsEnabled(): boolean {
  return 'Notification' in window && Notification.permission === 'granted';
}

/**
 * Get notification permission status
 */
export function getNotificationPermission():
  | 'granted'
  | 'denied'
  | 'default'
  | 'unsupported' {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}
