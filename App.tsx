import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AddHabitScreen from './Screens/AddHabitScreen';
import HomeScreen from './Screens/HomeScreen';
import {getAllKeys} from './Helpers/AsyncStorage';

const Stack = createNativeStackNavigator();

function App() {
  const [asyncStorageKeys, setAsyncStorageKeys] = useState([]);

  useEffect(() => {
    getAllKeys(setAsyncStorageKeys);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          initialParams={{asyncStorageKeys}}
          component={HomeScreen}
        />
        <Stack.Screen
          name="Add Habit"
          initialParams={{asyncStorageKeys}}
          component={AddHabitScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
