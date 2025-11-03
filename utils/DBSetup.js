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
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      routineId INTEGER NOT NULL,
      exerciseId INTEGER NOT NULL,
      FOREIGN KEY (routineId) REFERENCES routines(id),
      FOREIGN KEY (exerciseId) REFERENCES exercises(id)
    );
  `);

  // Create routine_exercises_sets table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS routine_exercise_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      routineExerciseId INTEGER NOT NULL,
      setNumber INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      weight REAL NOT NULL,
      FOREIGN KEY (routineExerciseId) REFERENCES routine_exercises(id)
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
      FOREIGN KEY (workoutId) REFERENCES workout(id),
      FOREIGN KEY (exerciseId) REFERENCES exercises(id)
    );
  `);

    // Create workout_exercises_sets table
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workout_exercises_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workoutExerciseId INTEGER NOT NULL,
      setNumber INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      weight REAL NOT NULL,
      FOREIGN KEY (workoutExerciseId) REFERENCES workout_exercises(id)
    );
  `);

  // Insert exercises if table empty
  const [{ count: exCount }] = await db.getAllAsync('SELECT COUNT(*) as count FROM exercises;');
  if (exCount === 0) {
    for (const ex of exercises) {
      await db.runAsync('INSERT INTO exercises (id, name) VALUES (?, ?);', [ex.id, ex.name]);
    }
  }

  // Insert premade routines if empty
  const [{ count: rCount }] = await db.getAllAsync('SELECT COUNT(*) as count FROM routines;');
  if (rCount === 0) {
    for (const routine of preMadeRoutines) {
      const result = await db.runAsync(
        'INSERT INTO routines (name, isPremade) VALUES (?, 1);',
        [routine.name]
      );
      const routineId = result.lastInsertRowId;

      for (const ex of routine.exercises) {
        // Insert the exercise mapping
        const exResult = await db.runAsync(
          'INSERT INTO routine_exercises (routineId, exerciseId) VALUES (?, ?);',
          [routineId, ex.exerciseId]
        );
        const routineExerciseId = exResult.lastInsertRowId;

        // Insert each set with setNumber
        let setNumber = 1;
        for (const set of ex.Sets) {
          await db.runAsync(
            'INSERT INTO routine_exercise_sets (routineExerciseId, setNumber, reps, weight) VALUES (?, ?, ?, ?);',
            [routineExerciseId, setNumber, set.reps, set.weight]
          );
          setNumber++;
        }
      }
    }
  }

  console.log('Database setup complete');
}