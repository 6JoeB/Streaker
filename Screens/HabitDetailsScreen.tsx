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
      calculateCurrentStreak();
      setTotalDaysCompleted(completedDays.length);
      if (completedDays !== habit.completedDays) {
        updateHabit();
      }
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

  const calculateCurrentStreak = () => {
    // Order completedDays ascending
    let ascendingCompletedDays: string[] = completedDays
      .slice()
      .sort((a, b) => {
        return new Date(a) - new Date(b);
      });

    // Check if there is a streak within the allowed missing days
    const allowedMissingDays: number = 7 - habit.daysPerWeek;
    let streak: number = 0;
    let possibleBestStreak: number = 0;
    let dateToCheckStreakFromString: string = ascendingCompletedDays[0];

    while (ascendingCompletedDays.length > 0) {
      let weeksDates: string[] = [];

      for (let day = 0; day < 7; day++) {
        let weekDate = new Date(dateToCheckStreakFromString);
        weekDate.setDate(weekDate.getDate() + day);
        const stringDate = weekDate.toISOString().slice(0, 10);
        weeksDates.push(stringDate);
      }

      let dateToCheckStreakFromDate = new Date(dateToCheckStreakFromString);
      dateToCheckStreakFromDate.setDate(
        dateToCheckStreakFromDate.getDate() + 7,
      );
      dateToCheckStreakFromString = dateToCheckStreakFromDate
        .toISOString()
        .slice(0, 10);

      let weeksMissedDates: number = 0;

      weeksDates.forEach(date => {
        // Check if date is past today date
        if (date > new Date().toISOString().slice(0, 10)) {
          return;
        }

        // Check if the date has been missed in a week time span excluding todays date
        if (
          !ascendingCompletedDays.includes(date) &&
          date !== new Date().toISOString().slice(0, 10)
        ) {
          weeksMissedDates++;
        }

        // Remove date from total completed dates array and increase streak by 1
        const index = ascendingCompletedDays.indexOf(date);
        if (index > -1) {
          streak++;
          ascendingCompletedDays.splice(index, 1);
          if (streak > possibleBestStreak) {
            possibleBestStreak = streak;
          }
        }
      });

      // Set streak to 0 if too many days have been missed
      if (weeksMissedDates > allowedMissingDays) {
        streak = 0;
        dateToCheckStreakFromString = ascendingCompletedDays[0];
      }
    }

    setBestStreak(possibleBestStreak);
    setCurrentStreak(streak);
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
        </View>
      )}
    </View>
  );
};
