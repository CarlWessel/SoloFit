 import { DatabaseManager } from '../utils/DatabaseManager';

export default class RoutineService {

  // ============ ROUTINES ============
  static async addRoutine({ name, exercises = [] }) {
    const db = await DatabaseManager.getDB();
    
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
    const db = await DatabaseManager.getDB();
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
    const db = await DatabaseManager.getDB();
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
    const db = await DatabaseManager.getDB();
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
    const db = await DatabaseManager.getDB();
    await db.runAsync('DELETE FROM routine_exercises WHERE routineId = ?;', [id]);
    await db.runAsync('DELETE FROM routines WHERE id = ?;', [id]);
  }

  // ============ Premade Routine ============
  static async getPremadeRoutines() {
    const db = await DatabaseManager.getDB();
    // Premade routines have IDs 1-5
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
}