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

### NTH

- [ ] Home screen habits have easy button to set todays date to complete
- [ ] Add habit screen name text input should slow rotate through suggestions as placeholders
- [ ] Habits can have:
  - [ ] Colour
  - [ ] Emoji https://www.npmjs.com/package/emoji-picker-react
  - [ ] Complete total minutes per week instead of days
  - [ ] Breaking a habit options (like smoking etc)
- [ ] Streak time achievements (6 weeks etc)
- [ ] Streak time leaderboard
- [ ] Habit detail screen loading spinner
- [ ] View habit screen
  - [ ] Best streak
- [ ] Reminder at chosen time
- [ ] After successful edit show success toast
- [ ] Home screen with no habits could be intro screen

### Bugs

- [x] 1: Add habit button not staying at bottom of screen when no habits showing
- [x] 2: Add habit button text not centered
- [ ] 3: Streak calculates total completed days should this include missed days of a week if aim is less than 7
- [ ] 4: [TypeError: Cannot read property 'color' of undefined]
