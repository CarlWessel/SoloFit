import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { styles } from '../styles';
import { MaterialIcons } from '@expo/vector-icons';
import WorkoutService from '../services/WorkoutService';

export default function WorkoutHistory({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [expandedIds, setExpandedIds] = useState({}); // <- track expanded items
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

  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderListItem = ({ item }) => {
    const isExpanded = !!expandedIds[item.id];

    const start = new Date(item.startDateTime);
    const end = new Date(item.endDateTime);

    return (
      <View style={styles.listItem}>
        {/* Header row: tap to expand/collapse */}
        <TouchableOpacity onPress={() => toggleExpand(item.id)}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              {/* Workout name */}
              <Text style={styles.listHeader}>
                {item.name}
              </Text>

              {/* Date */}
              <Text style={styles.listSubheader}>
                {start.toLocaleDateString()}
              </Text>

              {/* Time range */}
              <Text style={styles.listSubheader}>
                {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{" - "}
                {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>

            {/* Dropdown chevron */}
            <MaterialIcons
              name={isExpanded ? 'expand-less' : 'expand-more'}
              size={24}
              style={{ marginLeft: 8 }}
            />
          </View>
        </TouchableOpacity>

        {/* Expanded content: exercises, sets, notes, buttons */}
        {isExpanded && (
          <View style={{ marginTop: 8 }}>
            {/* Exercises and sets */}
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

            {/* Notes */}
            {item.notes ? (
              <Text style={styles.listTextHighlight}>Notes: {item.notes}</Text>
            ) : null}

            {/* Edit/Delete buttons (only within 14 days) */}
            {(today - new Date(item.endDateTime) <= 14 * 24 * 60 * 60 * 1000) && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.yellowButton}
                  onPress={() => editWorkout(item.id)}
                >
                  <Text style={styles.listText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.redButton}
                  onPress={() => deleteWorkout(item.id)}
                >
                  <Text style={styles.listText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

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
