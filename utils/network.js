import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getApiBaseUrl = () => {
  if (Platform.OS === 'ios') {
    return 'http://localhost:8000/';
  } else if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/';
  }
  return 'http://192.168.8.35:8000/'; // Your current IP address
}; 