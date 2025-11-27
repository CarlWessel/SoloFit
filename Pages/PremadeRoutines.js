import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { styles } from '../styles';
import { MaterialIcons } from '@expo/vector-icons';
import RoutineService from '../services/RoutineService';

export default function PremadeRoutines({ navigation }) {
  const [premadeRoutines, setPremadeRoutines] = useState([]);

  useEffect(() => {
    loadPremadeRoutines();
  }, []);

  const loadPremadeRoutines = async () => {
    try {
      const premadeData = await RoutineService.getPremadeRoutines();
      setPremadeRoutines(premadeData);
    } catch (error) {
      console.error('Error loading premade routines:', error);
    }
  };

  const startWorkout = (workout) => {
    navigation.navigate('UseWorkout', {
      workoutId: workout.id,
      workoutName: workout.name,
      isPremade: true,
    });
  };

  const renderListItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => startWorkout(item)}
    >
      <Text style={styles.listHeader}>{item.name}</Text>

      {/* Display exercises and their sets */}
      {/* Consider fold the details in some ways */}
      {item.exercises.map((ex) => (
        <View key={ex.exerciseId} style={{ marginVertical: 4 }}>
          <Text style={styles.listText}>{ex.name}</Text>
          {ex.sets.map((set) => (
            <Text
              key={set.setNumber}
              style={{ ...styles.listText, marginLeft: 32 }}
            >
              Set {set.setNumber} - {set.reps} reps @ {set.weight} lb
            </Text>
          ))}
        </View>
      ))}

      <View style={{ marginTop: 10, alignItems: 'flex-end' }}>
        <Text style={[styles.text, { color: '#8D80AD', fontSize: 14 }]}>
          Tap to start →
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back-ios-new" style={styles.headerText} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Premade Routines</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.main}>
        <FlatList
          style={styles.list}
          data={premadeRoutines}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderListItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </View>
    </View>
  );
}