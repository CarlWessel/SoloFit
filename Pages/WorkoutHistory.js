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
    const history = await WorkoutService.getWorkoutHistory();
    setWorkouts(history);
  };

  const editWorkout = (id) => {
    // navigation.navigate('EditWorkout', { workoutId: id, isEdit: true });
    showAlert("EditWorkout Page");
  };

  const deleteWorkout = async (id) => {
    await WorkoutService.deleteWorkout(id);
    await loadWorkouts();
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

      {item.exercises.map((ex, index) => (
        <Text key={index} style={styles.listText}>
          {ex.name} — {ex.sets} sets × {ex.reps} reps @ {ex.weight} lb
        </Text>
      ))}

      {item.notes ? <Text style={styles.listTextHight}>Notes: {item.notes}</Text> : null}

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
          <MaterialIcons name="arrow-back-ios-new" style={styles.headerText}/>
        </TouchableOpacity>
        <Text style={styles.headerText}>Workout History</Text>
      </View>

      <View style={styles.main}>
        <FlatList
          style={styles.list}
          nestedScrollEnabled
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={renderListItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </View>
    </View>
  );
}