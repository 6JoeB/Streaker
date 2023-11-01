import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import {getAllKeys, getDataObjects, removeValue} from '../Helpers/AsyncStorage';

const HomeScreen = ({navigation, route}) => {
  const [habits, setHabits] = useState([]);
  const [asyncStorageKeys, setAsyncStorageKeys] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getAllKeys(setAsyncStorageKeys);
    }
  }, [isFocused]);

  useEffect(() => {
    getDataObjects(asyncStorageKeys, habits, setHabits);
  }, [asyncStorageKeys]);

  const removeHabit = async (name: string) => {
    const success = await removeValue(name);
    if (success) {
      setHabits(habits.filter(habit => habit.name !== name));
    }
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {asyncStorageKeys.length > 0 && habits.length > 0 ? (
        habits.map(habit => (
          <View>
            <Text>
              {habit.name} {habit.daysPerWeek}
            </Text>
            <Button
              title="Remove Habit"
              onPress={() => removeHabit(habit.name)}
            />
          </View>
        ))
      ) : (
        <Text>Habits will show here once one is created</Text>
      )}
      <Button
        title="Add Habit"
        onPress={() => navigation.navigate('Add Habit')}
      />
    </View>
  );
};

export default HomeScreen;
