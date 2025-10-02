import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';

export default function App() {

  const showAlert = () => {
    Alert.alert("SoloFit", "Let's get started!");
  };

  return (
    <View style={styles.container}>
      <Text>SoloFit</Text>
      <Button title='SoloFit Start' onPress={showAlert} ></Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
