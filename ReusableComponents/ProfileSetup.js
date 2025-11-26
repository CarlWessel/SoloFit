import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import UserService from '../services/UserService';

export default function ProfileModal({ visible, onClose }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);

  // Load profile when modal becomes visible
  useEffect(() => {
    if (visible) loadProfile();
  }, [visible]);

    const loadProfile = async () => {
    const profile = await UserService.getUserProfile();
    if (!profile) {
        setIsFirstTime(true);
    } else {
        setIsFirstTime(false);
        setName(profile.name || '');
        setAge(String(profile.age || ''));
        setGender(profile.gender || '');
    }
    };

  const handleSave = async () => {
    const profile = await UserService.getUserProfile();

    if (profile) {
      await UserService.updateUserProfile({
        name,
        age: parseInt(age),
        gender,
      });
    } else {
      await UserService.createUserProfile(name, parseInt(age), gender);
    }

    onClose(); // close modal after save
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.header}>Edit Profile</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            value={gender}
            onChangeText={setGender}
          />

          <View style={{ marginTop: 20 }}>
            <Button title="Save" onPress={handleSave} />
          </View>

            {!isFirstTime && (
            <View style={{ marginTop: 10 }}>
                <Button title="Cancel" color="red" onPress={onClose} />
            </View>
            )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  box: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  label: {
    marginTop: 10,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
});
