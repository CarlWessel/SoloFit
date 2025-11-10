import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { styles, colors, spacing } from "../styles";
import { Picker } from "@react-native-picker/picker";
import RoutineService from "../services/RoutineService";
import ExerciseService from "../services/ExerciseService";
import WorkoutService from "../services/WorkoutService";

export default function StartWorkout({ navigation, route }) {
  const { isPaidUser = false } = route.params || {};
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState([]);
  const [nextExerciseID, setNextExerciseID] = useState(1);
  const [exercisesList, setExercisesList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [routines, setRoutines] = useState([]);
  const [premadeRoutines, setPremadeRoutines] = useState([]);

  useEffect(() => {
    loadExercises();
    loadRoutines();
    loadPremadeRoutines();
  }, []);

  const loadExercises = async () => {
    try {
      const rows = await ExerciseService.getAllExercises();
      setExercisesList(rows.map((ex) => ({ label: ex.name, value: ex.id })));
    } catch (error) {
      console.error("Error loading exercises:", error);
    }
  };

  const loadRoutines = async () => {
    try {
      const routinesData = await RoutineService.getUserRoutines();
      setRoutines(routinesData);
    } catch (error) {
      console.error("Error loading routines:", error);
    }
  };

  const loadPremadeRoutines = async () => {
    try {
      const premadeData = await RoutineService.getPremadeRoutines();
      setPremadeRoutines(premadeData);
    } catch (error) {
      console.error("Error loading premade routines:", error);
    }
  };

  const addExercise = () => {
    if (exercisesList.length === 0) {
      Alert.alert("Error", "No exercises available");
      return;
    }

    const newExercise = {
      id: nextExerciseID,
      exerciseId: exercisesList[0]?.value || 1,
      exerciseName: exercisesList[0]?.label || "",
      sets: [{ id: 1, reps: "", weight: "" }],
    };
    setNextExerciseID(nextExerciseID + 1);
    setExercises((prev) => [...prev, newExercise]);
  };

  const addExerciseFromSource = (sourceExercise) => {
    const newExercise = {
      id: nextExerciseID,
      exerciseId: sourceExercise.exerciseId,
      sets: sourceExercise.sets.map((s) => ({
        id: s.setNumber.toString(),
        reps: s.reps.toString(),
        weight: s.weight.toString(),
      })),
    };

    setNextExerciseID(nextExerciseID + 1);
    setExercises((prev) => [...prev, newExercise]);
    setShowAddModal(false);
  };

  const addSetToExercise = (exerciseId) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                { id: ex.sets.length + 1, reps: "", weight: "" },
              ],
            }
          : ex
      )
    );
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

  const removeExercise = (id) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const onExerciseChanged = (id, exerciseId) => {
    const selectedExercise = exercisesList.find(
      (ex) => ex.value === exerciseId
    );
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === id
          ? { ...ex, exerciseId, exerciseName: selectedExercise?.label || "" }
          : ex
      )
    );
  };

  const saveWorkout = async () => {
    if (!workoutName.trim()) {
      Alert.alert("Error", "Please enter a workout name");
      return;
    }

    if (exercises.length === 0) {
      Alert.alert("Error", "Please add at least one exercise");
      return;
    }

    try {
      // Prepare exercises data
      const exercisesData = exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets
          .filter((set) => set.reps && set.weight)
          .map((set, idx) => ({
            setNumber: idx + 1, // set number starts at 1
            reps: parseInt(set.reps),
            weight: parseFloat(set.weight),
          })),
      }));

      await WorkoutService.addWorkout({
        // question: do we want a name for workouthistory
        // name: workoutName.trim(),
        // date: new Date().toISOString(),

        // toISOString() will pass it to UTC time, but we're going to change this to manually input I just ignore this problem for the moment
        startDateTime: new Date().toISOString().slice(0, 16),
        endDateTime: new Date().toISOString().slice(0, 16),
        exercises: exercisesData,
        notes: "TODO: Add UI for notes and workout name",
      });

      Alert.alert("Success", "Workout saved!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error saving workout:", error);
      Alert.alert("Error", "Failed to save workout");
    }
  };

  const RenderExerciseForm = ({ exercise }) => (
    <View style={{ paddingTop: 10 }}>
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          padding: 6,
          margin: 10,
          backgroundColor: colors.primary,
        }}
      >
        <View
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 1,
            backgroundColor: colors.background,
            height: 40,
            justifyContent: "center",
          }}
        >
          <Picker
            selectedValue={exercise.exerciseId}
            onValueChange={(value) => onExerciseChanged(exercise.id, value)}
            style={{ fontSize: 16, color: colors.accent, width: "100%" }}
            dropdownIconColor={colors.accent}
          >
            {exercisesList.map((ex) => (
              <Picker.Item key={ex.value} label={ex.label} value={ex.value} />
            ))}
          </Picker>
        </View>
      </View>
      <View
        style={{
          alignItems: "center",
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          padding: 10,
          margin: 10,
          backgroundColor: colors.primary,
        }}
      >
        <RenderSets exercise={exercise} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            padding: 10,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: colors.accent,
              marginTop: 10,
              padding: spacing.sm,
              borderRadius: 10,
              marginRight: 15,
            }}
            onPress={() => removeExercise(exercise.id)}
          >
            <Text style={styles.text}>Remove Exercise</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: colors.accent,
              padding: spacing.sm,
              borderRadius: 10,
              marginTop: 10,
            }}
            onPress={() => addSetToExercise(exercise.id)}
          >
            <Text style={styles.text}>Add Set</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const RenderSets = ({ exercise }) => (
    <>
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
              width: "100%",
              marginVertical: 5,
            }}
          >
            <Text style={[styles.headerText]}>Set {set.id}</Text>

            <TextInput
              style={[
                styles.textInput,
                { flex: 1, marginRight: 5, paddingLeft: 7 },
              ]}
              placeholder="Reps"
              placeholderTextColor={colors.accent}
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
    </>
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
          <Text style={[styles.headerText, { fontSize: 24, marginBottom: 20 }]}>
            Start Workout
          </Text>
        </View>

        <View
          style={{
            alignItems: "center",
            padding: 10,
            backgroundColor: colors.primary,
          }}
        >
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
              },
            ]}
            placeholder="Workout Name"
            placeholderTextColor={colors.accent}
            value={workoutName}
            onChangeText={setWorkoutName}
          />
        </View>

        {exercises.map((exercise) => (
          <RenderExerciseForm key={exercise.id} exercise={exercise} />
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
            { backgroundColor: colors.accent, flex: 1, marginRight: 5 },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.startButton,
            { flex: 1, marginHorizontal: 5, backgroundColor: "#666" },
          ]}
          onPress={() => setShowAddModal(true)}
          disabled={false}
        >
          <Text style={styles.text}>Add Exercise from...</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.startButton, { flex: 1, marginLeft: 5 }]}
          onPress={addExercise}
        >
          <Text style={styles.text}>Add Exercise</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.startButton,
            { backgroundColor: colors.accent, flex: 1, marginLeft: 5 },
          ]}
          onPress={saveWorkout}
        >
          <Text style={styles.text}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for adding from routines/premades */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: colors.background,
              borderRadius: 10,
              width: "90%",
              maxHeight: "80%",
              padding: 20,
            }}
          >
            <Text
              style={[styles.headerText, { fontSize: 20, marginBottom: 15 }]}
            >
              Add Exercise From
            </Text>

            <ScrollView>
              <Text
                style={[
                  styles.text,
                  { fontSize: 18, fontWeight: "bold", marginTop: 10 },
                ]}
              >
                My Routines
              </Text>
              {routines.map((routine) => (
                <View key={routine.id} style={{ marginVertical: 10 }}>
                  <Text
                    style={[
                      styles.text,
                      { color: colors.accent, marginBottom: 5 },
                    ]}
                  >
                    {routine.name}
                  </Text>
                  {routine.exercises.map((ex) => (
                    <TouchableOpacity
                      key={ex.exerciseId}
                      style={{
                        backgroundColor: colors.primary,
                        padding: 10,
                        borderRadius: 5,
                        marginVertical: 2,
                      }}
                      onPress={() => addExerciseFromSource(ex)}
                    >
                      <Text style={styles.text}>
                        {ex.name} -{" "}
                        {ex.sets
                          .map((s) => `${s.reps} @${s.weight}lb`)
                          .join(", ")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}

              <Text
                style={[
                  styles.text,
                  { fontSize: 18, fontWeight: "bold", marginTop: 20 },
                ]}
              >
                Premade routines
              </Text>
              {premadeRoutines.map((premade) => (
                <View key={premade.id} style={{ marginVertical: 10 }}>
                  <Text
                    style={[
                      styles.text,
                      { color: colors.accent, marginBottom: 5 },
                    ]}
                  >
                    {premade.name}
                  </Text>
                  {premade.exercises.map((ex) => (
                    <TouchableOpacity
                      key={ex.exerciseId}
                      style={{
                        backgroundColor: colors.primary,
                        padding: 10,
                        borderRadius: 5,
                        marginVertical: 2,
                      }}
                      onPress={() => addExerciseFromSource(ex)}
                    >
                      <Text style={styles.text}>
                        {ex.name} -{" "}
                        {ex.sets
                          .map((s) => `${s.reps} @ ${s.weight}lb`)
                          .join(", ")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.startButton, { marginTop: 15 }]}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.text}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
