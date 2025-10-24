import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Alert, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles, colors } from '../styles';

export default function HomePage({ navigation }) {

  const [isPaidUser, setIsPaidUser] = useState(true); // Toggle for testing

  const showAlert = (text) => {
    Alert.alert("SoloFit", text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>❚█══𝑺𝒐𝒍𝒐★𝑭𝒊𝒕══█❚</Text>
        <Text style={styles.headerText}>ᕙ(  •̀ ᗜ •́  )ᕗ</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        
        <View style={{ gap: 12, marginBottom: 32 }}>
          {/* Start Empty Workout - Paid Only */}
          {/* Now leads to AddExercises.js test page */}
          <TouchableOpacity
            style={[
              styles.startButton,
              {
                backgroundColor: isPaidUser ? colors.accent : '#666',
                padding: 20,
                opacity: isPaidUser ? 1 : 0.5,
              },
            ]}
            onPress={() => {
              if (isPaidUser) {
                navigation.navigate('AddExercises', {
                  isPaidUser: true,
                  routineMode: false,
                  workoutType: 'empty',
                });
              }
            }}
            disabled={!isPaidUser}
          >
            <Text style={[styles.startText, { fontSize: 18, fontWeight: 'bold' }]}>
              🏋️ Start Empty Workout
            </Text>
            <Text style={[styles.text, { fontSize: 12, marginTop: 4 }]}>
              {isPaidUser ? 'Add exercises as you go' : '⚠️ Paid users only'}
            </Text>
          </TouchableOpacity>

          {/* New Routine - All Users */}
          <TouchableOpacity
            style={[
              styles.startButton,
              { backgroundColor: colors.primary, padding: 20 },
            ]}
            onPress={() =>
              navigation.navigate('AddRoutine', {
                isPaidUser,
                routineMode: true,
                workoutType: 'routine',
              })
            }
          >
            <Text style={[styles.startText, { fontSize: 18, fontWeight: 'bold' }]}>
              📝 New Routine
            </Text>
            <Text style={[styles.text, { fontSize: 12, marginTop: 4 }]}>
              Build a reusable workout plan
            </Text>
          </TouchableOpacity>

          {/* Premade Workouts - All Users */}
          <TouchableOpacity
            style={[
              styles.startButton,
              { backgroundColor: '#8338ec', padding: 20 },
            ]}
            onPress={() => {
              // TODO: Navigate to premade workouts selection
              Alert.alert('Coming Soon', 'Premade Workouts feature is under development!');
            }}
          >
            <Text style={[styles.startText, { fontSize: 18, fontWeight: 'bold' }]}>
              ⭐ Premade Workouts
            </Text>
            <Text style={[styles.text, { fontSize: 12, marginTop: 4 }]}>
              Choose from our templates
            </Text>
          </TouchableOpacity>
        </View>

        {/* My Routines Section */}
        <View style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={[styles.text, { fontSize: 20, fontWeight: 'bold' }]}>
              📚 My Routines
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('RoutineList')}>
              <Text style={[styles.text, { color: colors.accent, fontSize: 14 }]}>
                View All →
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Placeholder for user routines... Or something else */}
          <View
            style={{
              backgroundColor: '#1a3a52',
              padding: 20,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Text style={[styles.text, { opacity: 0.6, textAlign: 'center' }]}>
              No saved routines yet.{'\n'}
              Create one using "New Routine" above!
            </Text>
          </View>
        </View>

        {/* Developer Testing Section - For things we make that aren't fully there yet */}
        <View style={{ backgroundColor: '#2d1b3d', padding: 16, borderRadius: 10, borderWidth: 2, borderColor: '#8338ec', marginBottom: 20, }}>
          <Text style={[styles.text, { fontSize: 16, marginBottom: 12, fontWeight: 'bold' }]}>
            🔧 Developer Testing
          </Text>
          
          <TouchableOpacity style={[ styles.startButton, { backgroundColor: '#4CAF50', marginBottom: 10 },]} onPress={() => navigation.navigate('GPTShowExercisesExample')}>
            <Text style={styles.startText}>View All Exercises (Example)</Text>
          </TouchableOpacity>

          {/* 🧪 Testing Mode toggle moved here */}
          <View style={{ backgroundColor: '#1a3a52', padding: 16, borderRadius: 10, marginBottom: 8, alignItems: 'center',}}>
            <Text style={[styles.text, { fontSize: 16, marginBottom: 12 }]}>🧪 Testing Mode</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={[styles.text, { opacity: isPaidUser ? 0.5 : 1 }]}>Free User</Text>
              <Switch
                value={isPaidUser}
                onValueChange={setIsPaidUser}
                trackColor={{ false: '#767577', true: colors.accent }}
                thumbColor={isPaidUser ? colors.primary : '#f4f3f4'}
              />
              <Text style={[styles.text, { opacity: isPaidUser ? 1 : 0.5 }]}>Paid User</Text>
            </View>
            <Text
              style={[
                styles.text,
                { fontSize: 14, marginTop: 8, color: colors.accent },
              ]}
            >
              Currently: {isPaidUser ? '💎 Paid (Full Access)' : '🆓 Free (Limited)'}
            </Text>
          </View>

        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => showAlert("Display profile")}>
          <MaterialIcons name="person-outline" size={28} color="black" />
          <Text>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={() => {}}>
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
