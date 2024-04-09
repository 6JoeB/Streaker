export const streakWarningLevels: object[] = [
  {
    color: '#17BEBB',
    message: "Don't forget to make time today for your habits",
  },
  {
    color: '#53A548',
    message: 'Completed today, noice',
  },
  {
    color: '#E5D23E',
    message: 'Only 6 hours left!',
  },
  {
    color: '#E37907',
    message: 'Only 4 hours left!',
  },
  {
    color: '#CD5334',
    message: "Only 2 hours left! Don't let the flame die out!",
  },
];

export const updateStreakWarningLevel = (habit: {}) => {
  const today = new Date();
  const timeNow = new Date().getTime();

  const sixPM = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    18,
  ).getTime();

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

  if (habit.completedDays.includes(today.toISOString().slice(0, 10))) {
    return 1;
  } else if (timeNow >= tenPM) {
    return 4;
  } else if (timeNow >= eightPM) {
    return 3;
  } else if (timeNow >= sixPM) {
    return 2;
  } else {
    return 0;
  }
};
