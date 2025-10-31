import { openDatabaseAsync } from 'expo-sqlite';

export default class WorkoutService {

  static async addWorkout({ startDateTime, endDateTime, notes = '', exercises = [] }) {
    const db = await openDatabaseAsync('workout.db');

    const result = await db.runAsync(
      `INSERT INTO workout (startDateTime, endDateTime, notes) VALUES (?, ?, ?);`,
      [startDateTime, endDateTime, notes]
    );
    const workoutId = result.lastInsertRowId;

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
    const workouts = await db.getAllAsync(`SELECT * FROM workout ORDER BY datetime(startDateTime) DESC;`);
    
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