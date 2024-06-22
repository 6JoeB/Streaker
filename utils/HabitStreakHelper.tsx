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
  let dateCurrentWeekOfStreakStartedFrom: string = '';
  let lastDateStreakAchieved: string;
  if (ascendingCompletedDays.length > 0) {
    lastDateStreakAchieved = [
      ascendingCompletedDays[ascendingCompletedDays.length - 1],
    ];
  }
  let daysSinceMissedDateThisStreak: number = 0;
  let dayStreakStartedOn: string = '';
  let weeksMissedDates: number = 0;

  // Check if there is a streak within the allowed missing days
  while (ascendingCompletedDays.length > 0) {
    dayStreakStartedOn = getDayFromDate(ascendingCompletedDays[0]);
    // Setup array with 1 weeks worth of dates starting from first date in completedDays
    let weeksDates: string[] = [];

    for (let day = 0; day < 7; day++) {
      weeksDates.push(dayIncrement(dateToCheckStreakFromString, day));
    }

    // Check if the next week of streak starts in the future
    if (
      new Date(dayIncrement(dateToCheckStreakFromString, 7)) <=
      getCurrentLocalDate()
    ) {
      dateToCheckStreakFromString = dayIncrement(
        dateToCheckStreakFromString,
        7,
      );
    }
    dateCurrentWeekOfStreakStartedFrom = dateToCheckStreakFromString;

    weeksMissedDates = 0;

    weeksDates.every(date => {
      // Check if date is past todays date
      if (new Date(date) > getCurrentLocalDate()) {
        return false;
      }

      // Check if the date has been missed in a week time span excluding todays date
      if (
        !ascendingCompletedDays.includes(date) &&
        date !== formatTodaysDate()
      ) {
        weeksMissedDates++;
        daysSinceMissedDateThisStreak++;
      }

      // Increase streak including missed days as long as streak is active
      if (ascendingCompletedDays.includes(date)) {
        streak += 1 + daysSinceMissedDateThisStreak;
      }

      // Set current streak to 0 if too many days have been missed
      if (weeksMissedDates > allowedMissingDays) {
        // Check for possible best streak in failed streak
        if (streak >= possibleBestStreak) {
          possibleBestStreak = streak;
        }

        streak = 0;
        daysSinceMissedDateThisStreak = 0;

        dateToCheckStreakFromString = ascendingCompletedDays[0];
        dayStreakStartedOn = getDayFromDate(ascendingCompletedDays[0]);

        return false;
      }

      // Set daysSinceMissedDate to 0 if date has not been missed
      if (ascendingCompletedDays.includes(date)) {
        daysSinceMissedDateThisStreak = 0;
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
    const daysBetweenLastDateHabitAchievedAndToday: number = Math.round(
      Math.abs(
        (new Date(lastDateStreakAchieved) -
          new Date(getCurrentLocalDate().setHours(1, 0, 0, 0))) /
          oneDay,
      ),
    );

    // Streak is over if the days between the last date the habit was achieved not including today is greater than the allowed missed days
    if (daysBetweenLastDateHabitAchievedAndToday - 1 > allowedMissingDays) {
      // If streak is not active, check for possible best streak and then set streak to 0
      if (streak >= possibleBestStreak) {
        possibleBestStreak = streak;
      }
      streak = 0;
      dayStreakStartedOn = '';
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
    dayStreakStartedOn: dayStreakStartedOn,
    dateCurrentWeekOfStreakStartedFrom: dateCurrentWeekOfStreakStartedFrom,
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
  if (date === '') {
    return;
  }

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

const getDayFromDate = date => {
  let day = new Date(date).getDay();
  return [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ][day];
};

export const getCurrentLocalDate = () => {
  const timezoneOffset = new Date().getTimezoneOffset();
  const localTime = new Date(new Date().getTime() - timezoneOffset * 1000 * 60);

  return localTime;
};

export const formatTodaysDate = () => {
  var today = getCurrentLocalDate();
  var dd = today.getUTCDate().toString().padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  return yyyy + '-' + mm + '-' + dd;
};
