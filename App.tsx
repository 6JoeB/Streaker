import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AddHabitScreen from './Screens/AddHabitScreen';
import HomeScreen from './Screens/HomeScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Add Habit" component={AddHabitScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
