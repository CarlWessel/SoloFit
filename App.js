import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppState } from 'react-native';

// Page Imports
import HomePage from './Pages/HomePage';
import AddWorkout from './Pages/AddWorkout';
import { requestNotificationPermission, scheduleDailyReminders, recordAppOpened, testImmediateNotification } from './utils/notifications';

const Stack = createNativeStackNavigator();

export default function App() {

  useEffect(() => {
    const setupNotifications = async () => {
      const granted = await requestNotificationPermission();
      if (granted) {
        await scheduleDailyReminders();

        // Uncomment this line to test immediate notification
        // await testImmediateNotification();
      }
    };

    setupNotifications();

    // Track when app becomes active
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        recordAppOpened();
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="AddWorkout" component={AddWorkout} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}