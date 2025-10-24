import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { styles } from '../styles';
import { MaterialIcons } from '@expo/vector-icons';
import { openDatabaseAsync } from 'expo-sqlite';

export default function RoutineList({ navigation }) {
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    (async () => {
      await loadRoutines();
    })();
  }, []);

  const loadRoutines = async () => {

    // I did this because I'm lazy and I don't want to type the mock data
    // This part should be replaced with function from separate database hadling js file
    const db = await openDatabaseAsync('workout.db');
    const routineRows = await db.getAllAsync('SELECT * FROM routines;');
    const routinesWithExercises = [];
    for (const w of routineRows) {
      const exRows = await db.getAllAsync(
        `SELECT e.name, we.sets, we.reps, we.weight
         FROM routine_exercises we
         JOIN exercises e ON e.id = we.exerciseId
         WHERE we.routineId = ?;`,
        [w.id]
      );
      routinesWithExercises.push({ ...w, exercises: exRows });
    }

    setRoutines(routinesWithExercises);
  };

  const editRoutine = (id) => {
    console.log(`Edit routine with id: ${id}`);
    navigation.navigate('AddRoutine');
    // navigation.navigate('EditRoutine', { routineId: id });
    // the page should be almost the same as add routine, consider combine those two into EditRoutine 
    // and add a boolean to determine if it's add or edit
  };

  const deleteRoutine = (id) => {
    setRoutines(routines.filter((w) => w.id !== id));
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
        <TouchableOpacity style={styles.editButton} onPress={() => editRoutine(item.id)}>
          <Text style={styles.listText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRoutine(item.id)}>
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
        <Text style={styles.headerText}>Routine List</Text>
        <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('AddRoutine')}>
          <MaterialIcons name="add" style={[styles.headerText, {fontSize: 36}]}/>
        </TouchableOpacity>
      </View>

      <View style={[styles.main]}>
        <FlatList
          style={styles.list}
          nestedScrollEnabled
          data={routines}
          keyExtractor={(item) => item.id}
          renderItem={renderListItem}
          contentContainerStyle={{ paddingBottom: 30}}
        />
      </View>
    </View>
  );
}