import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveServerIp = async (ip) => {
  try {
    await AsyncStorage.setItem('serverIp', ip);
    return true;
  } catch (error) {
    console.error('Error saving server IP:', error);
    return false;
  }
};

export const getServerIp = async () => {
  try {
    return await AsyncStorage.getItem('serverIp');
  } catch (error) {
    console.error('Error getting server IP:', error);
    return null;
  }
}; 