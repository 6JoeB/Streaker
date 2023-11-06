import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AddHabitScreen from './Screens/AddHabitScreen';
import HomeScreen from './Screens/HomeScreen';
import {HabitDetailsScreen} from './Screens/HabitDetailsScreen';
import {HelloWidgetPreviewScreen} from './Screens/WidgetPreviewScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Add Habit" component={AddHabitScreen} />
        <Stack.Screen name="Habit Details" component={HabitDetailsScreen} />
        <Stack.Screen
          name="Preview Widget"
          component={HelloWidgetPreviewScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
