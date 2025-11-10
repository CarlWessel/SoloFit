import React, { useEffect, useState } from 'react';
import { AppState, View, ActivityIndicator, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Utilities
import { requestNotificationPermission, scheduleDailyReminders, recordAppOpened, testImmediateNotification } from './utils/notifications';
import { DBSetup } from './utils/DBSetup';

// Pages
import HomePage from './Pages/HomePage';
import AddRoutine from './Pages/AddRoutine';
import StartWorkout from './Pages/StartWorkout';
import RoutineList from './Pages/RoutineList';
import WorkoutHistory from './Pages/WorkoutHistory';
import PremadeRoutines from './Pages/PremadeRoutines';
import UseWorkout from './Pages/UseWorkout';
import Profile from './Pages/Profile';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState(null);

  // Initialize database BEFORE rendering navigation
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log('Starting database initialization...');
        await DBSetup();
        console.log('Database initialization complete');
        setIsDbReady(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setDbError(error.message);
      }
    };

    initializeDatabase();
  }, []);

  // Setup notifications
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

  // Show minimal loading spinner while database initializes
  if (!isDbReady) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#0a1929' 
      }}>
        <StatusBar style="light" />
        {dbError ? (
          <>
            <Text style={{ 
              color: '#ff6b6b', 
              fontSize: 18, 
              fontWeight: 'bold',
              marginBottom: 10 
            }}>
              ⚠️
            </Text>
            <Text style={{ 
              color: '#fff', 
              fontSize: 14,
              textAlign: 'center',
              paddingHorizontal: 20 
            }}>
              Database initialization failed
            </Text>
            <Text style={{ 
              color: '#aaa', 
              fontSize: 12,
              marginTop: 10,
              textAlign: 'center',
              paddingHorizontal: 20 
            }}>
              Please restart the app
            </Text>
          </>
        ) : (
          <ActivityIndicator size="large" color="#4fc3f7" />
        )}
      </View>
    );
  }

  // Only render navigation after database is ready
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="AddRoutine" component={AddRoutine} />
        <Stack.Screen name="StartWorkout" component={StartWorkout} />
        <Stack.Screen name="RoutineList" component={RoutineList} />
        <Stack.Screen name="WorkoutHistory" component={WorkoutHistory} />
        <Stack.Screen name="PremadeRoutines" component={PremadeRoutines} />
        <Stack.Screen name="UseWorkout" component={UseWorkout} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}