import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { styles } from '../styles';
import { MaterialIcons } from '@expo/vector-icons';
import { openDatabaseAsync } from 'expo-sqlite';

export default function PremadeWorkouts({ navigation }) {
  const [premadeWorkouts, setPremadeWorkouts] = useState([]);

  useEffect(() => {
    loadPremadeWorkouts();
  }, []);

  const loadPremadeWorkouts = async () => {
    try {
      const db = await openDatabaseAsync('workout.db');
      // Premade workouts have IDs 1-5 based on PreMadeRoutines.json
      const premadeRows = await db.getAllAsync(
        'SELECT * FROM routines WHERE id <= 5;'
      );
      
      const premadeWithExercises = [];
      for (const premade of premadeRows) {
        const exRows = await db.getAllAsync(
          `SELECT e.name, we.sets, we.reps, we.weight
           FROM routine_exercises we
           JOIN exercises e ON e.id = we.exerciseId
           WHERE we.routineId = ?;`,
          [premade.id]
        );
        premadeWithExercises.push({ ...premade, exercises: exRows });
      }
      
      setPremadeWorkouts(premadeWithExercises);
    } catch (error) {
      console.error('Error loading premade workouts:', error);
    }
  };

  const startWorkout = (workout) => {
    navigation.navigate('UseWorkout', {
      workoutId: workout.id,
      workoutName: workout.name,
      isPremade: true,
    });
  };

  const renderListItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => startWorkout(item)}
    >
      <Text style={styles.listHeader}>{item.name}</Text>
      {item.exercises.map((ex, index) => (
        <Text key={index} style={styles.listText}>
          {ex.name} — {ex.sets} sets × {ex.reps} reps @ {ex.weight} lb
        </Text>
      ))}
      <View style={{ marginTop: 10, alignItems: 'flex-end' }}>
        <Text style={[styles.text, { color: '#4CAF50', fontSize: 14 }]}>
          Tap to start →
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back-ios-new" style={styles.headerText} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Premade Workouts</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={[styles.main]}>
        <FlatList
          style={styles.list}
          data={premadeWorkouts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderListItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </View>
    </View>
  );
}