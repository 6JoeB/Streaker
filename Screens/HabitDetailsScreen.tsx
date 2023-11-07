import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {useIsFocused} from '@react-navigation/native';
import {requestWidgetUpdate, WidgetPreview} from 'react-native-android-widget';

import {
  getDataObject,
  removeValue,
  setObjectValue,
} from '../utils/AsyncStorage';
import {calculateCurrentStreak} from '../utils/HabitStreakHelper';
import {StreakWidget} from '../widgets/StreakWidget';

export const HabitDetailsScreen = ({navigation, route}) => {
  const {name} = route.params;

  const [completedDays, setCompletedDays] = useState([]);
  const [habit, setHabit] = useState({});
  const [futureDateError, setFutureDateError] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalDaysCompleted, setTotalDaysCompleted] = useState(0);

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
    if (completedDays !== undefined) {
      calculateCurrentStreak(
        completedDays,
        habit,
        setBestStreak,
        setCurrentStreak,
      );
      setTotalDaysCompleted(completedDays.length);
      if (completedDays !== habit.completedDays) {
        updateHabit();
      }
    }
  }, [completedDays]);

  useEffect(() => {
    if (currentStreak !== undefined) {
      requestWidgetUpdate({
        widgetName: 'Streak',
        renderWidget: () => <StreakWidget habit={habit} />,
        widgetNotFound: () => {
          // Called if no widget is present on the home screen
        },
      });
    }
  }, [currentStreak]);

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
      currentStreak: currentStreak,
      bestStreak: bestStreak,
      totalDaysCompleted: totalDaysCompleted,
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
          <Text>Weekly aim:{habit.daysPerWeek}</Text>
          <Text>Total days completed: {totalDaysCompleted}</Text>
          <Text>Current streak: {currentStreak}</Text>
          <Text>Best streak: {bestStreak}</Text>
          {futureDateError && <Text>That day is in the future!</Text>}
          <Calendar
            onDayPress={day => {
              updateCompletedDays(day.dateString);
            }}
            markedDates={generateMarkedDates()}
            firstDay={1}
            theme={{todayTextColor: 'black', todayBackgroundColor: '#d9d9d9'}}
          />
          <Button title="Delete Habit" onPress={() => deleteHabit()} />
          <View style={styles.container}>
            <WidgetPreview
              renderWidget={() => <StreakWidget habit={habit} />}
              width={320}
              height={200}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
