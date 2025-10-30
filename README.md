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
  - Sshows all exercises with pre-filled sets/reps
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
- HomePage.js's "My Routines" section loads the RoutineList.js and the user's created routines separately. The created routines show within HomePage.js, while RoutineList.js you'd have to click "View All" for.
  > I'd like the routines to show the 3 most recent ones, and both kinds being accessible in RoutineList.js.
  > A delete routine function as well would be nice.
- ERROR Error saving routine: [Error: Call to function 'NativeDatabase.prepareAsync' has been rejected. → Caused by: java.lang.NullPointerException: java.lang.NullPointerException].
  > This has something to do with the way we call DBSetup(). This fires asynchronously, and we're not awaiting it before rendering <NavigationContainer>, which means all our screens may try to open the database before the setup is finished.

Workaround For Now:
- Everytime you get the error above, please stop the server and close the app on your emulator. Open it again and try one flow at a time.
