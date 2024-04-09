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

const HomeScreen = ({navigation}) => {
  const [habits, setHabits] = useState([]);
  const [asyncStorageKeys, setAsyncStorageKeys] = useState([]);

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

  return (
    <View style={{minHeight: windowHeight - 80}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
        <View style={styles.habitsContainer}>
          {asyncStorageKeys.length > 0 && habits.length > 0 ? (
            habits.map(habit => (
              <TouchableOpacity
                style={styles.habitContainer}
                onPress={() =>
                  navigation.navigate('Habit Details', {
                    name: habit.name,
                  })
                }>
                <Text style={styles.habitNameText}>{habit.name}</Text>
                <View style={styles.habitDetailsContainer}>
                  <View style={styles.habitRow}>
                    <Text style={styles.text}>
                      Current streak: {habit.currentStreak}
                    </Text>
                    <Text style={styles.text}>
                      Best streak: {habit.bestStreak}
                    </Text>
                  </View>
                  <View style={styles.habitRow}>
                    <Text style={styles.text}>
                      Weekly aim: {habit.daysPerWeek}
                    </Text>
                    <Text style={styles.text}>
                      Completed days: {habit.completedDays.length}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.centeredContainer}>
              <Text style={[styles.text, styles.centeredText]}>
                Habits will show here once they are added
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
    backgroundColor: '#8ecae6',
    overflow: 'hidden',
    elevation: 2,
  },
  habitDetailsContainer: {
    height: 40,
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
  title: {
    fontSize: 30,
    color: 'black',
    margin: 20,
    marginTop: 30,
    fontWeight: 'bold',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  text: {
    color: 'black',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
  habitNameText: {
    color: 'black',
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: 0.25,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {position: 'absolute', bottom: 20, right: 20},
  button: {
    backgroundColor: '#219ebc',
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
});

export default HomeScreen;
