import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { styles } from '../styles';
import { MaterialIcons } from '@expo/vector-icons';
import { openDatabaseAsync } from 'expo-sqlite';

export default function WorkoutList({ navigation }) {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    (async () => {
      await loadWorkouts();
    })();
  }, []);

  const loadWorkouts = async () => {

    // I did this because I'm lazy and I don't want to type the mock data
    // This part should be replaced with function from separate database hadling js file
    const db = await openDatabaseAsync('workout.db');
    const workoutRows = await db.getAllAsync('SELECT * FROM workouts;');
    const workoutsWithExercises = [];
    for (const w of workoutRows) {
      const exRows = await db.getAllAsync(
        `SELECT e.name, we.sets, we.reps, we.weight
         FROM workout_exercises we
         JOIN exercises e ON e.id = we.exerciseId
         WHERE we.workoutId = ?;`,
        [w.id]
      );
      workoutsWithExercises.push({ ...w, exercises: exRows });
    }

    setWorkouts(workoutsWithExercises);
  };

  const editWorkout = (id) => {
    console.log(`Edit workout with id: ${id}`);
    // navigation.navigate('EditWorkout', { workoutId: id });
    // the page should be almost the same as add workout, consider combine those two into EditWorkout 
    // and add a boolean to determine if it's add or edit
  };

  const deleteWorkout = (id) => {
    setWorkouts(workouts.filter((w) => w.id !== id));
    // TODO: remove from db
  };

  const renderListItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listHeader}>{item.name}</Text>

      {item.exercises.map((ex, index) => (
        <Text key={index} style={styles.listText}>
          {/* this format could be improved, the text is a little bit small for the moment */}
          {ex.name} — {ex.sets} sets × {ex.reps} reps @ {ex.weight} lb
        </Text>
      ))}

      <View  style={styles.buttonRow}>
        <TouchableOpacity style={styles.editButton} onPress={() => editWorkout(item.id)}>
          <Text style={styles.listText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteWorkout(item.id)}>
          <Text style={styles.listText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios-new" style={styles.headerText}/>
        </TouchableOpacity>
        <Text style={styles.headerText}>Workout List</Text>
        <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('AddWorkout')}>
          <MaterialIcons name="add" style={[styles.headerText, {fontSize: 36}]}/>
        </TouchableOpacity>
      </View>

      <View style={[styles.main]}>
        <FlatList
          style={styles.list}
          nestedScrollEnabled
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={renderListItem}
          contentContainerStyle={{ paddingBottom: 30}}
        />
      </View>
    </View>
  );
}