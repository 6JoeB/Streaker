import React, {useEffect, useState, useRef} from 'react';
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

  const [activeDays, setActiveDays] = useState([]);
  const [habit, setHabit] = useState({});
  const [futureDateError, setFutureDateError] = useState(false);

  const isFocused = useIsFocused();
  const isMountingRef = useRef(false);
  isMountingRef.current = true;

  useEffect(() => {
    if (isFocused) {
      getDataObject(name, setHabit);
    }
  }, [isFocused]);

  useEffect(() => {
    if (Object.hasOwn(habit, 'name')) {
      setActiveDays(habit.activeDays);
    }
  }, [habit]);

  useEffect(() => {
    if (activeDays !== undefined && activeDays !== habit.activeDays) {
      updateHabit();
    }
  }, [activeDays]);

  const updateActiveDays = (day: string) => {
    setFutureDateError(false);
    if (activeDays === undefined) {
      setActiveDays([day]); // add first day
    } else if (activeDays.includes(day)) {
      setActiveDays(activeDays.filter(item => item !== day)); // remove day
    } else if (new Date() <= new Date(day)) {
      setFutureDateError(true);
    } else {
      setActiveDays(prev => [...prev, day]); // add new day
    }
  };

  const updateHabit = async () => {
    const success = await setObjectValue(habit.name, {
      name: habit.name,
      daysPerWeek: habit.daysPerWeek,
      activeDays: activeDays,
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
    if (activeDays !== undefined) {
      activeDays.forEach(date => {
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
              updateActiveDays(day.dateString);
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
