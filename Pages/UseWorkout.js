import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { styles, colors, spacing } from '../styles';
import { openDatabaseAsync } from 'expo-sqlite';

export default function UseWorkout({ navigation, route }) {
  const { workoutId, workoutName, isPremade = false } = route.params;
  const [exercises, setExercises] = useState([]);
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadWorkoutExercises();
  }, []);

  const loadWorkoutExercises = async () => {
    try {
      const db = await openDatabaseAsync('workout.db');
      const exRows = await db.getAllAsync(
        `SELECT e.id, e.name, we.sets, we.reps, we.weight
         FROM routine_exercises we
         JOIN exercises e ON e.id = we.exerciseId
         WHERE we.routineId = ?;`,
        [workoutId]
      );

      // Convert to format for display with sets array
      const formattedExercises = exRows.map((ex, idx) => ({
        id: idx + 1,
        exerciseId: ex.id,
        exerciseName: ex.name,
        sets: Array.from({ length: ex.sets }, (_, i) => ({
          id: i + 1,
          reps: ex.reps.toString(),
          weight: ex.weight.toString(),
        })),
      }));

      setExercises(formattedExercises);
    } catch (error) {
      console.error('Error loading workout exercises:', error);
    }
  };

  const updateSetValue = (exerciseId, setId, key, value) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id !== exerciseId
          ? ex
          : {
              ...ex,
              sets: ex.sets.map((set) =>
                set.id === setId ? { ...set, [key]: value } : set
              ),
            }
      )
    );
  };

  const saveWorkout = async () => {
    if (!workoutDate) {
      Alert.alert('Error', 'Please enter a workout date');
      return;
    }

    try {
      const db = await openDatabaseAsync('workout.db');
      
      // Create a new workout history entry
      const result = await db.runAsync(
        'INSERT INTO workout_history (name, date) VALUES (?, ?);',
        [workoutName, new Date(workoutDate).toISOString()]
      );

      const historyId = result.lastInsertRowId;

      // Insert all exercises
      for (const ex of exercises) {
        for (const set of ex.sets) {
          if (set.reps && set.weight) {
            await db.runAsync(
              'INSERT INTO workout_history_exercises (workoutId, exerciseId, sets, reps, weight) VALUES (?, ?, ?, ?, ?);',
              [historyId, ex.exerciseId, 1, parseInt(set.reps), parseFloat(set.weight)]
            );
          }
        }
      }

      Alert.alert('Success', 'Workout saved to history!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', 'Failed to save workout');
    }
  };

  const RenderExercise = ({ exercise }) => (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 10,
        margin: 10,
        backgroundColor: colors.primary,
      }}
    >
      <Text style={[styles.headerText, { fontSize: 18, marginBottom: 10 }]}>
        {exercise.exerciseName}
      </Text>

      {exercise.sets.map((set) => (
        <View
          key={set.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 5,
          }}
        >
          <Text style={[styles.headerText, { flex: 0.3 }]}>Set {set.id}</Text>
          <TextInput
            style={[styles.textInput, { flex: 1, marginRight: 5 }]}
            placeholder="Reps"
            placeholderTextColor={colors.accent}
            keyboardType="numeric"
            value={set.reps}
            onChangeText={(value) =>
              updateSetValue(exercise.id, set.id, 'reps', value)
            }
          />
          <TextInput
            style={[styles.textInput, { flex: 1 }]}
            placeholder="Weight"
            placeholderTextColor={colors.accent}
            keyboardType="numeric"
            value={set.weight}
            onChangeText={(value) =>
              updateSetValue(exercise.id, set.id, 'weight', value)
            }
          />
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container]}>
      <ScrollView style={styles.container}>
        <View
          style={[
            styles.header,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <Text style={[styles.headerText, { fontSize: 24, marginBottom: 10 }]}>
            {workoutName}
          </Text>
          <Text style={[styles.text, { fontSize: 14, opacity: 0.8 }]}>
            {isPremade ? 'Premade Workout' : 'My Routine'}
          </Text>
        </View>

        <View
          style={{
            alignItems: 'center',
            padding: 10,
            backgroundColor: colors.primary,
          }}
        >
          <Text style={[styles.text, { marginBottom: 5 }]}>Workout Date:</Text>
          <TextInput
            style={[
              {
                height: 40,
                width: '90%',
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 4,
                paddingHorizontal: 8,
                color: colors.accent,
                backgroundColor: colors.background,
                textAlign: 'center',
              },
            ]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.accent}
            value={workoutDate}
            onChangeText={setWorkoutDate}
          />
        </View>

        {exercises.map((exercise) => (
          <RenderExercise key={exercise.id} exercise={exercise} />
        ))}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 10,
        }}
      >
        <TouchableOpacity
          style={[
            styles.startButton,
            { backgroundColor: colors.accent, flex: 1, marginRight: 10 },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.startButton, { flex: 1 }]}
          onPress={saveWorkout}
        >
          <Text style={styles.text}>Save to History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}