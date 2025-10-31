import { DatabaseManager } from './DatabaseManager';
import exercises from '../data/exercises.json';
import preMadeRoutines from '../data/PreMadeRoutines.json';

export async function DBSetup() {
  const db = await DatabaseManager.getDB();

  // Create exercises tables
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );
  `);
  
  // Create routines table with isPremade flag
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS routines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      isPremade INTEGER NOT NULL DEFAULT 0
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

  // Create workout table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workout (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      startDateTime TEXT NOT NULL,
      endDateTime TEXT NOT NULL,
      notes TEXT
    );
  `);

  // Create workout_exercises table
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
      // Insert the routine with isPremade = 1
      const result = await db.runAsync(
        'INSERT INTO routines (name, isPremade) VALUES (?, 1);',
        [routine.name]
      );
      
      // Use the lastInsertRowId (the actual ID assigned by SQLite)
      const actualRoutineId = result.lastInsertRowId;
      
      // Now insert exercises using the ACTUAL routine ID
      for (const ex of routine.exercises) {
        await db.runAsync(
          'INSERT INTO routine_exercises (routineId, exerciseId, sets, reps, weight) VALUES (?, ?, ?, ?, ?);',
          [actualRoutineId, ex.exerciseId, ex.sets, ex.reps, ex.weight]
        );
      }
    }
  }

  console.log('Database setup complete');
}
