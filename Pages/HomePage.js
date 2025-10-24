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
        <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('AddWorkout')}>
          <Text style={styles.text}>Add Workout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => showAlert("Display profile")}>
          <MaterialIcons name="person-outline" size={28} color="black" />
          <Text>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={() => showAlert("Add workout")}>
          <MaterialIcons name="add-circle-outline" size={28} color="black" />
          <Text>Add</Text>
        </TouchableOpacity>

        {/* I suggest moving this list to the Profile page and placing the History on the Home page. The workout list is more like a settings feature and doesn’t change frequently, whereas the history is likely to be accessed more often. */}
        {/* <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('WorkoutHistory')}> */}
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('RoutineList')}>
          <MaterialIcons name="fitness-center" size={28} color="black" />
          <Text>Workouts</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
