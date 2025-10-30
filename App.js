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
import AddRoutine from './Pages/AddRoutine';
import AddExercises from './Pages/AddExercises';
import StartWorkout from './Pages/StartWorkout';
import RoutineList from './Pages/RoutineList';
import WorkoutHistory from './Pages/WorkoutHistory';
import PremadeWorkouts from './Pages/PremadeWorkouts';
import UseWorkout from './Pages/UseWorkout';
import Example from './Pages/GPTShowExercisesExample';

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
        <Stack.Screen name="AddRoutine" component={AddRoutine} />
        <Stack.Screen name="AddExercises" component={AddExercises} />
        <Stack.Screen name="StartWorkout" component={StartWorkout} />
        <Stack.Screen name="RoutineList" component={RoutineList} />
        <Stack.Screen name="WorkoutHistory" component={WorkoutHistory} />
        <Stack.Screen name="PremadeWorkouts" component={PremadeWorkouts} />
        <Stack.Screen name="UseWorkout" component={UseWorkout} />
        <Stack.Screen name="GPTShowExercisesExample" component={Example} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}