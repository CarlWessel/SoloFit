import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { styles } from '../styles';
import { MaterialIcons } from '@expo/vector-icons';
import RoutineService from '../services/RoutineService';

export default function RoutineList({ navigation }) {
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    loadRoutines();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadRoutines();
    });
    return unsubscribe;
  }, [navigation]);

  const loadRoutines = async () => {
    try {
      const routinesData = await RoutineService.getUserRoutines();
      setRoutines(routinesData);
    } catch (error) {
      console.error('Error loading routines:', error);
    }
  };

  const editRoutine = (id) => {
    console.log(`Edit routine with id: ${id}`);
    navigation.navigate('AddRoutine');
    // navigation.navigate('EditRoutine', { routineId: id });
    // the page should be almost the same as add routine, consider combine those two into EditRoutine 
    // and add a boolean to determine if it's add or edit
  };

  const deleteRoutine = async (id) => {
    Alert.alert(
      'Delete Routine',
      'Are you sure you want to delete this routine?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await RoutineService.deleteRoutine(id);
              loadRoutines();
            } catch (error) {
              console.error('Error deleting routine:', error);
              Alert.alert('Error', 'Failed to delete routine');
            }
          },
        },
      ]
    );
  };

  const renderListItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listHeader}>{item.name}</Text>

      {item.exercises.map((ex) => (
        <View key={ex.exerciseId} style={{ marginVertical: 4 }}>
          <Text style={styles.listText}>{ex.name}</Text>
          {ex.sets.map((set) => (
            <Text key={set.setNumber} style={{ ...styles.listText, marginLeft: 12 }}>
              Set {set.setNumber}: {set.reps} reps @ {set.weight} lb
            </Text>
          ))}
        </View>
      ))}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.yellowButton} onPress={() => editRoutine(item.id)}>
          <Text style={styles.listText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.redButton} onPress={() => deleteRoutine(item.id)}>
          <Text style={styles.listText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios-new" style={styles.headerText} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Routine List</Text>
        <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('AddRoutine')}>
          <MaterialIcons name="add" style={[styles.headerText, { fontSize: 36 }]} />
        </TouchableOpacity>
      </View>

      <View style={[styles.main]}>
        {routines.length === 0 ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={[styles.text, { opacity: 0.6, textAlign: 'center' }]}>
              No routines yet.{'\n'}
              Create one using the + button above!
            </Text>
          </View>
        ) : (
          <FlatList
            style={styles.list}
            nestedScrollEnabled
            data={routines}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderListItem}
            contentContainerStyle={{ paddingBottom: 30 }}
          />
        )}
      </View>
    </View>
  );
}