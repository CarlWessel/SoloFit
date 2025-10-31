import { openDatabaseAsync } from 'expo-sqlite';
import exercises from '../data/exercises.json';
import preMadeRoutines from '../data/PreMadeRoutines.json';

export async function DBSetup() {
  const db = await openDatabaseAsync('workout.db');

  // Create exercises tables
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );
  `);

  // Create routines table (AUTOINCREMENT for user routines)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS routines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
  `);

  // Create routine_exercises table
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

  // Create workout_history table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workout_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL
    );
  `);

  // Create workout_history_exercises table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workout_history_exercises (
      workoutId INTEGER NOT NULL,
      exerciseId INTEGER NOT NULL,
      sets INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      weight REAL NOT NULL,
      FOREIGN KEY (workoutId) REFERENCES workout_history(id),
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

  // Insert premade routines if empty (without explicit IDs - let AUTOINCREMENT handle it)
  const [{ count: wCount }] = await db.getAllAsync(
    'SELECT COUNT(*) as count FROM routines;'
  );

  if (wCount === 0) {
    // Sort by routineId
    const sortedRoutines = [...preMadeRoutines].sort((a, b) => a.routineId - b.routineId);
    
    for (const routine of sortedRoutines) {
      // Insert without specifying ID - AUTOINCREMENT will handle it
      const result = await db.runAsync(
        'INSERT INTO routines (name) VALUES (?);',
        [routine.name]
      );
      
      const insertedId = result.lastInsertRowId;
      
      for (const ex of routine.exercises) {
        await db.runAsync(
          'INSERT INTO routine_exercises (routineId, exerciseId, sets, reps, weight) VALUES (?, ?, ?, ?, ?);',
          [insertedId, ex.exerciseId, ex.sets, ex.reps, ex.weight]
        );
      }
    }
  }

  console.log('Database setup complete');
}
