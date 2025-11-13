import { DatabaseManager } from '../utils/DatabaseManager';

export default class RoutineService {

  // ============ ROUTINES ============
  static async addRoutine({ name, exercises = [] }) {
    const db = await DatabaseManager.getDB();

    // Insert routine (isPremade defaults to 0 for user routines)
    const result = await db.runAsync(
      'INSERT INTO routines (name, isPremade) VALUES (?, 0);',
      [name]
    );

    const routineId = result.lastInsertRowId;

    // Insert exercises and their sets
    for (const ex of exercises) {
      // Insert into routine_exercises
      const exerciseResult = await db.runAsync(
        'INSERT INTO routine_exercises (routineId, exerciseId) VALUES (?, ?);',
        [routineId, ex.exerciseId]
      );

      const routineExerciseId = exerciseResult.lastInsertRowId;

      // Insert all sets for this exercise
      if (ex.sets && Array.isArray(ex.sets)) {
        for (const set of ex.sets) {
          await db.runAsync(
            `INSERT INTO routine_exercise_sets (routineExerciseId, setNumber, reps, weight)
             VALUES (?, ?, ?, ?);`,
            [routineExerciseId, set.setNumber, set.reps, set.weight]
          );
        }
      }
    }

    return routineId;
  }

  static async getAllRoutines() {
    const db = await DatabaseManager.getDB();
    const routines = await db.getAllAsync('SELECT * FROM routines;');

    for (const routine of routines) {
      routine.exercises = await this._getExercisesWithSets(db, routine.id);
    }

    return routines;
  }

  static async getUserRoutines() {
    const db = await DatabaseManager.getDB();
    const routines = await db.getAllAsync(
      'SELECT * FROM routines WHERE isPremade = 0 ORDER BY id DESC;'
    );

    for (const routine of routines) {
      routine.exercises = await this._getExercisesWithSets(db, routine.id);
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
      routine.exercises = await this._getExercisesWithSets(db, routineId);
    }

    return routine;
  }

  static async deleteRoutine(id) {
    const db = await DatabaseManager.getDB();

    const [routine] = await db.getAllAsync(
      'SELECT isPremade FROM routines WHERE id = ?;',
      [id]
    );

    if (routine && routine.isPremade === 1) {
      throw new Error('Cannot delete premade routines');
    }

    // Get exercise IDs before deleting (to cascade delete sets)
    const exercises = await db.getAllAsync(
      'SELECT id FROM routine_exercises WHERE routineId = ?;',
      [id]
    );

    for (const ex of exercises) {
      await db.runAsync('DELETE FROM routine_exercise_sets WHERE routineExerciseId = ?;', [ex.id]);
    }

    await db.runAsync('DELETE FROM routine_exercises WHERE routineId = ?;', [id]);
    await db.runAsync('DELETE FROM routines WHERE id = ?;', [id]);
  }

  // ============ PREMADE ROUTINES ============

  static async getPremadeRoutines() {
    const db = await DatabaseManager.getDB();
    const premades = await db.getAllAsync(
      'SELECT * FROM routines WHERE isPremade = 1;'
    );

    for (const premade of premades) {
      premade.exercises = await this._getExercisesWithSets(db, premade.id);
    }

    return premades;
  }

  // ============ HELPER ============

  static async _getExercisesWithSets(db, routineId) {
    const exercises = await db.getAllAsync(
      `SELECT re.id as routineExerciseId, e.id as exerciseId, e.name
       FROM routine_exercises re
       JOIN exercises e ON e.id = re.exerciseId
       WHERE re.routineId = ?;`,
      [routineId]
    );

    for (const ex of exercises) {
      ex.sets = await db.getAllAsync(
        `SELECT setNumber, reps, weight
         FROM routine_exercise_sets
         WHERE routineExerciseId = ?
         ORDER BY setNumber ASC;`,
        [ex.routineExerciseId]
      );
    }

    return exercises;
  }
}