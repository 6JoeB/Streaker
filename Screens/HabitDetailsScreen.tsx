import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ActivityIndicator,
} from 'react-native';
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
  const [habit, setHabit] = useState({});
  const [completedDays, setCompletedDays] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [dayStreakStartedOn, setDayStreakStartedOn] = useState('');
  const [totalDaysCompleted, setTotalDaysCompleted] = useState(0);
  const [futureDateError, setFutureDateError] = useState(false);
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] =
    useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      getDataObject(name, setHabit);
    }
  }, [isFocused]);

  useEffect(() => {
    if (Object.hasOwn(habit, 'name')) {
      setBestStreak(habit.bestStreak);
      setTotalDaysCompleted(habit.totalDaysCompleted);
      setCurrentStreak(habit.currentStreak);
      setCompletedDays(habit.completedDays);

      // requestWidgetUpdate({
      //   widgetName: 'Streak',
      //   renderWidget: () => <StreakWidget habit={habit} />,
      // });

      setLoading(false);
    }
  }, [habit]);

  useEffect(() => {
    if (completedDays !== undefined) {
      const newStreakData = calculateCurrentStreak(
        completedDays,
        habit.daysPerWeek,
      );
      setBestStreak(newStreakData.bestStreak);
      setCurrentStreak(newStreakData.currentStreak);
      setTotalDaysCompleted(newStreakData.totalDaysCompleted);
      setDayStreakStartedOn(newStreakData.dayStreakStartedOn);

      updateHabit();
    }
  }, [completedDays, habit.daysPerWeek]);

  const updateCompletedDays = (day: string) => {
    setFutureDateError(false);
    const timezoneOffset = new Date().getTimezoneOffset();
    const localTime = new Date(
      new Date().getTime() - timezoneOffset * 1000 * 60,
    );

    if (completedDays === undefined) {
      setCompletedDays([day]); // add first day
    } else if (completedDays.includes(day)) {
      setCompletedDays(completedDays.filter(item => item !== day)); // remove day
    } else if (localTime <= new Date(day)) {
      setFutureDateError(true); // catch future date
    } else {
      setCompletedDays(prev => [...prev, day]); // add new day
    }
  };

  const updateHabit = async () => {
    await setObjectValue(habit.name, {
      name: habit.name,
      daysPerWeek: habit.daysPerWeek,
      completedDays: completedDays,
      currentStreak: currentStreak,
      bestStreak: bestStreak,
      totalDaysCompleted: totalDaysCompleted,
    });
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

  return (
    <View style={{height: '100%', width: '100%'}}>
      <Modal
        transparent={true}
        visible={confirmDeleteModalVisible}
        animationType="slide">
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.text}>
              Are you sure you want to delete the habit &quot;{habit.name}
              &quot;?
            </Text>
            <View style={styles.modalButtonRow}>
              <Pressable
                style={styles.button}
                onPress={() => setConfirmDeleteModalVisible(false)}>
                <Text style={styles.buttonText}>No</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonRed]}
                onPress={() => deleteHabit()}>
                <Text style={styles.buttonText}>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {loading ? (
        <View style={styles.container}>
          <Text style={[styles.text, styles.centered]}>Loading</Text>
          <ActivityIndicator style={styles.loadingSpinner} color={'#219ebc'} />
        </View>
      ) : habit !== undefined ? (
        <View style={styles.container}>
          <Text style={styles.title}>{habit.name}</Text>
          <Text style={styles.text}>Current streak: {currentStreak}</Text>
          <Text style={styles.text}>
            {dayStreakStartedOn !== ''
              ? `Started on: ${dayStreakStartedOn}`
              : 'Started on: Unstarted'}
          </Text>
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
              style={styles.button}
              onPress={() =>
                navigation.navigate('Edit Habit', {
                  name: habit.name,
                })
              }>
              <Text style={styles.buttonText}>Edit</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonRed]}
              onPress={() => setConfirmDeleteModalVisible(true)}>
              <Text style={styles.buttonText}>Delete</Text>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButtonRow: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
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
    marginTop: 35,
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
    marginBottom: 15,
  },
  loadingSpinner: {
    marginTop: 5,
  },
});
