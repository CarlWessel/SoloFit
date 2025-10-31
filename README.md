New Files:
1. StartWorkout.js - Page that "Start Empty Workout" button in HomePage.js leads to.
  - Allows adding exercises manually
  - Has an "Add Exercise from..." button that opens a model to select exercises from Routines and Premade Workouts
  - Saves to WorkoutHistory when completed
2. WorkoutHistory.js - Shows completed workouts with:
  - List of all workouts sorted by date
  - Exercise details for each workout
  - Delete workout functionality
3. PremadeWorkouts.js - Displays the premade workouts from the DB
  - Tapping a workout navigates to UseWorkout page
4. UseWorkout.js - Pre-filled workout page that:
  - Works for both routines and premade workouts
  - Shows all exercises with pre-filled sets/reps
  - Allows user to only modify date and exercise values (not exercises)
  - Saves to workout history

Updated Files:
1. HomePage.js:
   - "Start Empty Workout" now navigates to StartWorkout.js
   - "Premade Workouts" now navigates to PremadeWorkouts.js
   - Footer "Workouts" changed to "WorkoutHistory" and navigates to WorkoutHistory.js, as per Dot's suggestion
   - Clicking a routine opens UseWorkout page
2. AddRoutine.js:
   - Now fully functional!
3. DBSetup.js:
   - Added workout_history table for storing completed workouts.
   - Added workout_history_exercises table for workout exercise details.
4. App.js:
   - Added new screen routes

Problems:
- UI. My main goal was to make sure that workflow is working well. But the UI sucks. It's big and wonky compared to Fernando's AddRoutine.js
- When editing a Routine, it starts as a blank slate. This is a skill issue.