import { openDatabaseAsync } from 'expo-sqlite';
import exercises from '../data/exercises.json';
import preMadeWorkouts from '../data/PreMadeWorkouts.json';

export async function DBSetup() {
  const db = await openDatabaseAsync('workout.db');

  // Create tables
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

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workout_exercises (
      workoutId INTEGER NOT NULL,
      exerciseId INTEGER NOT NULL,
      sets INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      weight REAL NOT NULL,
      FOREIGN KEY (workoutId) REFERENCES workouts(id),
      FOREIGN KEY (exerciseId) REFERENCES exercises(id)
    );
  `);

  // Insert exercises if table empty
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
  }

  // Insert premade workouts if empty
  const [{ count: wCount }] = await db.getAllAsync(
    'SELECT COUNT(*) as count FROM workouts;'
  );

  if (wCount === 0) {
    for (const workout of preMadeWorkouts) {
      await db.runAsync('INSERT INTO workouts (id, name) VALUES (?, ?);', [
        workout.workoutId,
        workout.name,
      ]);

      for (const ex of workout.exercises) {
        await db.runAsync(
          'INSERT INTO workout_exercises (workoutId, exerciseId, sets, reps, weight) VALUES (?, ?, ?, ?, ?);',
          [workout.workoutId, ex.exerciseId, ex.sets, ex.reps, ex.weight]
        );
      }
    }
  }

  console.log('Database setup complete');
}
