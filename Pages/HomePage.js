import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {

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
        <TouchableOpacity style={styles.startButton} onPress={() => showAlert("Adding workout")}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#023047',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#219ebc',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffb703'
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#ffb703',
    padding: 15,
    borderRadius: 10,
  },
  startText: {
    color: '#fff',
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#219ebc'
    
  },
  footerButton: {
    alignItems: 'center'
  },
});