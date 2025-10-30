import { openDatabaseAsync } from 'expo-sqlite';
import exercises from '../data/exercises.json';
import preMadeRoutines from '../data/PreMadeRoutines.json';
import workoutHistorySample from '../data/WorkoutHistorySample.json';

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
    CREATE TABLE IF NOT EXISTS routines (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS routine_exercises (
      routineId INTEGER NOT NULL,
      exerciseId INTEGER NOT NULL,
      sets INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      weight REAL NOT NULL,
      FOREIGN KEY (routineId) REFERENCES routines(id),
      FOREIGN KEY (exerciseId) REFERENCES exercises(id)
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workout (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      startDateTime TEXT NOT NULL,
      endDateTime TEXT NOT NULL,
      notes TEXT
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workout_exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workoutId INTEGER NOT NULL,
      exerciseId INTEGER NOT NULL,
      sets INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      weight REAL NOT NULL,
      FOREIGN KEY (workoutId) REFERENCES workout(id),
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

  // Insert premade routines if empty
  const [{ count: wCount }] = await db.getAllAsync(
    'SELECT COUNT(*) as count FROM routines;'
  );

  if (wCount === 0) {
    for (const routine of preMadeRoutines) {
      await db.runAsync('INSERT INTO routines (id, name) VALUES (?, ?);', [
        routine.routineId,
        routine.name,
      ]);

      for (const ex of routine.exercises) {
        await db.runAsync(
          'INSERT INTO routine_exercises (routineId, exerciseId, sets, reps, weight) VALUES (?, ?, ?, ?, ?);',
          [routine.routineId, ex.exerciseId, ex.sets, ex.reps, ex.weight]
        );
      }
    }
  }

  console.log('Database setup complete');

  // ↓ Only for Workout History Testing before we have the add/edit history page ↓
  const [{ count }] = await db.getAllAsync('SELECT COUNT(*) as count FROM workout;');

  if (count === 0) {
    for (const workout of workoutHistorySample) {
      // Insert workout session
      const result = await db.runAsync(
        `INSERT INTO workout (startDateTime, endDateTime, notes) VALUES (?, ?, ?);`,
        [workout.startDateTime, workout.endDateTime, workout.notes || '']
      );
      const workoutId = result.lastInsertRowId;

      // Insert exercises
      for (const ex of workout.exercises) {
        await db.runAsync(
          `INSERT INTO workout_exercises (workoutId, exerciseId, sets, reps, weight) VALUES (?, ?, ?, ?, ?);`,
          [workoutId, ex.exerciseId, ex.sets, ex.reps, ex.weight]
        );
      }
    }

    console.log('Workout history seeded successfully!');
  } else {
    console.log('Workout history already exists in DB.');
  }
  // ↑ Only for Workout History Testing before we have the add/edit history page ↑
}
