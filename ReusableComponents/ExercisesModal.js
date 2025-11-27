import React from "react";
import { Modal, View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styles } from "../styles";
import ExerciseService from "../services/ExerciseService";

export default function ExerciseModal({
  visible,
  isEditing,
  exerciseName,
  setExerciseName,
  exerciseList,
  selectedExercise,
  setSelectedExercise,
  onClose,
  reloadExercises
}) {

  const saveExercise = async () => {
    if (!exerciseName.trim()) {
      Alert.alert("Error", "Exercise name cannot be empty.");
      return;
    }

    try {
      if (isEditing && selectedExercise) {
        await ExerciseService.editExercise(selectedExercise, exerciseName.trim());
        Alert.alert("Success", "Exercise updated!");
      } else {
        await ExerciseService.addExercise(exerciseName.trim());
        Alert.alert("Success", "Exercise added!");
      }

      await reloadExercises();
      onClose();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save exercise.");
    }
  };

  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          
          <Text style={styles.modalTitle}>
            {isEditing ? "Edit Exercise" : "Add Exercise"}
          </Text>

          {/* Picker only in editing mode */}
          {isEditing && (
            <Picker
              selectedValue={selectedExercise}
              onValueChange={setSelectedExercise}
              style={{ width: "100%", marginBottom: 10 }}
            >
              {exerciseList.map((ex) => (
                <Picker.Item key={ex.id} label={ex.name} value={ex.id} />
              ))}
            </Picker>
          )}

          <TextInput
            placeholder="Exercise name"
            placeholderTextColor="#999"
            style={styles.modalTextInput}
            value={exerciseName}
            onChangeText={setExerciseName}
          />

          <View style={styles.modalButtonRow}>
            <TouchableOpacity style={styles.yellowButton} onPress={saveExercise}>
              <Text style={styles.text}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.redButton} onPress={onClose}>
              <Text style={styles.text}>Cancel</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}
