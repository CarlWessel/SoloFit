import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Modal, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { styles } from "../styles";
import ExerciseService from "../services/ExerciseService"; 
import { MaterialIcons } from '@expo/vector-icons';

export default function Profile({ navigation }) {
  const [username, setUsername] = useState("TestUser");
  const [modalVisible, setModalVisible] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseList, setExerciseList] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Load exercises from DB to refresh data
  const loadExercises = async () => {
    try {
      const exercises = await ExerciseService.getAllExercises();
      setExerciseList(exercises);
      if (exercises.length > 0) setSelectedExercise(exercises[0].id);
    } catch (err) {
      console.error("Failed to load exercises:", err);
    }
  };

  useEffect(() => {
    loadExercises();
  }, []);

  const handleAddExercise = () => {
    setExerciseName("");
    setIsEditing(false);
    setModalVisible(true);
  };

  const handleEditExercise = () => {
    setExerciseName("");
    setIsEditing(true);
    setModalVisible(true);
  };

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

      // Refresh exercise list
      await loadExercises();
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save exercise.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios-new" style={styles.headerText} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      {/* Content */}
      <View style={styles.main}>
        <Text style={styles.listHeader}>Logged in as:</Text>
        <Text style={styles.text}>{username}</Text>

        
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, width: '80%', marginTop: 20 }}>
          <TouchableOpacity style={styles.yellowButton} onPress={handleAddExercise}>
            <Text style={styles.text}>Add Exercise</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.redButton} onPress={handleEditExercise}>
            <Text style={styles.text}>Edit Exercise</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.listHeader, { marginTop: 30 }]}>Personal Records!</Text>
        {/* Will make a personal records section when I create the table for it */}
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{isEditing ? "Edit Exercise" : "Add New Exercise"}</Text>

            {/* Picker only when editing */}
            {isEditing && (
              <Picker
                selectedValue={selectedExercise}
                onValueChange={(itemValue) => setSelectedExercise(itemValue)}
                style={{ width: '100%', marginBottom: 10 }}
              >
                {exerciseList.map((ex) => (
                  <Picker.Item key={ex.id} label={ex.name} value={ex.id} />
                ))}
              </Picker>
            )}

            {/* TextInput for new name */}
            <TextInput
              placeholder="Exercise name"
              placeholderTextColor="#999"
              style={styles.modalTextInput}
              value={exerciseName}
              onChangeText={setExerciseName}
            />

            {/* Save / Cancel buttons */}
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.yellowButton} onPress={saveExercise}>
                <Text style={styles.text}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.redButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.text}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
