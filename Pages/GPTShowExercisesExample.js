import { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { openDatabaseAsync } from "expo-sqlite";
import { styles } from "../styles";

export default function Example({ navigation }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newExercise, setNewExercise] = useState("");

  // Load exercises from DB
  const fetchExercises = async () => {
    try {
      const db = await openDatabaseAsync("workout.db");
      const rows = await db.getAllAsync("SELECT * FROM exercises;");
      setExercises(rows);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  // Save new exercise
  const addExercise = async () => {
    if (!newExercise.trim()) return;

    try {
      const db = await openDatabaseAsync("workout.db");
      await db.runAsync("INSERT INTO exercises (name) VALUES (?);", [newExercise.trim()]);
      setNewExercise("");
      setModalVisible(false);
      fetchExercises(); // refresh list
    } catch (error) {
      console.error("Error adding exercise:", error);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <View style={[styles.container, { padding: 16 }]}>

      {/* Top bar with Add Button */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={[styles.text, { fontSize: 24 }]}>🏋️ All Exercises</Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#4CAF50",
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 8,
          }}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: "white", fontSize: 16 }}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Exercise list */}
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#333",
                padding: 12,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <Text style={{ color: "white", fontSize: 18 }}>{item.name}</Text>
            </View>
          )}
        />
      )}

      {/* Go Back Button */}
      <TouchableOpacity
        style={[styles.startButton, { marginTop: 10 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.startText}>Go Back</Text>
      </TouchableOpacity>

      {/* Add Exercise Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
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
              backgroundColor: "#222",
              padding: 20,
              borderRadius: 12,
              width: "80%",
            }}
          >
            <Text style={{ color: "white", fontSize: 18, marginBottom: 10 }}>
              Add New Exercise
            </Text>
            <TextInput
              style={{
                backgroundColor: "#444",
                color: "white",
                padding: 10,
                borderRadius: 8,
                marginBottom: 15,
              }}
              placeholder="e.g. Bicep Curls"
              placeholderTextColor="#aaa"
              value={newExercise}
              onChangeText={setNewExercise}
            />

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#4CAF50",
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                }}
                onPress={addExercise}
              >
                <Text style={{ color: "white" }}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: "#888",
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "white" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
