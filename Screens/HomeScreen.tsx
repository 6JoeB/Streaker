import React, {useEffect, useState} from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import {getAllKeys, getDataObjects} from '../utils/AsyncStorage';

const HomeScreen = ({navigation}) => {
  const [habits, setHabits] = useState([]);
  const [asyncStorageKeys, setAsyncStorageKeys] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getAllKeys(setAsyncStorageKeys);
    }
  }, [isFocused]);

  useEffect(() => {
    getDataObjects(asyncStorageKeys, setHabits);
  }, [asyncStorageKeys]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {asyncStorageKeys.length > 0 && habits.length > 0 ? (
        habits.map(habit => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Habit Details', {
                name: habit.name,
              })
            }>
            <Text>{habit.name}</Text>
            <Text>Aim: {habit.daysPerWeek} </Text>
            <Text>Best streak: {habit.bestStreak} </Text>
            <Text>Completed days: {habit.completedDays.length} </Text>
            <Text>Current streak: {habit.currentStreak} </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>Habits will show here once one is created</Text>
      )}
      <Button
        title="Add Habit"
        onPress={() => navigation.navigate('Add Habit')}
      />
      <Button
        title="Preview Widget"
        onPress={() => navigation.navigate('Preview Widget')}
      />
    </View>
  );
};

export default HomeScreen;
