import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';

const HomeScreen = ({navigation, route}) => {
  let asyncStorageKeys: [] = route.params.asyncStorageKeys;
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {asyncStorageKeys.length > 0 ? (
        <Text>habits here</Text>
      ) : (
        <Text>Habits will show here once one is created</Text>
      )}
      <Button
        title="Add Habit"
        onPress={() => navigation.navigate('Add Habit')}
      />
    </View>
  );
};

export default HomeScreen;
