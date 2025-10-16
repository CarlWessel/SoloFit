import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles, colors } from '../styles';
import { AddExercises } from './AddExercises';

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
        <Text style={styles.startText}>Go Back</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('AddExercises')}>
          <Text style={styles.startText}>Add Exercises</Text>
      </TouchableOpacity>
    </View>
  );
}