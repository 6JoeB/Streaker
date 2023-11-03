import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';
import {
  getDataObject,
  removeValue,
  setObjectValue,
} from '../Helpers/AsyncStorage';
import {Calendar} from 'react-native-calendars';
import {useIsFocused} from '@react-navigation/native';

export const HabitDetailsScreen = ({navigation, route}) => {
  const {name} = route.params;

  const [completedDays, setCompletedDays] = useState([]);
  const [habit, setHabit] = useState({});
  const [futureDateError, setFutureDateError] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getDataObject(name, setHabit);
    }
  }, [isFocused]);

  useEffect(() => {
    if (Object.hasOwn(habit, 'name')) {
      setCompletedDays(habit.completedDays);
    }
  }, [habit]);

  useEffect(() => {
    if (completedDays !== undefined && completedDays !== habit.completedDays) {
      updateHabit();
    }
  }, [completedDays]);

  const updateCompletedDays = (day: string) => {
    setFutureDateError(false);
    if (completedDays === undefined) {
      setCompletedDays([day]); // add first day
    } else if (completedDays.includes(day)) {
      setCompletedDays(completedDays.filter(item => item !== day)); // remove day
    } else if (new Date() <= new Date(day)) {
      setFutureDateError(true); // catch future date
    } else {
      setCompletedDays(prev => [...prev, day]); // add new day
    }
  };

  const updateHabit = async () => {
    const success = await setObjectValue(habit.name, {
      name: habit.name,
      daysPerWeek: habit.daysPerWeek,
      completedDays: completedDays,
    });
    if (success) {
      getDataObject(name, setHabit);
    }
  };

  const deleteHabit = async () => {
    const success = await removeValue(habit.name);
    if (success) {
      navigation.navigate('Home');
    }
  };

  const generateMarkedDates = () => {
    let markedDates = {};
    if (completedDays !== undefined) {
      completedDays.forEach(date => {
        markedDates[date] = {selected: true, selectedColor: '#00cc66'};
      });
    }
    return markedDates;
  };

  return (
    <View>
      {habit !== undefined && (
        <View>
          <Text>{habit.name}</Text>
          <Text>{habit.daysPerWeek}</Text>
          {futureDateError && <Text>That day is in the future!</Text>}
          <Calendar
            onDayPress={day => {
              updateCompletedDays(day.dateString);
            }}
            markedDates={generateMarkedDates()}
            theme={{todayTextColor: 'black', todayBackgroundColor: '#d9d9d9'}}
          />
          <Button title="Delete Habit" onPress={() => deleteHabit()} />
        </View>
      )}
    </View>
  );
};
