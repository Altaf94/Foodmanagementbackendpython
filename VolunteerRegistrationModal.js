import React, { useState } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';

const VolunteerRegistrationModal = () => {
  const [userData, setUserData] = useState(null);
  const [activeMeal, setActiveMeal] = useState(null);
  const [registrationId, setRegistrationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMealAction = async () => {
    if (!userData || !activeMeal) return;

    setIsLoading(true);
    try {
      const YOUR_COMPUTER_IP = '192.168.8.34';
      const apiUrl = `http://${YOUR_COMPUTER_IP}:8000/api/foodtrucks/schedule/`;
      
      const response = await axios.patch(apiUrl, {
        registrationid: registrationId,
        date: getTodayDate(),
        lunch: activeMeal.type === 'lunch' ? true : userData.lunch,
        dinner: activeMeal.type === 'dinner' ? true : userData.dinner
      });

      if (onContinue) onContinue(response.data);
      onClose();
    } catch (error) {
      console.error('Update Error:', error);
      Alert.alert('Error', 'Failed to update meal status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Rest of the component code
  );
};

export default VolunteerRegistrationModal; 