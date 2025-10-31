import { openDatabaseAsync } from 'expo-sqlite';

let db = null;

async function getDatabase() {
  if (!db) {
    db = await openDatabaseAsync('workout.db');
  }
  return db;
}

export default class WorkoutService {
  // Initialize database connection
  static async getDB() {
    return await getDatabase();
  }

  // ============ EXERCISES ============
  static async getAllExercises() {
    const db = await this.getDB();
    return await db.getAllAsync('SELECT * FROM exercises;');
  }

  static async addExercise(name) {
    const db = await this.getDB();
    const result = await db.runAsync(
      'INSERT INTO exercises (name) VALUES (?);',
      [name]
    );
    return result.lastInsertRowId;
  }

  // ============ ROUTINES ============
  static async addRoutine({ name, exercises = [] }) {
    const db = await this.getDB();
    
    // Insert routine (let AUTOINCREMENT handle the ID)
    const result = await db.runAsync(
      'INSERT INTO routines (name) VALUES (?);',
      [name]
    );
    
    const routineId = result.lastInsertRowId;
    // Insert exercises for this routine
    for (const ex of exercises) {
      await db.runAsync(
        'INSERT INTO routine_exercises (routineId, exerciseId, sets, reps, weight) VALUES (?, ?, ?, ?, ?);',
        [routineId, ex.exerciseId, ex.sets, ex.reps, ex.weight]
      );
    }
    return routineId;
  }

  static async getAllRoutines() {
    const db = await this.getDB();
    const routines = await db.getAllAsync('SELECT * FROM routines;');
    
    for (const routine of routines) {
      routine.exercises = await db.getAllAsync(
        `SELECT e.id, e.name, we.sets, we.reps, we.weight
         FROM routine_exercises we
         JOIN exercises e ON e.id = we.exerciseId
         WHERE we.routineId = ?;`,
        [routine.id]
      );
    }
    
    return routines;
  }

  static async getUserRoutines() {
    const db = await this.getDB();
    // User routines have ID > 5 (premade are 1-5)
    const routines = await db.getAllAsync(
      'SELECT * FROM routines WHERE id > 5 ORDER BY id DESC;'
    );
    
    for (const routine of routines) {
      routine.exercises = await db.getAllAsync(
        `SELECT e.id, e.name, we.sets, we.reps, we.weight
         FROM routine_exercises we
         JOIN exercises e ON e.id = we.exerciseId
         WHERE we.routineId = ?;`,
        [routine.id]
      );
    }
    
    return routines;
  }

  static async getRoutineById(routineId) {
    const db = await this.getDB();
    const [routine] = await db.getAllAsync(
      'SELECT * FROM routines WHERE id = ?;',
      [routineId]
    );
    
    if (routine) {
      routine.exercises = await db.getAllAsync(
        `SELECT e.id, e.name, we.sets, we.reps, we.weight
         FROM routine_exercises we
         JOIN exercises e ON e.id = we.exerciseId
         WHERE we.routineId = ?;`,
        [routineId]
      );
    }
    
    return routine;
  }

  static async deleteRoutine(id) {
    const db = await this.getDB();
    await db.runAsync('DELETE FROM routine_exercises WHERE routineId = ?;', [id]);
    await db.runAsync('DELETE FROM routines WHERE id = ?;', [id]);
  }

  // ============ Premade Workouts ============
  static async getPremadeWorkouts() {
    const db = await this.getDB();
    // Premade workouts have IDs 1-5
    const premades = await db.getAllAsync(
      'SELECT * FROM routines WHERE id <= 5;'
    );
    
    for (const premade of premades) {
      premade.exercises = await db.getAllAsync(
        `SELECT e.id, e.name, we.sets, we.reps, we.weight
         FROM routine_exercises we
         JOIN exercises e ON e.id = we.exerciseId
         WHERE we.routineId = ?;`,
        [premade.id]
      );
    }
    
    return premades;
  }

  // ============ WORKOUT HISTORY ============
  static async addWorkoutHistory({ name, date, exercises = [] }) {
    const db = await this.getDB();
    
    const result = await db.runAsync(
      'INSERT INTO workout_history (name, date) VALUES (?, ?);',
      [name, date]
    );
    
    const workoutId = result.lastInsertRowId;
    // Insert exercises for this workout
    for (const ex of exercises) {
      await db.runAsync(
        'INSERT INTO workout_history_exercises (workoutId, exerciseId, sets, reps, weight) VALUES (?, ?, ?, ?, ?);',
        [workoutId, ex.exerciseId, ex.sets, ex.reps, ex.weight]
      );
    }
    return workoutId;
  }

  static async getWorkoutHistory() {
    const db = await this.getDB();
    const workouts = await db.getAllAsync(
      'SELECT * FROM workout_history ORDER BY datetime(date) DESC;'
    );
    
    for (const workout of workouts) {
      workout.exercises = await db.getAllAsync(
        `SELECT e.name, wh.sets, wh.reps, wh.weight
         FROM workout_history_exercises wh
         JOIN exercises e ON e.id = wh.exerciseId
         WHERE wh.workoutId = ?;`,
        [workout.id]
      );
    }
    
    return workouts;
  }

  static async deleteWorkoutHistory(id) {
    const db = await this.getDB();
    await db.runAsync('DELETE FROM workout_history_exercises WHERE workoutId = ?;', [id]);
    await db.runAsync('DELETE FROM workout_history WHERE id = ?;', [id]);
  }
}