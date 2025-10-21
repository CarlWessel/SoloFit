/* You may encounter an error: ERROR expo-notifications: Android Push notifications 
(remote notifications) functionality provided by expo-notifications was removed from 
Expo Go with the release of SDK 53. Use a development build instead of Expo Go. */

// We will need to create a development build. For now, this should work fine.

import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

// --- Permissions setup ---
export async function requestNotificationPermission() {
  const settings = await Notifications.getPermissionsAsync();
  let status = settings.status;

  if (status !== 'granted') {
    const newSettings = await Notifications.requestPermissionsAsync();
    status = newSettings.status;
  }

  return status === 'granted';
}

// --- Notification behavior setup ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// --- Helper: check if user opened app today ---
async function hasOpenedToday() {
  const today = new Date().toDateString();
  const lastOpened = await AsyncStorage.getItem('lastOpenedDate');
  return lastOpened === today;
}

// --- Helper: save app open date ---
export async function recordAppOpened() {
  const today = new Date().toDateString();
  await AsyncStorage.setItem('lastOpenedDate', today);
}

// --- Schedule daily reminders ---
export async function scheduleDailyReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();

  // 8am reminder
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "SoloFit - Time to work out! 💪",
      body: "Start your day strong with a quick workout.",
    },
    trigger: {
      hour: 8,
      minute: 0,
      repeats: true,
    },
  });

  // 5pm reminder — only if user hasn’t opened the app yet
  const opened = await hasOpenedToday();
  if (!opened) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "SoloFit - Don't forget your workout! 🏋️‍♂️",
        body: "Let's put in the work today!",
      },
      trigger: {
        hour: 17,
        minute: 0,
        repeats: true,
      },
    });
  }
}

// --- TEST NOTIFICATION ---
export async function testImmediateNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔔 Test Notification',
      body: 'This is a test! Notifications pop up.',
    },
    trigger: null, // triggers immediately
  });
}
