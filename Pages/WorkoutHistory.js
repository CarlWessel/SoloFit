import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { styles } from '../styles';
import { MaterialIcons } from '@expo/vector-icons';
import WorkoutService from '../services/WorkoutService';

export default function WorkoutHistory({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const today = new Date();

  useEffect(() => {
    (async () => {
      await loadWorkouts();
    })();
  }, []);

  const showAlert = (text) => {
    Alert.alert("SoloFit - WorkoutHistory", text);
  };

  const loadWorkouts = async () => {
    try {
      const history = await WorkoutService.getWorkoutHistory();
      setWorkouts(history);
    } catch (err) {
      console.error("Error loading workouts:", err);
      showAlert("Failed to load workouts.");
    }
  };

  const editWorkout = (id) => {
    // navigation.navigate('EditWorkout', { workoutId: id, isEdit: true });
    showAlert("EditWorkout Page");
  };

  const deleteWorkout = async (id) => {
    try {
      await WorkoutService.deleteWorkout(id);
      await loadWorkouts();
    } catch (err) {
      console.error("Error deleting workout:", err);
      showAlert("Failed to delete workout.");
    }
  };

  const renderListItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listHeader}>
        {new Date(item.startDateTime).toLocaleDateString()}
      </Text>

      <Text style={styles.listSubheader}>
        {new Date(item.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{" - "}
        {new Date(item.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>

      {/* Display exercises and their sets */}
      {/* Consider fold the details in some ways */}
      {item.exercises.map((ex) => (
        <View key={ex.exerciseId} style={{ marginVertical: 4 }}>
          <Text style={styles.listText}>{ex.name}</Text>
          {ex.sets.map((set) => (
            <Text
              key={set.setNumber}
              style={{ ...styles.listText, marginLeft: 32 }}
            >
              Set {set.setNumber} - {set.reps} reps @ {set.weight} lb
            </Text>
          ))}
        </View>
      ))}      

      {item.notes ? <Text style={styles.listTextHighLight}>Notes: {item.notes}</Text> : null}

      {(today - new Date(item.endDateTime) <= 14 * 24 * 60 * 60 * 1000) && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.editButton} onPress={() => editWorkout(item.id)}>
            <Text style={styles.listText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteWorkout(item.id)}>
            <Text style={styles.listText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios-new" style={styles.headerText} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Workout History</Text>
      </View>

      <View style={styles.main}>
        <FlatList
          style={styles.list}
          nestedScrollEnabled
          data={workouts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderListItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </View>
    </View>
  );
}