import React from 'react';
import {FlexWidget, TextWidget} from 'react-native-android-widget';

// todo:
// make widget smaller
// onclick widget load app
// choose which habit to show
// messages as day gets later to complete task...
// ...check habit data not cleared after update,times: 10pm RED 8pm orange 6pm yellow
// update image for widget

// type HabitProps = {
//   name: string;
//   daysPerWeek: string[];
//   completedDays: [];
//   currentStreak: number;
//   bestStreak: number;
//   totalDaysCompleted: number;
// };

export function StreakWidget({habit}) {
  let habitLoaded: boolean = false;

  const streakWarningLevels: object[] = [
    {
      color: 'green',
      message: "Don't forget to make time today for good habits",
    },
    {
      color: 'yellow',
      message: 'Only 6 hours left!',
    },
    {
      color: 'orange',
      message: 'Only 4 hours left!',
    },
    {
      color: 'red',
      message: 'Only 2 hours left!',
    },
  ];

  let streakWarningLevel: number = 0;

  if (Object.hasOwn(habit, 'name')) {
    habitLoaded = true;
  }

  const updateStreakWarningLevels = () => {
    const today = new Date();
    const timeNow = new Date().getTime();

    const sixPM = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      18,
    ).getTime();

    if (
      habit.completedDays.includes(today.toISOString().slice(0, 10)) ||
      timeNow < sixPM
    ) {
      streakWarningLevel = 0;
      return;
    }

    const eightPM = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      20,
    ).getTime();

    const tenPM = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      22,
    ).getTime();

    if (timeNow >= tenPM) {
      streakWarningLevel = 3;
    } else if (timeNow >= eightPM) {
      streakWarningLevel = 2;
    } else if (timeNow >= sixPM) {
      streakWarningLevel = 1;
    }
  };

  updateStreakWarningLevels();
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
      }}>
      {habitLoaded ? (
        <FlexWidget>
          <TextWidget text={habit.name} />
          <TextWidget text={'Current streak ' + habit.currentStreak} />
          <TextWidget text={streakWarningLevels[streakWarningLevel].message} />
        </FlexWidget>
      ) : (
        <TextWidget
          text={'Habit name loading'}
          style={{
            fontSize: 32,
            fontFamily: 'Inter',
            color: '#000000',
          }}
        />
      )}
    </FlexWidget>
  );
}
