import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { styles, colors, spacing } from "../styles";
import RoutineService from "../services/RoutineService";
import WorkoutService from "../services/WorkoutService";

export default function UseWorkout({ navigation, route }) {
  const { workoutId, workoutName, isPremade = false } = route.params;
  const [exercises, setExercises] = useState([]);
  const [workoutDate, setWorkoutDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    loadWorkoutExercises();
  }, []);

  const loadWorkoutExercises = async () => {
    try {
      const routine = await RoutineService.getRoutineById(workoutId);

      if (routine && routine.exercises) {
        const formattedExercises = routine.exercises.map((ex, idx) => ({
          id: idx + 1,
          exerciseId: ex.id,
          exerciseName: ex.name,
          sets: ex.sets.map((s) => ({
            id: s.setNumber,
            reps: s.reps.toString(),
            weight: s.weight.toString(),
          })),
        }));

        setExercises(formattedExercises);
      }
    } catch (error) {
      console.error("Error loading workout exercises:", error);
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

  // Trish Note: Fixed bug where using a routine and changing the date does not save correctly
  const saveWorkout = async () => {
    if (!workoutDate) {
      Alert.alert("Error", "Please enter a workout date");
      return;
    }

    try {
      // Prepare exercises data
      const exercisesData = exercises.map((ex) => ({
        exerciseId: ex.id,
        sets: ex.sets
          .filter((s) => s.reps && s.weight)
          .map((s) => ({
            setNumber: s.id,
            reps: parseInt(s.reps),
            weight: parseFloat(s.weight),
          })),
      }));

      // Parse date in LOCAL timezone
      // Split the date string and create date with local timezone
      const [year, month, day] = workoutDate.split('-').map(Number);
      const workoutDateTime = new Date(year, month - 1, day); // month is 0-indexed
      
      // If the date is invalid, show error
      if (isNaN(workoutDateTime.getTime())) {
        Alert.alert("Error", "Please enter a valid date in YYYY-MM-DD format");
        return;
      }
      
      // PLACEHOLDER: Set start time to beginning of day, end time to end of day
      const startDateTime = new Date(workoutDateTime.setHours(0, 0, 0, 0)).toISOString();
      const endDateTime = new Date(workoutDateTime.setHours(23, 59, 59, 999)).toISOString();

      await WorkoutService.addWorkout({
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        exercises: exercisesData,
        notes: "TODO: Add UI for notes and workout name",
      });

      Alert.alert("Success", "Workout saved to history!", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ]);
    } catch (error) {
      console.error("Error saving workout:", error);
      Alert.alert("Error", "Failed to save workout");
    }
  };

  const RenderExercise = ({ exercise }) => (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 2,
        margin: 10,
        backgroundColor: colors.primary,
      }}
    >
      <Text style={[styles.headerText, { fontSize: 18, marginBottom: 10 }]}>
        {exercise.exerciseName}
      </Text>

      {exercise.sets.map((set) => {
        const [localReps, setLocalReps] = useState(set.reps);
        const [localWeight, setLocalWeight] = useState(set.weight);

        useEffect(() => {
          setLocalReps(set.reps);
          setLocalWeight(set.weight);
        }, [set.reps, set.weight]);

        return (
          <View
            key={set.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: 5,
            }}
          >
            <Text style={[styles.headerText, { flex: 0.3, fontSize: 18 }]}>
              Set {set.id}
            </Text>

            <TextInput
              style={[styles.textInput, { flex: 1, marginRight: 5 }]}
              placeholder="Reps"
              placeholderTextColor={colors.accent}
              keyboardType="numeric"
              value={localReps}
              onChangeText={setLocalReps}
              onEndEditing={(e) =>
                updateSetValue(exercise.id, set.id, "reps", e.nativeEvent.text)
              }
            />

            <TextInput
              style={[styles.textInput, { flex: 1 }]}
              placeholder="Weight"
              placeholderTextColor={colors.accent}
              keyboardType="numeric"
              value={localWeight}
              onChangeText={setLocalWeight}
              onEndEditing={(e) =>
                updateSetValue(
                  exercise.id,
                  set.id,
                  "weight",
                  e.nativeEvent.text
                )
              }
            />
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={[styles.container]}>
      <ScrollView style={styles.container}>
        <View
          style={[
            styles.header,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={[styles.headerText, { fontSize: 24, marginBottom: 10 }]}>
            {workoutName}
          </Text>
          <Text style={[styles.text, { fontSize: 14, opacity: 0.8 }]}>
            {isPremade ? "Premade Workout" : "My Routine"}
          </Text>
        </View>

        <View
          style={{
            alignItems: "center",
            padding: 10,
            backgroundColor: colors.primary,
          }}
        >
          <Text style={[styles.text, { marginBottom: 5 }]}>Workout Date:</Text>
          <TextInput
            style={[
              {
                height: 40,
                width: "90%",
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 4,
                paddingHorizontal: 8,
                color: colors.accent,
                backgroundColor: colors.background,
                textAlign: "center",
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
          flexDirection: "row",
          justifyContent: "space-between",
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
