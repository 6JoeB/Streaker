import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AddHabitScreen from './Screens/AddHabitScreen';
import HomeScreen from './Screens/HomeScreen';
import {HabitDetailsScreen} from './Screens/HabitDetailsScreen';
import EditHabitScreen from './Screens/EditHabitScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Habits">
        <Stack.Screen name="Habits" component={HomeScreen} />
        <Stack.Screen name="Add Habit" component={AddHabitScreen} />
        <Stack.Screen name="Habit Details" component={HabitDetailsScreen} />
        <Stack.Screen name="Edit Habit" component={EditHabitScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
