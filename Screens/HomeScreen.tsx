import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';

import {getAllKeys, getDataObjects} from '../Helpers/AsyncStorage';

const HomeScreen = ({navigation, route}) => {
  const [habits, setHabits] = useState([]);
  const [asyncStorageKeys, setAsyncStorageKeys] = useState([]);

  useEffect(() => {
    getAllKeys(setAsyncStorageKeys);
  }, []);

  useEffect(() => {
    getDataObjects(asyncStorageKeys, setHabits);
  }, [asyncStorageKeys]);

  useEffect(() => {
    console.log(habits);
  }, [habits]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {/* {asyncStorageKeys.length > 0 && habits[1].length > 0 ? (
        habits[1].forEach(item => {
          <Text>hello</Text>;
        })
      ) : (
        <Text>Habits will show here once one is created</Text>
      )} */}
      <Button
        title="Add Habit"
        onPress={() => navigation.navigate('Add Habit')}
      />
    </View>
  );
};

export default HomeScreen;
