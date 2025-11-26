import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Modal, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { styles } from "../styles";
import ExerciseService from "../services/ExerciseService"; 
import { MaterialIcons } from '@expo/vector-icons';
import UserService from "../services/UserService";
import ProfileModal from "../ReusableComponents/ProfileSetup";

export default function Profile({ navigation }) {

  const [username, setUsername] = useState("Loading...");
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseList, setExerciseList] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);


  // Load user profile
  const loadUserProfile = async () => {
    try {
      const profile = await UserService.getUserProfile();
      if (profile) {
        setUsername(profile.name || "Unknown");
        setAge(profile.age ?? "N/A");
        setGender(profile.gender || "N/A");
      } else {
        setUsername("No profile found");
        setAge("N/A");
        setGender("N/A");
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
      setUsername("Error loading profile");
      setAge("N/A");
      setGender("N/A");
    }
  };

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
    loadUserProfile();
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

      {/* Profile Info Section */}
      <View style={[styles.main, { alignItems: "flex-start", paddingLeft: 20 }]}>
        <Text style={styles.listHeader}>User Profile</Text>

        {/*Display Name, Age, Gender */}
        <View style={{ width: "100%", alignItems: "flex-start" }}>
          <Text style={styles.text}>Name: {username}</Text>
          <Text style={styles.text}>Age: {age}</Text>
          <Text style={styles.text}>Gender: {gender}</Text>
          <TouchableOpacity
            style={[styles.editButton, { marginTop: 15 }]}
            onPress={() => setEditProfileVisible(true)}
          >
            <Text style={styles.text}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.main}>
        {/* Exercise Controls*/}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, width: '80%', marginTop: 30 }}>
          <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.text}>Add Exercise</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.text}>Edit Exercise</Text>
          </TouchableOpacity>
        </View>


        <Text style={[styles.listHeader, { marginTop: 30 }]}>Personal Records!</Text>
        {/* Will make a personal records section when I create the table for it */}
      </View>

      {/* Modals */}
      
      <ProfileModal
        visible={editProfileVisible}
        onClose={async () => {
          setEditProfileVisible(false);
          await loadUserProfile(); // refresh displayed info after edit
        }}
      />

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
              <TouchableOpacity style={styles.editButton} onPress={saveExercise}>
                <Text style={styles.text}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.text}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
