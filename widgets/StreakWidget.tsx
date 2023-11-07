import React from 'react';
import {FlexWidget, TextWidget} from 'react-native-android-widget';

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
  let streakLossWarningMessage: string =
    'you ony have 2 hours left to complete';

  if (Object.hasOwn(habit, 'name')) {
    habitLoaded = true;
  }

  console.log(habit);

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
          <TextWidget text={streakLossWarningMessage} />
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
