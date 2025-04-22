import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import {getApiBaseUrl} from '../utils/network';

// Configuration
const API_CONFIG = {
  BASE_URL: __DEV__ ? getApiBaseUrl() : 'https://your-production-url.com/',
  ENDPOINTS: {
    SCHEDULE: 'api/foodtrucks/schedule/',
  },
};

// Helper functions
const getTodayDate = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(today.getDate()).padStart(2, '0')}`;
};

const getCurrentHour = () => new Date().getHours();

const VolunteerRegistrationModal = ({
  visible,
  onClose,
  initialData,
}) => {
  const [registrationId, setRegistrationId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(initialData || null);
  const [activeMeal, setActiveMeal] = useState(null);

  useEffect(() => {
    if (initialData) {
      setUserData(initialData);
      setActiveMeal(determineMealStatus(initialData));
    }
  }, [initialData]);

  const handleInputChange = text => {
    if (/^\d*$/.test(text)) {
      setRegistrationId(text);
    }
  };

  const determineMealStatus = data => {
    const currentHour = getCurrentHour();
    const isLunchTime = currentHour < 16; // Before 4PM

    if (isLunchTime) {
      return {
        type: 'lunch',
        available: data.lunch === false,
        text: 'Avail Lunch',
        statusColor: styles.mealAvailable,
        statusText: data.lunch ? 'Lunch Already Availed' : 'Lunch Available',
      };
    } else {
      return {
        type: 'dinner',
        available: data.dinner === false,
        text: 'Avail Dinner',
        statusColor: styles.mealAvailable,
        statusText: data.dinner ? 'Dinner Already Availed' : 'Dinner Available',
      };
    }
  };

  const fetchVolunteerData = async () => {
    const trimmedId = registrationId.trim();

    if (!trimmedId) {
      Alert.alert('Error', 'Please enter registration ID');
      return;
    }
    if (!/^\d+$/.test(trimmedId)) {
      Alert.alert('Error', 'Registration ID must contain only numbers');
      return;
    }
    setIsLoading(true);
    try {
      const apiUrl = `${API_CONFIG.BASE_URL}${
        API_CONFIG.ENDPOINTS.SCHEDULE
      }?registrationid=${trimmedId}&date=${getTodayDate()}`;
      const response = await axios.get(apiUrl, {
        validateStatus: function (status) {
          return status >= 200 && status < 500; // Accept all status codes from 200 to 499
        },
      });
      const data = response.data;
      
      // Check if the response indicates no data found
      if (response.status === 300 || data.status === 300) {
        Alert.alert('Not Found', 'Registration ID not found');
        return;
      }
      
      setUserData(data);
      setActiveMeal(determineMealStatus(data));
    } catch (error) {
      console.error('API Error:', error);
      let errorMessage = 'Failed to fetch data';

      if (error.response) {
        errorMessage = error.response.data?.error || errorMessage;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMealAction = async () => {
    if (!userData || !activeMeal) return;
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SCHEDULE}`,
        {
          registrationid: registrationId,
          date: getTodayDate(),
          lunch: activeMeal.type === 'lunch' ? true : userData.lunch,
          dinner: activeMeal.type === 'dinner' ? true : userData.dinner,
        },
      );

      const updatedData = response.data;
      setUserData(updatedData);
      Alert.alert('Success', 'Meal status updated successfully');
      onClose();
    } catch (error) {
      console.error('Update Error:', error);
      Alert.alert('Error', 'Failed to update meal status');
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setRegistrationId('');
    setUserData(null);
    setActiveMeal(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={resetModal}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>
            {userData ? 'Volunteer Details' : 'Enter Registration ID'}
          </Text>

          {userData ? (
            <>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>
                  Name: {userData.food_truck_name}
                </Text>
                <Text style={styles.detailText}>
                  Type: {userData.food_truck_type}
                </Text>
                <Text style={styles.detailText}>Date: {userData.date}</Text>
                <Text style={[styles.mealStatusText, activeMeal?.statusColor]}>
                  {activeMeal?.statusText}
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={resetModal}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>

                {activeMeal?.available && (
                  <TouchableOpacity
                    style={[styles.button, styles.availButton]}
                    onPress={handleMealAction}>
                    <Text style={styles.buttonText}>{activeMeal?.text}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter registration ID"
                placeholderTextColor="#888"
                value={registrationId}
                onChangeText={handleInputChange}
                keyboardType="numeric"
                editable={!isLoading}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={resetModal}
                  disabled={isLoading}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.continueButton]}
                  onPress={fetchVolunteerData}
                  disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Continue</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  detailsContainer: {
    marginBottom: 25,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  mealStatusText: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 15,
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
  },
  mealAvailable: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
  },
  mealAvailed: {
    backgroundColor: '#e8f5e9',
    color: '#388e3c',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: 'grey',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  continueButton: {
    backgroundColor: '#2196f3',
  },
  availButton: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default VolunteerRegistrationModal; 