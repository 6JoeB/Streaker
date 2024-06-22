import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getAllKeys, getDataObjects} from '../utils/AsyncStorage';
import {
  calculateCurrentStreak,
  dayIncrement,
  formatTodaysDate,
  getCurrentLocalDate,
  updateHabit,
} from '../utils/HabitStreakHelper';
import {theme} from '../utils/Theme';

const HomeScreen = ({navigation}) => {
  const [habits, setHabits] = useState([]);
  const [asyncStorageKeys, setAsyncStorageKeys] = useState([]);
  const [habitsToCompleteToday, setHabitsToCompleteToday] = useState([]);

  const isFocused = useIsFocused();
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    if (isFocused) {
      getAllKeys(setAsyncStorageKeys);
    }
  }, [isFocused]);

  useEffect(() => {
    getDataObjects(asyncStorageKeys, setHabits);
  }, [asyncStorageKeys]);

  useEffect(() => {
    let habitsUpdated: number = 0;
    let newHabitsToCompleteToday = [];

    habits.forEach(habit => {
      const newStreakData = calculateCurrentStreak(
        habit.completedDays,
        habit.daysPerWeek,
      );

      if (
        newStreakData.bestStreak !== habit.bestStreak ||
        newStreakData.currentStreak !== habit.currentStreak ||
        newStreakData.totalDaysCompleted !== habit.totalDaysCompleted
      ) {
        const success = updateHabit(
          habit.name,
          habit.daysPerWeek,
          habit.completedDays,
          newStreakData.currentStreak,
          newStreakData.bestStreak,
          newStreakData.totalDaysCompleted,
        );
        if (success) {
          habitsUpdated++;
        }
      }

      calculateIfHabitRequiresCompletionToday(
        habit,
        newHabitsToCompleteToday,
        newStreakData.dateCurrentWeekOfStreakStartedFrom,
      );
    });

    if (habitsUpdated > 0) {
      getDataObjects(asyncStorageKeys, setHabits);
    }
    setHabitsToCompleteToday(newHabitsToCompleteToday);
  }, [habits]);

  const updateCompletedDays = async (habit: any) => {
    const day: string = formatTodaysDate();
    const dateCompleted: boolean = habit.completedDays.includes(
      formatTodaysDate(),
    );
    let newCompletedDays: string[] = [];

    if (dateCompleted) {
      newCompletedDays = habit.completedDays.filter(item => item !== day); // remove day
    } else {
      newCompletedDays = habit.completedDays.slice();
      newCompletedDays.push(day); // add day
    }

    // calculate new streak data
    const newStreakData = calculateCurrentStreak(
      newCompletedDays,
      habit.daysPerWeek,
    );

    // update habit with new streak data
    const success = await updateHabit(
      habit.name,
      habit.daysPerWeek,
      newCompletedDays,
      newStreakData.currentStreak,
      newStreakData.bestStreak,
      newStreakData.totalDaysCompleted,
    );

    // retrieve new habit data
    if (success) {
      getDataObjects(asyncStorageKeys, setHabits);
    }
  };

  const calculateIfHabitRequiresCompletionToday = (
    habit,
    newHabitsToCompleteToday,
    dateCurrentWeekOfStreakStartedFrom,
  ) => {
    // If streak is 0 habit needs to be done today
    if (habit.currentStreak === 0) {
      newHabitsToCompleteToday.push(habit.name);
    }

    // If today is included in completed days, habit doesn't need to be done today
    if (habit.completedDays.includes(formatTodaysDate())) {
      return;
    }

    // Create an array of the current streak weeks dates that are not in the future and calculate days left in the streak
    let weeksDates: String[] = [];
    let daysLeftInStreak: number = 1;
    for (let day = 0; day < 7; day++) {
      const date = dayIncrement(dateCurrentWeekOfStreakStartedFrom, day);
      if (new Date(date) < getCurrentLocalDate()) {
        weeksDates.push(dayIncrement(dateCurrentWeekOfStreakStartedFrom, day));
      } else {
        daysLeftInStreak++;
      }
    }

    // Calculate how many days there are left to complete
    let daysToCompleteThisWeek: number = habit.daysPerWeek;
    weeksDates.forEach(day => {
      if (habit.completedDays.includes(day)) {
        daysToCompleteThisWeek--;
      }
    });

    if (daysToCompleteThisWeek === daysLeftInStreak) {
      newHabitsToCompleteToday.push(habit.name);
    }
  };

  return (
    <View style={{minHeight: windowHeight - 80}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
        <View style={styles.habitsContainer}>
          {asyncStorageKeys.length > 0 && habits.length > 0 && (
            <View style={styles.todaysHabitContainer}>
              <Text style={styles.habitNameText}>Todays required habits:</Text>
              {habitsToCompleteToday.length > 0 ? (
                habitsToCompleteToday.map(habit => {
                  return <Text style={styles.text}>{habit}</Text>;
                })
              ) : (
                <Text style={[styles.text, styles.centeredText]}>
                  All complete today, well done!
                </Text>
              )}
            </View>
          )}

          {asyncStorageKeys.length > 0 && habits.length > 0 ? (
            habits.map(habit => (
              <TouchableOpacity
                style={styles.habitContainer}
                onPress={() =>
                  navigation.navigate('Habit Details', {
                    name: habit.name,
                  })
                }>
                <Text style={[styles.habitNameText, styles.centeredText]}>
                  {habit.name}
                </Text>
                <View>
                  <View style={styles.habitRow}>
                    <Text style={styles.text}>
                      Current streak: {habit.currentStreak}
                    </Text>
                    <Text style={styles.text}>
                      Best streak: {habit.bestStreak}
                    </Text>
                  </View>
                  <View style={styles.completedTodayRow}>
                    <Text style={[styles.text, styles.centeredText]}>
                      Completed today?{' '}
                    </Text>
                    <TouchableOpacity
                      style={styles.radioOuter}
                      onPress={() => {
                        updateCompletedDays(habit);
                      }}>
                      {habit.completedDays.includes(formatTodaysDate()) ? (
                        <View style={styles.radioInner} />
                      ) : null}
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.centeredContainer}>
              <Text style={[styles.text, styles.centeredText]}>Welcome to</Text>
              <Text style={styles.mainTitle}>Streaker</Text>
              <Text style={[styles.text, styles.centeredText, styles.mb10]}>
                Habits will show here once they are added.
              </Text>
              <Text style={[styles.text, styles.centeredText, styles.mb10]}>
                They can be tapped on to edit, delete or fill in completed days.
              </Text>
              <Text style={[styles.text, styles.centeredText]}>
                Click the plus button in the bottom right corner to add a new
                habit.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('Add Habit')}>
          <Icon
            style={styles.iconCentered}
            name="plus"
            size={40}
            color={'black'}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  habitsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    paddingBottom: 120,
    paddingTop: 10,
  },
  habitContainer: {
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    backgroundColor: theme.mainColour,
    overflow: 'hidden',
    elevation: 2,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    overflow: 'hidden',
  },
  habitRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  completedTodayRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  title: {
    fontSize: 30,
    color: 'black',
    margin: 20,
    marginTop: 30,
    fontWeight: 'bold',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  mainTitle: {
    fontSize: 35,
    color: 'black',
    marginBottom: 50,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    color: 'black',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
  centeredText: {textAlign: 'center'},
  habitNameText: {
    color: 'black',
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: 0.25,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {position: 'absolute', bottom: 20, right: 20},
  button: {
    backgroundColor: theme.button,
    width: 75,
    height: 75,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  iconCentered: {
    transform: [
      {
        translateY: 1.5,
      },
    ],
  },
  mb10: {
    marginBottom: 10,
  },
  radioOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {height: 12, width: 12, borderRadius: 6, backgroundColor: '#000'},
  todaysHabitContainer: {
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    backgroundColor: theme.secondaryColour,
    overflow: 'hidden',
    elevation: 2,
  },
});

export default HomeScreen;
