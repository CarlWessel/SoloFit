20251106 Trish Updates:
1. Fixed DB bug, please test.
- Still going to clean this uop. I moved table creation to DatabaseManager to have a single source of truth and a guaranteed initialization order, making it thread-safe. I realize this blurs the line a bit between DBSetup and DatabaseManager, so that's something for later.
2. If screen greys out, exit app and reopen (do not stop server). In my experience this only happens the very first time the database is initialized, likely due to a race condition.
- MAKE SURE TO CLEAR EXPO APP'S STORAGE BEFORE TESTING

20251030 Dot updates
Stuff for discussing at the meeting or improvment:
1. How should sets work (it's doing very wonky stuff for the moment)
2. Do we want a workout name or just save the datetime
3. For the number input, the keyboard will disappear after I click any thing on the keyboard
4. For premade routine, I suggest having a bool like isPremade in the db instead of hardcode the id limit
5. Seems the app will crash sometimes
6. I suggest combine some of the pages, for example Startworkout/Useworkout/Editworkout and PremadeRoutine/RoutineList because these pages have similar UI and functionality, we can just use a bool or status enum to determine the different parts
7. Polish the UI for a more consistent style
8. There might be more but I forgot

20251030 Trish updates
New Files:
1. StartWorkout.js - Page that "Start Empty Workout" button in HomePage.js leads to.
  - Allows adding exercises manually
  - Has an "Add Exercise from..." button that opens a model to select exercises from Routines and Premade routines
  - Saves to WorkoutHistory when completed
2. WorkoutHistory.js - Shows completed workouts with:
  - List of all workouts sorted by date
  - Exercise details for each workout
  - Delete workout functionality
3. PremadeRoutines.js - Displays the premade routines from the DB
  - Tapping a workout navigates to UseWorkout page
4. UseWorkout.js - Pre-filled workout page that:
  - Works for both routines and premade routines
  - Shows all exercises with pre-filled sets/reps
  - Allows user to only modify date and exercise values (not exercises)
  - Saves to workout history

Updated Files:
1. HomePage.js:
   - "Start Empty Workout" now navigates to StartWorkout.js
   - "Premade routines" now navigates to PremadeRoutines.js
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