import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import VolunteerRegistrationModal from './VolunteerRegistrationModal';
import axios from 'axios';
import {getApiBaseUrl} from '../utils/network';

// Configuration
const API_CONFIG = {
  BASE_URL: __DEV__ ? getApiBaseUrl() : 'https://your-production-url.com/',
  ENDPOINTS: {
    SCHEDULE: 'api/foodtrucks/schedule/',
  },
};

// Helper function to get today's date
const getTodayDate = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(today.getDate()).padStart(2, '0')}`;
};

export const HomeScreen = ({navigation}) => {
  const {logout} = useContext(AuthContext);
  const [selectedOption, setSelectedOption] = useState('scan');
  const [showScanner, setShowScanner] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  const handleContinue = () => {
    if (selectedOption === 'scan') {
      setShowScanner(true);
    } else if (selectedOption === 'menu') {
      setShowVolunteerModal(true);
    }
  };

  const fetchUserData = async registrationId => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SCHEDULE}?registrationid=${registrationId}&date=${getTodayDate()}`,
      );
      const userData = response.data;
      setScannedData(userData);
      setShowScanner(false);
      setShowVolunteerModal(true);
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to fetch user data',
        [
          {
            text: 'OK',
            onPress: () => setShowScanner(false),
          },
        ],
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onSuccess = e => {
    const registrationId = e.data;
    fetchUserData(registrationId);
  };

  if (showScanner) {
    return (
      <View style={styles.scannerContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>Fetching user data...</Text>
          </View>
        ) : (
          <QRCodeScanner
            onRead={onSuccess}
            flashMode={RNCamera.Constants.FlashMode.auto}
            topContent={
              <Text style={styles.centerText}>
                Scan the QR code on the food truck
              </Text>
            }
            bottomContent={
              <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={() => setShowScanner(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            }
          />
        )}
      </View>
    );
  }

  if (showVolunteerModal) {
    return (
      <VolunteerRegistrationModal
        visible={true}
        onClose={() => {
          setShowVolunteerModal(false);
          setScannedData(null);
        }}
        initialData={scannedData}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Welcome to Global Encounter Food Management
        </Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedOption === 'scan' && styles.selectedOption,
            ]}
            onPress={() => setSelectedOption('scan')}>
            <Text
              style={[
                styles.optionText,
                selectedOption === 'scan' && styles.selectedOptionText,
              ]}>
              Scan QR Code
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedOption === 'menu' && styles.selectedOption,
            ]}
            onPress={() => setSelectedOption('menu')}>
            <Text
              style={[
                styles.optionText,
                selectedOption === 'menu' && styles.selectedOptionText,
              ]}>
              Find Volunteer
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
  },
  bottomContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#2C3E50',
    marginTop: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  optionButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#E8F0FE',
    width: '45%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D6E0F0',
  },
  selectedOption: {
    backgroundColor: '#4A90E2',
    borderColor: '#3A7BC8',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#2C3E50',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  centerText: {
    fontSize: 18,
    padding: 32,
    color: '#5D6D7E',
    fontWeight: '500',
  },
  buttonTouchable: {
    padding: 16,
  },
  buttonText: {
    fontSize: 18,
    color: '#4A90E2',
    fontWeight: '600',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#5D6D7E',
    fontWeight: '500',
  },
});

export default HomeScreen; 