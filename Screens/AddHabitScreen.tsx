import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, TextInput, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useIsFocused} from '@react-navigation/native';

import {getAllKeys, storeDataObject} from '../utils/AsyncStorage';

const AddHabitScreen = ({navigation}) => {
  const [habitName, setHabitName] = useState('');
  const [habitDaysPerWeek, setHabitDaysPerWeek] = useState(5);
  const [nameInputError, setNameInputError] = useState(false);
  const [asyncStorageKeys, setAsyncStorageKeys] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getAllKeys(setAsyncStorageKeys);
    }
  }, [isFocused]);

  const updateHabitsDaysPerWeekValue = (increase: boolean) => {
    if (increase && habitDaysPerWeek < 7) {
      setHabitDaysPerWeek(habitDaysPerWeek + 1);
    } else if (!increase && habitDaysPerWeek > 1) {
      setHabitDaysPerWeek(habitDaysPerWeek - 1);
    }
  };

  const addHabit = () => {
    setNameInputError(false);
    const duplicateKey = asyncStorageKeys.filter(obj => {
      return obj === habitName;
    });

    if (duplicateKey.length === 0 && habitName.length > 1) {
      storeDataObject(habitName, {
        name: habitName,
        daysPerWeek: habitDaysPerWeek,
        completedDays: [],
        currentStreak: 0,
        bestStreak: 0,
        totalDaysCompleted: 0,
      });
      navigation.navigate('Habits');
    } else {
      setNameInputError(true);
      return;
    }
  };

  return (
    <View style={styles.addHabitContainer}>
      <View>
        <Text style={styles.title}>Add a new habit</Text>
        <View style={{marginBottom: 10}}>
          <Text style={styles.text}>Name of habit</Text>
          <TextInput
            style={styles.input}
            onChangeText={(e: string) => setHabitName(e)}
            value={habitName}
            placeholder="Lift weights.."
          />
          {nameInputError && (
            <Text style={[styles.text, styles.warningText]}>
              Please include a name for this habit that is not a repeat of
              another habit
            </Text>
          )}
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
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.button, styles.buttonRed]}
            onPress={() => navigation.navigate('Habits')}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={addHabit}>
            <Text style={styles.buttonText}>Add</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  addHabitContainer: {
    flex: 1,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'center',
    overflow: 'hidden',
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
});

export default AddHabitScreen;
