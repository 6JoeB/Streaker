import {setObjectValue} from './AsyncStorage';

export const calculateCurrentStreak = (
  completedDays: string[],
  daysPerWeek: number,
) => {
  // Order completedDays ascending
  let ascendingCompletedDays: string[] = completedDays.slice().sort((a, b) => {
    return new Date(a) - new Date(b);
  });

  // Setup variables
  const allowedMissingDays: number = 7 - daysPerWeek;
  let streak: number = 0;
  let possibleBestStreak: number = 0;
  let dateToCheckStreakFromString: string = ascendingCompletedDays[0];
  let lastDateStreakAchieved: string;
  if (ascendingCompletedDays.length > 0) {
    lastDateStreakAchieved = [
      ascendingCompletedDays[ascendingCompletedDays.length - 1],
    ];
  }
  let daysSinceMissedDate: number = 0;

  // Check if there is a streak within the allowed missing days
  while (ascendingCompletedDays.length > 0) {
    // Setup array of with 1 weeks worth of dates starting from first date in completedDays
    let weeksDates: string[] = [];

    for (let day = 0; day < 7; day++) {
      weeksDates.push(dayIncrement(dateToCheckStreakFromString, day));
    }

    dateToCheckStreakFromString = dayIncrement(dateToCheckStreakFromString, 7);

    let weeksMissedDates: number = 0;

    weeksDates.every(date => {
      // If completedDays is empty exit function
      if (ascendingCompletedDays.length <= 0) {
        return false;
      }

      // Check if date is past today date
      if (date > new Date().toISOString().slice(0, 10)) {
        return false;
      }

      // Check if the date has been missed in a week time span excluding todays date
      if (
        !ascendingCompletedDays.includes(date) &&
        date !== new Date().toISOString().slice(0, 10)
      ) {
        weeksMissedDates++;
        daysSinceMissedDate++;
      }

      // Not yet completing today does not break the streak but does not increase it either
      if (
        date === new Date().toISOString().slice(0, 10) &&
        !ascendingCompletedDays.includes(date)
      ) {
      } else {
        streak++;
      }

      // Set current streak to 0 if too many days have been missed
      if (weeksMissedDates > allowedMissingDays) {
        // Check for possible best streak in failed streak
        if (streak - daysSinceMissedDate >= possibleBestStreak) {
          possibleBestStreak = streak - daysSinceMissedDate;
        }

        streak = 0;
        dateToCheckStreakFromString = ascendingCompletedDays[0];

        return false;
      }

      // Set daysSinceMissedDate to 0 if date has not been missed
      if (ascendingCompletedDays.includes(date)) {
        daysSinceMissedDate = 0;
      }

      // Remove date from total completed dates array
      const index = ascendingCompletedDays.indexOf(date);
      if (index > -1) {
        ascendingCompletedDays.splice(index, 1);
      }
      return true;
    });
  }

  // Check if the gap between the last date achieved and today is larger than allowedMissingDays and thus the streak has ended
  if (lastDateStreakAchieved !== undefined) {
    const oneDay: number = 24 * 60 * 60 * 1000;
    const daysBetweenLastDateHabitAchievedAndToday: number =
      Math.round(
        Math.abs((new Date(lastDateStreakAchieved) - new Date()) / oneDay),
      ) - 2;

    if (daysBetweenLastDateHabitAchievedAndToday > allowedMissingDays) {
      // If streak is not active, check for possible best streak and subtract daysSinceMissedDate then set streak to 0
      if (streak - daysSinceMissedDate >= possibleBestStreak) {
        possibleBestStreak = streak - daysSinceMissedDate;
      }
      streak = 0;
    } else {
      // streak = streak + daysBetweenLastDateHabitAchievedAndToday;
    }
  }
  // Check for possible best streak in active streak
  if (streak > possibleBestStreak) {
    possibleBestStreak = streak;
  }

  return {
    bestStreak: possibleBestStreak,
    currentStreak: streak,
    totalDaysCompleted: completedDays.length,
  };
};

export const updateHabit = async (
  habitName: string,
  habitDaysPerWeek: number,
  habitCompletedDays: string[],
  habitCurrentStreak: number,
  HabitBestStreak: number,
  habitTotalDaysComplete: number,
) => {
  const success = await setObjectValue(habitName, {
    name: habitName,
    daysPerWeek: habitDaysPerWeek,
    completedDays: habitCompletedDays,
    currentStreak: habitCurrentStreak,
    bestStreak: HabitBestStreak,
    totalDaysCompleted: habitTotalDaysComplete,
  });
  return success;
};

export const dayIncrement = (date, days) => {
  const initialDate = new Date(date);

  let utcDate = Date.UTC(
    initialDate.getUTCFullYear(),
    initialDate.getUTCMonth(),
    initialDate.getUTCDate(),
    0,
    0,
    0,
  );

  const oneDay = 60 * 60 * 24 * 1000;

  utcDate += oneDay * days;

  let nextDate = new Date(utcDate);

  return nextDate.toISOString().slice(0, 10);
};
