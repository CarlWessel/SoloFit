import { StatusBar } from 'expo-status-bar';
import { Text, View, Alert, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../styles';

export default function HomePage({ navigation }) {

  const showAlert = (text) => {
    Alert.alert("SoloFit", text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>❚█══𝑺𝒐𝒍𝒐★𝑭𝒊𝒕══█❚</Text>
        <Text style={styles.headerText}>ᕙ(  •̀ ᗜ •́  )ᕗ</Text>
      </View>

      <View style={styles.main}>
        {/* This Add Workout button should be for adding workout history
        and Add/Edit Routine Page should go into the Addworkout page and anywhere else that can add/edit a routine
        but I just keep it here for the moment */}
        <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('AddRoutine')}>
          <Text style={styles.text}>Add Workout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => {navigation.navigate('RoutineList'); showAlert("Should display profile, and Routine List will be a part of the profile. Since we're not doing profile page for the moment. I just put the Routine List Page here")}}>
          <MaterialIcons name="person-outline" size={28} color="black" />
          <Text>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={() => showAlert("Add workout")}>
          <MaterialIcons name="add-circle-outline" size={28} color="black" />
          <Text>Add</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('WorkoutHistory')}>
          <MaterialIcons name="fitness-center" size={28} color="black" />
          <Text>Workouts</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
