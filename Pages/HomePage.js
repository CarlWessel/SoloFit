import { StatusBar } from 'expo-status-bar';
import { Text, View, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';

export default function HomePage({ navigation }) {
  console.log('NAVIGATION:', navigation);

  const showAlert = (text) => {
    Alert.alert("SoloFit", text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>❚█══𝑺𝒐𝒍𝒐★𝑭𝒊𝒕══█❚</Text>
        <Text style={{fontSize: 28,fontWeight: 'bold',}}>ᕙ(  •̀ ᗜ •́  )ᕗ</Text>
      </View>

      <View style={styles.main}>
        <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('AddWorkout')}>
          <Text style={styles.startText}>Add Workout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => showAlert("Display profile")}>
          <Ionicons name="square-outline" size={28} color="black" />
          <Text>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={() => showAlert("Add workout")}>
          <Ionicons name="star-outline" size={28} color="black" />
          <Text>Add</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={() => showAlert("View existing workouts")}>
          <Ionicons name="square-outline" size={28} color="black" />
          <Text>Workouts</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
