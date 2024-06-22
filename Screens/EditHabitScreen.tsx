import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useIsFocused} from '@react-navigation/native';

import {
  getAllKeys,
  getDataObject,
  removeValue,
  storeDataObject,
} from '../utils/AsyncStorage';
import {theme} from '../utils/Theme';

const EditHabitScreen = ({navigation, route}) => {
  const [habit, setHabit] = useState({});
  const [habitName, setHabitName] = useState('');
  const [habitDaysPerWeek, setHabitDaysPerWeek] = useState(5);
  const [asyncStorageKeys, setAsyncStorageKeys] = useState([]);

  const [loading, setLoading] = useState(true);
  const [nameInputError, setNameInputError] = useState(false);
  const [editError, setEditError] = useState(false);
  const [noChangesError, setNoChangesError] = useState(false);

  const {name} = route.params;

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getAllKeys(setAsyncStorageKeys);
      getDataObject(name, setHabit);
    }
  }, [isFocused]);

  useEffect(() => {
    setHabitName(habit.name);
    setHabitDaysPerWeek(habit.daysPerWeek);
    setLoading(false);
  }, [habit]);

  const updateHabitsDaysPerWeekValue = (increase: boolean) => {
    if (increase && habitDaysPerWeek < 7) {
      setHabitDaysPerWeek(habitDaysPerWeek + 1);
    } else if (!increase && habitDaysPerWeek > 1) {
      setHabitDaysPerWeek(habitDaysPerWeek - 1);
    }
  };

  const editHabit = async () => {
    setNameInputError(false);
    setNoChangesError(false);

    let duplicateKey = [];

    if (habit.daysPerWeek === habitDaysPerWeek) {
      if (habit.name === habitName) {
        setNoChangesError(true);
        return;
      }
      duplicateKey = asyncStorageKeys.filter(obj => {
        return obj === habitName;
      });
    }

    if (duplicateKey.length !== 0 || habitName.length <= 0) {
      setNameInputError(true);
      return;
    }

    const deleteSuccess = await removeValue(habit.name);

    if (!deleteSuccess) {
      setEditError(true);
      return;
    }

    const storeSuccess = await storeDataObject(habitName, {
      name: habitName,
      daysPerWeek: habitDaysPerWeek,
      completedDays: habit.completedDays,
      currentStreak: habit.currentStreak,
      bestStreak: habit.bestStreak,
      totalDaysCompleted: habit.totalDaysCompleted,
    });

    if (!storeSuccess) {
      setEditError(true);
      return;
    }

    navigation.navigate('Habit Details', {
      name: habitName,
    });
  };

  return (
    <View style={styles.editHabitContainer}>
      {loading ? (
        <View style={styles.container}>
          <Text style={[styles.text, styles.centered]}>Loading</Text>
          <ActivityIndicator style={styles.loadingSpinner} color={'#219ebc'} />
        </View>
      ) : habit !== undefined ? (
        <View>
          <Text style={styles.title}>Editing &quot;{name}&quot;</Text>
          <View style={{marginBottom: 10}}>
            {nameInputError && (
              <Text style={[styles.text, styles.warningText]}>
                Please include a name for this habit that is not a repeat of
                another habit
              </Text>
            )}

            <Text style={styles.text}>Name of habit</Text>
            <TextInput
              style={styles.input}
              onChangeText={(e: string) => setHabitName(e)}
              value={habitName}
            />
          </View>
          <View style={{marginBottom: 50}}>
            <Text style={styles.text}>
              How many days per week are you aiming to do this?
            </Text>
            <View style={styles.frequencyRow}>
              <Icon
                name="minus"
                size={30}
                color={habitDaysPerWeek > 1 ? 'black' : 'grey'}
                onPress={() => updateHabitsDaysPerWeekValue(false)}
              />
              <Text style={styles.daysPerWeekText}>{habitDaysPerWeek}</Text>
              <Icon
                name="plus"
                size={30}
                color={habitDaysPerWeek < 7 ? 'black' : 'grey'}
                onPress={() => updateHabitsDaysPerWeekValue(true)}
              />
            </View>
          </View>
          {editError && (
            <Text
              style={[
                styles.text,
                styles.centered,
                styles.warningText,
                styles.mb10,
              ]}>
              Error updating the habit.
            </Text>
          )}
          {noChangesError && (
            <Text style={[styles.text, styles.centered, styles.mb10]}>
              No changes made.
            </Text>
          )}
          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, styles.buttonRed]}
              onPress={() =>
                navigation.navigate('Habit Details', {
                  name: habit.name,
                })
              }>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={editHabit}>
              <Text style={styles.buttonText}>Confirm</Text>
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
  editHabitContainer: {
    flex: 1,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'center',
    overflow: 'hidden',
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
  centered: {
    textAlign: 'center',
  },
  frequencyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  input: {
    height: 40,
    marginTop: 6,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    color: 'black',
    marginBottom: 50,
    fontWeight: 'bold',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  text: {
    color: 'black',
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
  warningText: {
    color: 'red',
    marginBottom: 5,
  },
  daysPerWeekText: {
    color: 'black',
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: 0.25,
    marginLeft: 15,
    marginRight: 15,
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
    backgroundColor: theme.button,
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
    backgroundColor: theme.buttonRed,
  },
  mb10: {
    marginBottom: 10,
  },
  loadingSpinner: {
    marginTop: 5,
  },
});

export default EditHabitScreen;
