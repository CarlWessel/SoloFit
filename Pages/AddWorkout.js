import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles, colors } from '../styles';

export default function AddWorkout({ navigation }) {
  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={[styles.text, { fontSize: 24, marginBottom: 20 }]}>
        🏋️ Add Workout Page Test
      </Text>

      <TouchableOpacity
        style={[styles.startButton, { backgroundColor: colors.accent }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.text}>Go Back</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('AddExercises')}>
          <Text style={styles.text}>Add Exercises</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('GPTShowExercisesExample')}>
          <Text style={styles.text}>See Example</Text>
      </TouchableOpacity>
    </View>
  );
}