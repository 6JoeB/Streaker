import {setObjectValue} from './AsyncStorage';

export const calculateCurrentStreak = (
  completedDays: string[],
  daysPerWeek: number,
) => {
  // Order completedDays ascending
  let ascendingCompletedDays: string[] = completedDays.slice().sort((a, b) => {
    return new Date(a) - new Date(b);
  });

  // Check if there is a streak within the allowed missing days
  const allowedMissingDays: number = 7 - daysPerWeek;
  let streak: number = 0;
  let possibleBestStreak: number = 0;
  let dateToCheckStreakFromString: string = ascendingCompletedDays[0];

  while (ascendingCompletedDays.length > 0) {
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
    weeksDates.forEach(date => {
      // Check if date is past today date
      if (date > new Date().toISOString().slice(0, 10)) {
        return;
      }

      // Check if the date has been missed in a week time span excluding todays date
      if (
        !ascendingCompletedDays.includes(date) &&
        date !== new Date().toISOString().slice(0, 10)
      ) {
        weeksMissedDates++;
      }

      // Set current streak to 0 if too many days have been missed
      if (weeksMissedDates > allowedMissingDays) {
        streak = 0;
        dateToCheckStreakFromString = ascendingCompletedDays[0];
        return;
      }

      // Remove date from total completed dates array, increase streak by 1, check for possible best streak
      const index = ascendingCompletedDays.indexOf(date);
      if (index > -1) {
        streak++;
        ascendingCompletedDays.splice(index, 1);
        if (streak > possibleBestStreak) {
          possibleBestStreak = streak;
        }
      }
    });
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
