import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {TouchableOpacity, Text} from 'react-native';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import VolunteerRegistrationModal from './screens/VolunteerRegistrationModal';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={({navigation}) => ({
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Settings')}
                style={{marginRight: 15}}>
                <Text style={{color: '#4A90E2', fontSize: 16}}>Settings</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            title: 'Server Settings',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App; 