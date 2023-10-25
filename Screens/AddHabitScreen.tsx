import React, {useEffect, useState} from 'react';
import {View, Text, Button, TextInput, StyleSheet} from 'react-native';

const AddHabitScreen = ({navigation}) => {
  const [newHabitData, setNewHabitData] = useState({
    name: '',
    daysPerWeek: '',
  });

  useEffect(() => {
    console.log(newHabitData);
  }, [newHabitData]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Add Habit</Text>
      <Text>Name:</Text>
      <TextInput
        style={styles.input}
        onChangeText={e => setNewHabitData({...newHabitData, name: e})}
        value={newHabitData.name}
        placeholder="Habit name"
      />
      <Text>How many days per week would you like do this:</Text>
      // Create 1 to 7 days numeric input here //
      {/* Number(newHabitData.daysPerWeek)
      e => setNewHabitData({...newHabitData, daysPerWeek: String(e)} */}
      <Button title="Add" onPress={() => navigation.navigate('home')} />
      <Button title="Cancel" onPress={() => navigation.navigate('home')} />
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
