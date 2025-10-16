import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { File, Directory } from 'expo-file-system';
import { useEffect } from 'react';


// Page Imports
import HomePage from './Pages/HomePage';
import AddWorkout from './Pages/AddWorkout';
import AddExercises from './Pages/AddExercises';
import {DBSetup} from './utils/DBSetup';
import Example, {GPTShowEcercisesExample} from './Pages/GPTShowExercisesExample';

const Stack = createNativeStackNavigator();

export default function App() {

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
        <Stack.Screen name="GPTShowExercisesExample" component={Example} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}