export const calculateCurrentStreak = (
  completedDays: string[],
  habit: object,
  setBestStreak,
  setCurrentStreak,
) => {
  // Order completedDays ascending
  let ascendingCompletedDays: string[] = completedDays.slice().sort((a, b) => {
    return new Date(a) - new Date(b);
  });

  // Check if there is a streak within the allowed missing days
  const allowedMissingDays: number = 7 - habit.daysPerWeek;
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

      // Remove date from total completed dates array and increase streak by 1
      const index = ascendingCompletedDays.indexOf(date);
      if (index > -1) {
        streak++;
        ascendingCompletedDays.splice(index, 1);
        if (streak > possibleBestStreak) {
          possibleBestStreak = streak;
        }
      }
    });

    // Set streak to 0 if too many days have been missed
    if (weeksMissedDates > allowedMissingDays) {
      streak = 0;
      dateToCheckStreakFromString = ascendingCompletedDays[0];
    }
  }

  setBestStreak(possibleBestStreak);
  setCurrentStreak(streak);
};
