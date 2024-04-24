import {setObjectValue} from './AsyncStorage';

export const calculateCurrentStreak = (
  completedDays: string[],
  daysPerWeek: number,
) => {
  console.log('---------------------------------');
  // Order completedDays ascending
  let ascendingCompletedDays: string[] = completedDays.slice().sort((a, b) => {
    return new Date(a) - new Date(b);
  });

  // Setup variables
  const allowedMissingDays: number = 7 - daysPerWeek;
  let streak: number = 0;
  let possibleBestStreak: number = 0;
  let dateToCheckStreakFromString: string = ascendingCompletedDays[0];
  const lastDateStreakAchieved: string = [
    ascendingCompletedDays[ascendingCompletedDays.length - 1],
  ];

  // Check if there is a streak within the allowed missing days
  while (ascendingCompletedDays.length > 0) {
    // Setup array of with 1 weeks worth of dates starting from first date in completedDays
    let weeksDates: string[] = [];

    for (let day = 0; day < 7; day++) {
      let weekDate = new Date(dateToCheckStreakFromString);
      weekDate.setDate(weekDate.getDate() + day);
      const stringDate = weekDate.toISOString().slice(0, 10);
      weeksDates.push(stringDate);
    }

    let dateToCheckStreakFromDate = new Date(dateToCheckStreakFromString);
    dateToCheckStreakFromDate.setDate(dateToCheckStreakFromDate.getDate() + 7);
    dateToCheckStreakFromString = dateToCheckStreakFromDate
      .toISOString()
      .slice(0, 10);

    let weeksMissedDates: number = 0;
    let daysSinceMissedDate: number = 0;

    weeksDates.every(date => {
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
        if (streak > possibleBestStreak) {
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

      // Check for possible best streak in current streak
      if (streak > possibleBestStreak) {
        possibleBestStreak = streak;
      }

      // If its the last day of the streak week, weekly aim is 1, and daysSinceMissedDate >= 6
      // check if last date of the week and the next date after that is not complete, if not complete end streak
      let finalWeekDate = new Date(weeksDates[weeksDates.length - 1]);
      finalWeekDate.setDate(finalWeekDate.getDate() + 1);
      const stringFinalWeekDate = finalWeekDate.toISOString().slice(0, 10);

      if (
        date === weeksDates[weeksDates.length - 1] &&
        daysPerWeek === 1 &&
        daysSinceMissedDate >= 6 &&
        !ascendingCompletedDays.includes(stringFinalWeekDate)
      ) {
        streak = 0;
      }
      return true;
    });
  }

  // Check if the gap between the last date achieved and today is larger than allowedMissingDays and thus the streak has ended
  const oneDay: number = 24 * 60 * 60 * 1000;
  const daysBetweenLastDateHabitAchievedAndToday: number =
    Math.round(
      Math.abs((new Date(lastDateStreakAchieved) - new Date()) / oneDay),
    ) - 2;

  if (daysBetweenLastDateHabitAchievedAndToday > allowedMissingDays) {
    console.log(
      daysBetweenLastDateHabitAchievedAndToday + ' ' + allowedMissingDays,
    );
    streak = 0;
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
