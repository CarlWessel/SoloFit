import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Utilities
import { requestNotificationPermission, scheduleDailyReminders, recordAppOpened, testImmediateNotification } from './utils/notifications';
import { DBSetup } from './utils/DBSetup';

// Pages
import HomePage from './Pages/HomePage';
import AddWorkout from './Pages/AddWorkout';
import AddExercises from './Pages/AddExercises';
import WorkoutList from './Pages/WorkoutList';
import Example, { GPTShowEcercisesExample } from './Pages/GPTShowExercisesExample';

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

  // Initialize the database
  useEffect(() => {
      DBSetup();
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
        <Stack.Screen name="AddExercises" component={AddExercises} />
        <Stack.Screen name="WorkoutList" component={WorkoutList} />
        <Stack.Screen name="GPTShowExercisesExample" component={Example} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}