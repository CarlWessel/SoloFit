import { DatabaseManager } from '../utils/DatabaseManager';

export default class WorkoutService {

  static async addWorkout({ startDateTime, endDateTime, exercises = [], notes = '' }) {
    const db = await DatabaseManager.getDB();

    // Insert workout
    const result = await db.runAsync(
      `INSERT INTO workout (startDateTime, endDateTime, notes) VALUES (?, ?, ?);`,
      [startDateTime, endDateTime, notes]
    );
    const workoutId = result.lastInsertRowId;

    // Insert each exercise
    for (const ex of exercises) {
      const exerciseResult = await db.runAsync(
        `INSERT INTO workout_exercises (workoutId, exerciseId)
         VALUES (?, ?);`,
        [workoutId, ex.exerciseId]
      );
      const workoutExerciseId = exerciseResult.lastInsertRowId;

      // Insert each set for this exercise
      for (const set of ex.sets) {
        await db.runAsync(
          `INSERT INTO workout_exercises_sets (workoutExerciseId, setNumber, reps, weight)
            VALUES (?, ?, ?, ?);`,
          [workoutExerciseId, set.setNumber, set.reps, set.weight]
        );
      }
    }

    return workoutId;
  }

  static async getWorkoutHistory() {
    const db = await DatabaseManager.getDB();

    const workouts = await db.getAllAsync(`
      SELECT * FROM workout
      ORDER BY datetime(startDateTime) DESC;
    `);

    for (const w of workouts) {
      // Get all exercises for this workout
      const exercises = await db.getAllAsync(
        `SELECT we.id AS workoutExerciseId, e.name, e.id AS exerciseId
         FROM workout_exercises we
         JOIN exercises e ON e.id = we.exerciseId
         WHERE we.workoutId = ?;`,
        [w.id]
      );

      // For each exercise, get its sets
      for (const ex of exercises) {
        ex.sets = await db.getAllAsync(
          `SELECT setNumber, reps, weight
           FROM workout_exercises_sets
           WHERE workoutExerciseId = ?
           ORDER BY setNumber ASC;`,
          [ex.workoutExerciseId]
        );
      }

      w.exercises = exercises;
    }

    return workouts;
  }

  static async editWorkout(workoutId, { startDateTime, endDateTime, notes = '', exercises = [] }) {
    const db = await DatabaseManager.getDB();

    // Update workout info
    await db.runAsync(
      `UPDATE workout SET startDateTime = ?, endDateTime = ?, notes = ? WHERE id = ?;`,
      [startDateTime, endDateTime, notes, workoutId]
    );

    // Delete all linked exercises and sets
    const oldExercises = await db.getAllAsync(
      `SELECT id FROM workout_exercises WHERE workoutId = ?;`,
      [workoutId]
    );
    for (const oldEx of oldExercises) {
      await db.runAsync(`DELETE FROM workout_exercises_sets WHERE workoutExerciseId = ?;`, [oldEx.id]);
    }
    await db.runAsync(`DELETE FROM workout_exercises WHERE workoutId = ?;`, [workoutId]);

    // Insert new ones
    for (const ex of exercises) {
      const exerciseResult = await db.runAsync(
        `INSERT INTO workout_exercises (workoutId, exerciseId)
         VALUES (?, ?);`,
        [workoutId, ex.exerciseId]
      );
      const workoutExerciseId = exerciseResult.lastInsertRowId;

      if (Array.isArray(ex.sets)) {
        for (const set of ex.sets) {
          await db.runAsync(
            `INSERT INTO workout_exercises_sets (workoutExerciseId, setNumber, reps, weight)
             VALUES (?, ?, ?, ?);`,
            [workoutExerciseId, set.setNumber, set.reps, set.weight]
          );
        }
      }
    }
  }

  /**
   * Delete workout and all linked data
   */
  static async deleteWorkout(id) {
    const db = await DatabaseManager.getDB();

    const workoutExercises = await db.getAllAsync(
      `SELECT id FROM workout_exercises WHERE workoutId = ?;`,
      [id]
    );

    for (const we of workoutExercises) {
      await db.runAsync(`DELETE FROM workout_exercises_sets WHERE workoutExerciseId = ?;`, [we.id]);
    }

    await db.runAsync(`DELETE FROM workout_exercises WHERE workoutId = ?;`, [id]);
    await db.runAsync(`DELETE FROM workout WHERE id = ?;`, [id]);
  }
}