import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { styles, colors, spacing } from '../styles';
import { Picker } from '@react-native-picker/picker';
import RoutineService from '../services/RoutineService';
import ExerciseService from '../services/ExerciseService';

export default function AddRoutine({ navigation }) {
  const [routineName, setRoutineName] = useState("");
  const [exercises, setExercises] = useState([]);
  const [nextExerciseID, setNextExerciseID] = useState(1);
  const [exercisesList, setExercisesList] = useState([]);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const rows = await ExerciseService.getAllExercises();
      setExercisesList(rows.map(ex => ({ label: ex.name, value: ex.id })));
    } catch (error) {
      console.error('Error loading exercises:', error);
    }
  };

  const addExercise = () => {
    if (exercisesList.length === 0) {
      Alert.alert('Error', 'No exercises available');
      return;
    }

    const newExercise = {
      id: nextExerciseID,
      exerciseId: exercisesList[0]?.value || 1,
      exerciseName: exercisesList[0]?.label || '',
      sets: [{ id: 1, reps: '', weight: '' }],
    };
    setNextExerciseID(nextExerciseID + 1);
    setExercises((prev) => [...prev, newExercise]);
  };

  const addSetToExercise = (exerciseId) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                { id: ex.sets.length + 1, reps: '', weight: '' },
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
    const selectedExercise = exercisesList.find(ex => ex.value === exerciseId);
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, exerciseId, exerciseName: selectedExercise?.label || '' } : ex))
    );
  };

  const saveRoutine = async () => {
    if (!routineName.trim()) {
      Alert.alert('Error', 'Please enter a routine name');
      return;
    }

    if (exercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return;
    }

    // Validate that all exercises have at least one complete set
    const hasIncompleteSets = exercises.some(ex => 
      ex.sets.every(set => !set.reps || !set.weight)
    );

    if (hasIncompleteSets) {
      Alert.alert('Error', 'Each exercise must have at least one complete set with reps and weight');
      return;
    }

    try {
      // Prepare exercises data in the new structure
      const exercisesData = exercises.map(ex => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets
          .filter(set => set.reps && set.weight)
          .map((set, idx) => ({
            setNumber: idx + 1,
            reps: parseInt(set.reps),
            weight: parseFloat(set.weight),
          })),
      }));

      await RoutineService.addRoutine({
        name: routineName.trim(),
        isPremade: 0,
        exercises: exercisesData
      });

      Alert.alert('Success', 'Routine saved successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error saving routine:', error);
      Alert.alert('Error', 'Failed to save routine');
    }
  };

  const RenderNewExerciseForm = ({ exercise }) => (
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
              <Picker.Item
                key={ex.value}
                label={ex.label}
                value={ex.value}
              />
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
      {exercise.sets.map((set) => (
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
            style={[styles.textInput, { flex: 1, marginRight: 5 }]}
            placeholder="Reps"
            placeholderTextColor={colors.accent}
            keyboardType="numeric"
            value={set.reps}
            onChangeText={(value) =>
              updateSetValue(exercise.id, set.id, "reps", value)
            }
          />
          <TextInput
            style={[styles.textInput, { flex: 1 }]}
            placeholder="Weight"
            placeholderTextColor={colors.accent}
            keyboardType="numeric"
            value={set.weight}
            onChangeText={(value) =>
              updateSetValue(exercise.id, set.id, "weight", value)
            }
          />
        </View>
      ))}
    </>
  );

  return (
    <View style={[styles.container]}>
      <ScrollView style={styles.container}>
        <View
          style={[
            styles.header,
            {
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text style={[styles.headerText, { fontSize: 24, marginBottom: 20 }]}>
            Add Routine
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
                width: '90%',
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 4,
                paddingHorizontal: 8,
                color: colors.accent,
                backgroundColor: colors.background,
              },
            ]}
            placeholder="Routine Name"
            placeholderTextColor={colors.accent}
            value={routineName}
            onChangeText={setRoutineName}
          />
        </View>
        {/* END HEADER */}
        {exercises.map((exercise) => (
          <RenderNewExerciseForm key={exercise.id} exercise={exercise} />
        ))}
      </ScrollView>
      {/*BUTTONS VIEW   */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "auto",
        }}
      >
        <TouchableOpacity
          style={[
            styles.startButton,
            {
              backgroundColor: colors.accent,
              width: "auto",
            },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.startButton, {}]}
          onPress={addExercise}
        >
          <Text style={styles.text}>Add Exercise</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.startButton,
            {
              backgroundColor: colors.accent,
              width: "auto",
            },
          ]}
          onPress={saveRoutine}
        >
          <Text style={styles.text}>Save Routine</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
