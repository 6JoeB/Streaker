# Streaker

Habit tracker with a widget that shows your current streak

## Features Roadmap

### MVP

- [x] Home screen: Shows current habits being tracked
  - [x] Calculate streak stats on screen show
  - [x] Add habit button links to add habit screen
  - [x] Each habit display in module which can be clicked for expanded view.
    - [x] Name
    - [x] Current streak
  - [x] Styling
- [x] Add habit screen
  - [x] Name (cannot repeat)
  - [x] Frequency aim per week (1 to 7 days)
  - [x] Create habit button
  - [x] Cancel button
  - [x] Styling
- [x] Edit habit screen
  - [x] Name (cannot repeat)
  - [x] Frequency aim per week (1 to 7 days)
  - [x] Update habit button
  - [x] Cancel button
  - [x] Styling
- [x] View habit screen
  - [x] Show Name, frequency
  - [x] Current streak
  - [x] Total days achieved
  - [x] Best streak
  - [x] Click edit button to open edit habit screen
  - [x] Click delete button to remove habit
  - [x] Are you sure you want to delete habit
  - [x] Calender
    - [x] Today highlighted
    - [x] Showing days habit achieved in green
    - [x] Click day to toggle habit achieved/habit not achieved
  - [x] Styling
- [ ] Android widget
  - [x] Current active streak
  - [x] Name of habit
  - [ ] Button onclick sets today to complete
  - [x] Progessively more urgent messages to not lose the streak
  - [ ] Styling

### Bugs

- [x] 1: Add habit button not staying at bottom of screen when no habits showing
- [x] 2: Add habit button text not centered
- [ ] 3: [TypeError: Cannot read property 'color' of undefined]
- [ ] 4: That day is in the future warning has trouble just after midnight
- [x] 5: Calender slow sometimes

### NTH

- [x] Home screen habits have easy button to set todays date to complete
- [x] Habit detail screen loading spinner
- [x] Home screen with no habits could be intro screen
- [ ] Show date the streak was started on
- [ ] Home screen should show the habits that need to be done today or else the streak will be lost
- [ ] Reminders, daily at chosen time, only if habit needs to be achieved today to not break streak?
- [ ] Have option for required minutes per day
- [ ] Error message for future dates should not push buttons down when it shows
- [ ] Colour picker for habits

### Ideation

- [ ] Once past certain amount of days show years/months/weeks etc
- [ ] Cumulative days streaks as a score vs previous best
- [ ] Add habit screen name text input should slow rotate through suggestions as placeholders
- [ ] After successful edit show success toast
- [ ] Streak calculates total completed days should this include missed days of a week if aim is less than 7?
- [ ] Habits can have:
  - [ ] Colour
  - [ ] Emoji https://www.npmjs.com/package/emoji-picker-react
  - [ ] Complete total minutes per week instead of days
  - [ ] Breaking a habit options (like smoking etc)
- [ ] Streak time achievements (6 weeks etc)
- [ ] Streak time leaderboard
- [ ] Show cumulative days/weeks spend achieving habits
- [ ] Change DB
- [ ] Changing habit frequency doesnt disrupt old streak at other frequency
- [ ] Google analytics on habit creation
- [ ] Completed days should be out of possible days since the habit was started, this could be optional to see
- [ ] Compact and detailed view for home screen habit cards
