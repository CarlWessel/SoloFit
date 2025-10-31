import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { styles } from '../styles';
import { MaterialIcons } from '@expo/vector-icons';
import WorkoutService from '../utils/WorkoutService';

export default function WorkoutHistory({ navigation }) {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    loadWorkoutHistory();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadWorkoutHistory();
    });
    return unsubscribe;
  }, [navigation]);

  const loadWorkoutHistory = async () => {
    try {
      const workoutsData = await WorkoutService.getWorkoutHistory();
      
      const formattedWorkouts = workoutsData.map(workout => ({
        ...workout,
        formattedDate: new Date(workout.date).toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      }));
      
      setWorkouts(formattedWorkouts);
    } catch (error) {
      console.error('Error loading workout history:', error);
    }
  };

  const deleteWorkout = async (id) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await WorkoutService.deleteWorkoutHistory(id);
              loadWorkoutHistory();
            } catch (error) {
              console.error('Error deleting workout:', error);
              Alert.alert('Error', 'Failed to delete workout');
            }
          },
        },
      ]
    );
  };

  const renderListItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.listHeader}>{item.name}</Text>
          <Text style={[styles.listText, { fontSize: 12, opacity: 0.8, marginBottom: 8 }]}>
            {item.formattedDate}
          </Text>
        </View>
      </View>
      
      {item.exercises.map((ex, index) => (
        <Text key={index} style={styles.listText}>
          {ex.name} — {ex.sets} sets × {ex.reps} reps @ {ex.weight} lb
        </Text>
      ))}
      
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteWorkout(item.id)}
        >
          <Text style={styles.listText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
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
        <Text style={styles.headerText}>Workout History</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={[styles.main]}>
        {workouts.length === 0 ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={[styles.text, { opacity: 0.6, textAlign: 'center' }]}>
              No workout history yet.{'\n'}
              Start a workout to see it here!
            </Text>
          </View>
        ) : (
          <FlatList
            style={styles.list}
            data={workouts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderListItem}
            contentContainerStyle={{ paddingBottom: 30 }}
          />
        )}
      </View>
    </View>
  );
}