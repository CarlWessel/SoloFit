import { openDatabaseAsync } from 'expo-sqlite';
import exercises from '../data/Exercises.json';
import preMadeWorkouts from '../data/PreMadeWorkouts.json';

export async function DBSetup() {
  const db = await openDatabaseAsync('workout.db');

  // === Create tables ===
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );
  `);

  // Linking table between workouts and exercises
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workout_exercises (
      workoutId INTEGER NOT NULL,
      exerciseId INTEGER NOT NULL,
      FOREIGN KEY (workoutId) REFERENCES workouts(id),
      FOREIGN KEY (exerciseId) REFERENCES exercises(id)
    );
  `);

  // New table for per-set data
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workout_exercise_sets (
      workoutId INTEGER NOT NULL,
      exerciseId INTEGER NOT NULL,
      setNumber INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      weight REAL NOT NULL,
      FOREIGN KEY (workoutId) REFERENCES workouts(id),
      FOREIGN KEY (exerciseId) REFERENCES exercises(id)
    );
  `);

  // === Insert exercises if table is empty ===
  const [{ count: exCount }] = await db.getAllAsync(
    'SELECT COUNT(*) as count FROM exercises;'
  );

  if (exCount === 0) {
    for (const ex of exercises) {
      await db.runAsync('INSERT INTO exercises (id, name) VALUES (?, ?);', [
        ex.id,
        ex.name,
      ]);
    }
    console.log('✅ Inserted base exercises');
  }

  // === Insert premade workouts if empty ===
  const [{ count: wCount }] = await db.getAllAsync(
    'SELECT COUNT(*) as count FROM workouts;'
  );

  if (wCount === 0) {
    for (const workout of preMadeWorkouts) {
      // Insert workout
      await db.runAsync('INSERT INTO workouts (id, name) VALUES (?, ?);', [
        workout.workoutId,
        workout.name,
      ]);

      // Loop through exercises in this workout
      for (const ex of workout.exercises) {
        // Link workout and exercise
        await db.runAsync(
          'INSERT INTO workout_exercises (workoutId, exerciseId) VALUES (?, ?);',
          [workout.workoutId, ex.exerciseId]
        );

        // Insert each set (use index + 1 for setNumber)
        for (let i = 0; i < ex.Sets.length; i++) {
          const set = ex.Sets[i];
          await db.runAsync(
            'INSERT INTO workout_exercise_sets (workoutId, exerciseId, setNumber, reps, weight) VALUES (?, ?, ?, ?, ?);',
            [workout.workoutId, ex.exerciseId, i + 1, set.reps, set.weight]
          );
        }
      }
    }
    console.log('✅ Inserted pre-made workouts with per-set data');
  }

  console.log('📦 Database setup complete');
}
