import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';
import {removeValue} from '../Helpers/AsyncStorage';
import {Calendar, LocaleConfig} from 'react-native-calendars';

export const HabitDetailsScreen = ({navigation, route}) => {
  const {name, daysPerWeek} = route.params;

  const [selected, setSelected] = useState('');

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  const deleteHabit = async () => {
    const success = await removeValue(name);
    if (success) {
      navigation.navigate('Home');
    }
  };

  return (
    <View>
      <Text>{name}</Text>
      <Text>{daysPerWeek}</Text>
      <Calendar
        onDayPress={day => {
          setSelected(day.dateString);
        }}
        markedDates={{
          [selected]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: 'orange',
          },
        }}
      />
      <Button title="Delete Habit" onPress={() => deleteHabit()} />
    </View>
  );
};
