import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Alert, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles, colors } from '../styles';
import WorkoutService from '../utils/WorkoutService';

export default function HomePage({ navigation }) {
  const [isPaidUser, setIsPaidUser] = useState(true);
  const [userRoutines, setUserRoutines] = useState([]);

  useEffect(() => {
    loadUserRoutines();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserRoutines();
    });
    return unsubscribe;
  }, [navigation]);

  const loadUserRoutines = async () => {
    try {
      const routinesData = await WorkoutService.getUserRoutines();
      // Limit to 3 most recent
      setUserRoutines(routinesData.slice(0, 3));
    } catch (error) {
      console.error('Error loading user routines:', error);
    }
  };

  const startRoutine = (routine) => {
    navigation.navigate('UseWorkout', {
      workoutId: routine.id,
      workoutName: routine.name,
      isPremade: false,
    });
  };

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
                navigation.navigate('StartWorkout', {
                  isPaidUser: true,
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
            onPress={() => navigation.navigate('PremadeWorkouts')}
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
          
          {userRoutines.length === 0 ? (
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
          ) : (
            userRoutines.map((routine) => (
              <TouchableOpacity
                key={routine.id}
                style={{
                  backgroundColor: '#1a3a52',
                  padding: 15,
                  borderRadius: 10,
                  marginBottom: 10,
                }}
                onPress={() => startRoutine(routine)}
              >
                <Text style={[styles.text, { fontSize: 16, fontWeight: 'bold', marginBottom: 5 }]}>
                  {routine.name}
                </Text>
                <Text style={[styles.text, { fontSize: 12, opacity: 0.7 }]}>
                  {routine.exercises.length} exercises
                </Text>
                <Text style={[styles.text, { color: '#4CAF50', fontSize: 12, marginTop: 5 }]}>
                  Tap to start →
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Developer Testing Section */}
        <View style={{ backgroundColor: '#2d1b3d', padding: 16, borderRadius: 10, borderWidth: 2, borderColor: '#8338ec', marginBottom: 20 }}>
          <Text style={[styles.text, { fontSize: 16, marginBottom: 12, fontWeight: 'bold' }]}>
            🔧 Developer Testing
          </Text>
          
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: '#4CAF50', marginBottom: 10 }]}
            onPress={() => navigation.navigate('GPTShowExercisesExample')}
          >
            <Text style={styles.startText}>View All Exercises (Example)</Text>
          </TouchableOpacity>

          {/* Testing Mode toggle */}
          <View style={{ backgroundColor: '#1a3a52', padding: 16, borderRadius: 10, marginBottom: 8, alignItems: 'center' }}>
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
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('WorkoutHistory')}>
          <MaterialIcons name="fitness-center" size={28} color="black" />
          <Text>Workout History</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
