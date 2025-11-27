import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Modal, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { styles } from "../styles";
import ExerciseService from "../services/ExerciseService"; 
import { MaterialIcons } from '@expo/vector-icons';
import UserService from "../services/UserService";
import ProfileModal from "../ReusableComponents/ProfileSetup";
import ExerciseModal from "../ReusableComponents/ExercisesModal";

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
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, width: '80%', marginTop: 20 }}>
          <TouchableOpacity style={styles.editButton} onPress={handleAddExercise}>
            <Text style={styles.text}>Add Exercise</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleEditExercise}>
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

      <ExerciseModal
        visible={modalVisible}
        isEditing={isEditing}
        exerciseName={exerciseName}
        setExerciseName={setExerciseName}
        exerciseList={exerciseList}
        selectedExercise={selectedExercise}
        setSelectedExercise={setSelectedExercise}
        onClose={() => setModalVisible(false)}
        reloadExercises={loadExercises}
      />
    </View>
  );
}
