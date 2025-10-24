import { useState } from "react";
import {
  Text,
  Modal,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { styles }from "../styles";

export default function AddExercises({ navigation }){


  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={[styles.text, { fontSize: 24, marginBottom: 20 }]}>
        🏋️ Add Exercises Page Test
      </Text>

      <TouchableOpacity
        style={[styles.startButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.text}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
} //end add exercise