import React, {useEffect, useState} from 'react';
import {View, Text, Button, TextInput, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddHabitScreen = ({navigation}) => {
  const [habitName, setHabitName] = useState('');
  const [habitDaysPerWeek, setHabitDaysPerWeek] = useState(5);

  const updateHabitsDaysPerWeekValue = (increase: boolean) => {
    if (increase && habitDaysPerWeek < 7) {
      setHabitDaysPerWeek(habitDaysPerWeek + 1);
    } else if (!increase && habitDaysPerWeek > 1) {
      setHabitDaysPerWeek(habitDaysPerWeek - 1);
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
      <Text>How many days per week would you like do this</Text>
      <View>
        <Icon
          name="plus"
          size={30}
          color="black"
          onPress={() => updateHabitsDaysPerWeekValue(true)}
        />
        <Icon
          name="minus"
          size={30}
          color="black"
          onPress={() => updateHabitsDaysPerWeekValue(false)}
        />
        <Text>{habitDaysPerWeek}</Text>
      </View>
      <Button title="Add" onPress={() => navigation.navigate('Home')} />
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
