import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert,} from "react-native";
import { styles, colors, spacing } from '../styles';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

export default function AddWorkout({ navigation }) {
  const showAlert = (text) => {
    Alert.alert("SoloFit", text);
  };

  const [workout, setWorkout] = useState("");
  const exercisesList = [
    { label: "Pushups", value: "pushups" },
    { label: "Bench Press", value: "benchpress" },
    { label: "Tricep Dips", value: "tricepdips" },
    { label: "Chest Fly", value: "chestfly" },
  ];

  //for actually adding stuff
  const [exercises, setExercises] = useState([]);
  const [nextExerciseID, setNextExerciseID] = useState(1);

  function addExercise() {
    let newExercise = {
      id: nextExerciseID,
      exerciseName: exercisesList[0]?.value || "",
      sets: [{ id: 1, reps: "", weight: "" }],
    };
    setNextExerciseID(nextExerciseID + 1);

    setExercises((prev) => [...prev, newExercise]);
  }
  function addSetToExercise(exerciseId) {
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
  }
  function updateSetValue(exerciseId, setId, key, value) {
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
  }
  function removeExercise(id) {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  }

  function onTextChanged(id, key, value) {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, [key]: value } : ex))
    );
  }

  //Rendering stuff
  function RenderNewExerciseForm({
    exercise,
    onTextChanged,
    onDelete,
    onAddSet,
    onSetValueChange,

    exercisesList,
  }) {
    return (
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
              selectedValue={exercise.exerciseName}
              onValueChange={(value) =>
                onTextChanged(exercise.id, "exerciseName", value)
              }
              style={{ fontSize: 16, color: colors.accent, width: "100%" }}
              dropdownIconColor={colors.accent}
            >
              {exercisesList.map((exercise) => (
                <Picker.Item
                  key={exercise.value}
                  label={exercise.label}
                  value={exercise.value}
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
          <RenderSets exercise={exercise} onSetChange={updateSetValue} />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              padding: 10,
            }}
          >
            <TouchableOpacity
              style={[
                {
                  backgroundColor: colors.accent,
                  marginTop: 10,
                  padding: spacing.sm,
                  borderRadius: 10,
                  marginRight: 15,
                },
              ]}
              onPress={() => onDelete(exercise.id)}
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
  } //end render card
  function RenderSets({ exercise, onSetChange }) {
    return (
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
                onSetChange(exercise.id, set.id, "reps", value)
              }
            />
            <TextInput
              style={[styles.textInput, { flex: 1 }]}
              placeholder="Weight"
              placeholderTextColor={colors.accent}
              keyboardType="numeric"
              value={set.weight}
              onChangeText={(value) =>
                onSetChange(exercise.id, set.id, "weight", value)
              }
            />
          </View>
        ))}
      </>
    );
  } //end render sets

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
            Add Workout
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
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 4,
                marginHorizontal: 5,
                paddingHorizontal: 8,
                color: colors.accent,
                backgroundColor: colors.background,
              },
            ]}
            placeholder="Workout Name"
            placeholderTextColor={colors.accent}
          />
        </View>
        {/* END HEADER */}
        {exercises.map((exercise) => (
          <RenderNewExerciseForm
            key={exercise.id}
            exercise={exercise}
            exercisesList={exercisesList}
            onTextChanged={onTextChanged}
            onDelete={removeExercise}
          />
        ))}
      </ScrollView>
      {/*BUTTONS VIEW   */}
      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "auto",
          },
        ]}
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
        <Text style={styles.text}>Go Back</Text>
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
          onPress={() => showAlert("Successfully Saved Workout")} //Will make this actually do something later
        >
          <Text style={styles.text}>Save Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
