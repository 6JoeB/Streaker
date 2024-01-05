import React from 'react';
import {FlexWidget, TextWidget} from 'react-native-android-widget';
import {
  streakWarningLevels,
  updateStreakWarningLevel,
} from '../utils/StreakWidgetHelper';

// todo:
// styling
// onclick widget load app
// choose which habit to show or show all at a time
// pass habit on create widget
// check habit data not cleared after update
// update image for widget

type HabitProps = {
  name: string;
  daysPerWeek: number;
  completedDays: [];
  currentStreak: number;
  bestStreak: number;
  totalDaysCompleted: number;
};

export function StreakWidget({habit}: HabitProps) {
  let habitLoaded: boolean = false;

  let streakWarningLevel: number;

  if (habit !== undefined && Object.hasOwn(habit, 'name')) {
    streakWarningLevel = updateStreakWarningLevel(habit);
    habitLoaded = true;
  }

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: streakWarningLevels[streakWarningLevel].color,
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
