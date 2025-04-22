import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ServerConfigScreen = ({navigation}) => {
  const [ipAddress, setIpAddress] = useState('');

  useEffect(() => {
    loadSavedIP();
  }, []);

  const loadSavedIP = async () => {
    try {
      const savedIP = await AsyncStorage.getItem('serverIP');
      if (savedIP) {
        setIpAddress(savedIP);
      }
    } catch (error) {
      console.error('Error loading saved IP:', error);
    }
  };

  const saveIP = async () => {
    try {
      // Basic IP validation
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (!ipRegex.test(ipAddress)) {
        Alert.alert('Error', 'Please enter a valid IP address');
        return;
      }

      await AsyncStorage.setItem('serverIP', ipAddress);
      Alert.alert('Success', 'Server IP saved successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving IP:', error);
      Alert.alert('Error', 'Failed to save IP address');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Server Configuration</Text>
      <Text style={styles.subtitle}>Enter your server's IP address</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter IP address (e.g., 192.168.8.35)"
        value={ipAddress}
        onChangeText={setIpAddress}
        keyboardType="numeric"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={saveIP}>
        <Text style={styles.buttonText}>Save Configuration</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ServerConfigScreen; 