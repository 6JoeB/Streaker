import React from 'react';
import {View, Text, Button} from 'react-native';
import {removeValue} from '../Helpers/AsyncStorage';

export const HabitDetailsScreen = ({navigation, route}) => {
  const {name, daysPerWeek} = route.params;

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
      <Button title="Delete Habit" onPress={() => deleteHabit()} />
    </View>
  );
};
