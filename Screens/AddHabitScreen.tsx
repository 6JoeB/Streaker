import React, {useState} from 'react';
import {View, Text, Button, TextInput, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {storeDataObject} from '../Helpers/AsyncStorage';

const AddHabitScreen = ({navigation, route}) => {
  const [habitName, setHabitName] = useState('');
  const [habitDaysPerWeek, setHabitDaysPerWeek] = useState(5);
  const [nameInputError, setNameInputError] = useState(false);

  let asyncStorageKeys: [] = route.params.asyncStorageKeys;

  const updateHabitsDaysPerWeekValue = (increase: boolean) => {
    if (increase && habitDaysPerWeek < 7) {
      setHabitDaysPerWeek(habitDaysPerWeek + 1);
    } else if (!increase && habitDaysPerWeek > 1) {
      setHabitDaysPerWeek(habitDaysPerWeek - 1);
    }
  };

  const addHabit = () => {
    setNameInputError(false);
    if (habitName.length < 1) {
      setNameInputError(true);
      return;
    }

    let duplicateKey = asyncStorageKeys.filter(obj => {
      return obj.key === habitName;
    });

    if (duplicateKey.length === 0) {
      storeDataObject(habitName, {
        name: habitName,
        daysPerWeek: habitDaysPerWeek,
      });
    }
  };

  return (
    <View>
      <Text>Add a new habit</Text>
      <Text>Name of habit</Text>
      <TextInput
        style={styles.input}
        onChangeText={(e: string) => setHabitName(e)}
        value={habitName}
        placeholder="Habit name here"
      />
      {nameInputError && (
        <Text>
          Please include a name for this habit that is not a repeat of another
          habit
        </Text>
      )}
      <Text>How many days per week would you like do this</Text>
      <View>
        <Icon
          name="plus"
          size={30}
          color={habitDaysPerWeek < 7 ? 'black' : 'grey'}
          onPress={() => updateHabitsDaysPerWeekValue(true)}
        />
        <Icon
          name="minus"
          size={30}
          color={habitDaysPerWeek > 1 ? 'black' : 'grey'}
          onPress={() => updateHabitsDaysPerWeekValue(false)}
        />
        <Text>{habitDaysPerWeek}</Text>
      </View>
      <Button title="Add" onPress={addHabit} />
      <Button title="Cancel" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default AddHabitScreen;
