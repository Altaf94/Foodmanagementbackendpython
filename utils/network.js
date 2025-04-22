import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getApiBaseUrl = async () => {
  if (Platform.OS === 'ios') {
    return 'http://localhost:8000/';
  } else if (Platform.OS === 'android') {
    if (__DEV__) {
      return 'http://10.0.2.2:8000/'; // For Android emulator
    }
    try {
      const savedIP = await AsyncStorage.getItem('serverIP');
      return savedIP ? `http://${savedIP}:8000/` : 'http://192.168.8.35:8000/';
    } catch (error) {
      console.error('Error getting saved IP:', error);
      return 'http://192.168.8.35:8000/';
    }
  }
  return 'http://192.168.8.35:8000/';
}; 