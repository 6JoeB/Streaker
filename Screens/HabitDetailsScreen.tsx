import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';
import {
  getDataObject,
  removeValue,
  setObjectValue,
} from '../Helpers/AsyncStorage';
import {Calendar} from 'react-native-calendars';

export const HabitDetailsScreen = ({navigation, route}) => {
  const {name} = route.params;

  const [activeDays, setActiveDays] = useState([]);
  const [habit, setHabit] = useState({});

  useEffect(() => {
    getDataObject(name, setHabit);
  }, []);

  useEffect(() => {
    console.log(activeDays);
  }, [activeDays]);

  //   useEffect(() => {
  // updateHabit()  }, [activeDays]);

  const updateActiveDays = (day: string) => {
    activeDays.includes(day)
      ? setActiveDays(activeDays.filter(item => item !== day))
      : setActiveDays(prev => [...prev, day]);
  };

  const updateHabit = () => {
    setObjectValue(name, {
      name: habit.name,
      daysPerWeek: habit.daysPerWeek,
      activeDays: activeDays,
    });
  };

  const deleteHabit = async () => {
    const success = await removeValue(habit.name);
    if (success) {
      navigation.navigate('Home');
    }
  };

  const generateMarkedDates = () => {
    let markedDates = {};
    activeDays.forEach(date => {
      markedDates[date] = {selected: true, selectedColor: '#00cc66'};
    });
    return markedDates;
  };

  return (
    <View>
      {habit !== undefined && (
        <View>
          <Text>{habit.name}</Text>
          <Text>{habit.daysPerWeek}</Text>
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
