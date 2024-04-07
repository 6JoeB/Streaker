import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {useIsFocused} from '@react-navigation/native';
import {requestWidgetUpdate} from 'react-native-android-widget';

import {
  getDataObject,
  removeValue,
  setObjectValue,
} from '../utils/AsyncStorage';
import {calculateCurrentStreak} from '../utils/HabitStreakHelper';
import {StreakWidget} from '../widgets/StreakWidget';

export const HabitDetailsScreen = ({navigation, route}) => {
  const {name} = route.params;

  const [loading, setLoading] = useState(true);
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
      setBestStreak(habit.bestStreak);
      setTotalDaysCompleted(habit.totalDaysCompleted);
      setCurrentStreak(habit.currentStreak);

      requestWidgetUpdate({
        widgetName: 'Streak',
        renderWidget: () => <StreakWidget habit={habit} />,
      });

      setLoading(false);
    }
  }, [habit]);

  useEffect(() => {
    if (completedDays !== undefined) {
      calculateCurrentStreak(
        completedDays,
        habit.daysPerWeek,
        setBestStreak,
        setCurrentStreak,
        setTotalDaysCompleted,
      );
    }
  }, [completedDays]);

  useEffect(() => {
    if (
      completedDays !== habit.completedDays ||
      bestStreak !== habit.bestStreak ||
      currentStreak !== habit.currentStreak ||
      totalDaysCompleted !== habit.totalDaysCompleted
    ) {
      updateHabit();
    }
  }, [totalDaysCompleted]);

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
      navigation.navigate('Habits');
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

  //
  return (
    <View style={{height: '100%', width: '100%'}}>
      {loading ? (
        <View style={styles.container}>
          <Text style={[styles.text, styles.centered]}>Loading..</Text>
        </View>
      ) : habit !== undefined ? (
        <View style={styles.container}>
          <Text style={styles.title}>{habit.name}</Text>
          <Text style={styles.text}>Current streak: {currentStreak}</Text>
          <Text style={styles.text}>Best streak: {bestStreak}</Text>
          <Text style={styles.text}>Weekly aim: {habit.daysPerWeek}</Text>
          <Text style={styles.text}>
            Total days completed: {totalDaysCompleted}
          </Text>
          <Calendar
            style={styles.calendar}
            onDayPress={day => {
              updateCompletedDays(day.dateString);
            }}
            markedDates={generateMarkedDates()}
            firstDay={1}
            theme={{todayTextColor: 'black', todayBackgroundColor: '#d9d9d9'}}
          />
          {futureDateError && (
            <Text style={[styles.text, styles.warningText]}>
              That day is in the future!
            </Text>
          )}

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, styles.buttonRed]}
              onPress={() => deleteHabit()}>
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() =>
                navigation.navigate('Edit Habit', {
                  name: habit.name,
                })
              }>
              <Text style={styles.buttonText}>Edit</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={[styles.text, styles.centered]}>
            Error loading habit, try restarting the app.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 15,
    overflow: 'hidden',
  },
  title: {
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  text: {
    color: 'black',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    marginBottom: 3,
  },
  warningText: {
    color: 'red',
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    backgroundColor: '#219ebc',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 22,
    height: 50,
    width: 120,
    borderRadius: 4,
    elevation: 3,
  },
  buttonRed: {
    backgroundColor: '#d63633',
  },
  calendar: {
    marginTop: 10,
    marginBottom: 50,
  },
});
