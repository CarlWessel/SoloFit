import { DatabaseManager } from './DatabaseManager';
import exercises from '../data/exercises.json';
import preMadeRoutines from '../data/PreMadeRoutines.json';

export async function DBSetup() {
  // Initialize database (this also creates tables)
  const db = await DatabaseManager.initialize();
  
  console.log('Seeding initial data...');
  
  // Insert exercises if table empty
  const [{ count: exCount }] = await db.getAllAsync('SELECT COUNT(*) as count FROM exercises;');
  if (exCount === 0) {
    console.log('Inserting exercises...');
    for (const ex of exercises) {
      await db.runAsync('INSERT INTO exercises (id, name) VALUES (?, ?);', [ex.id, ex.name]);
    }
    console.log(`Inserted ${exercises.length} exercises`);
  }

  // Insert premade routines if empty
  const [{ count: rCount }] = await db.getAllAsync('SELECT COUNT(*) as count FROM routines;');
  if (rCount === 0) {
    console.log('Inserting premade routines...');
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
    console.log(`Inserted ${preMadeRoutines.length} premade routines`);
  }

  console.log('Database setup complete');
}
