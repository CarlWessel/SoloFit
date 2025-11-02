import { DatabaseManager } from '../utils/DatabaseManager';

export default class WorkoutService {

  static async addWorkout({ startDateTime, endDateTime, exercises = [], notes = '' }) {
    const db = await DatabaseManager.getDB();

    const result = await db.runAsync(
      `INSERT INTO workout (startDateTime, endDateTime, notes) VALUES (?, ?, ?);`,
      [startDateTime, endDateTime, notes]
    );
    const workoutId = result.lastInsertRowId;

    for (const ex of exercises) {
      await db.runAsync(
        `INSERT INTO workout_exercises (workoutId, exerciseId, sets, reps, weight) VALUES (?, ?, ?, ?, ?);`,
        [workoutId, ex.exerciseId, ex.sets, ex.reps, ex.weight]
      );
    }

    return workoutId;
  }

  static async getWorkoutHistory() {
    const db = await DatabaseManager.getDB();

    const workouts = await db.getAllAsync(`SELECT * FROM workout ORDER BY datetime(startDateTime) DESC;`);

    for (const w of workouts) {
      w.exercises = await db.getAllAsync(
        `SELECT e.name, we.sets, we.reps, we.weight
         FROM workout_exercises we
         JOIN exercises e ON e.id = we.exerciseId
         WHERE we.workoutId = ?;`,
        [w.id]
      );
    }

    return workouts;
  }

  static async editWorkout(workoutId, { startDateTime, endDateTime, notes = '', exercises = [] }) {
    const db = await DatabaseManager.getDB();

    // Update workout details
    await db.runAsync(
      `UPDATE workout SET startDateTime = ?, endDateTime = ?, notes = ? WHERE id = ?;`,
      [startDateTime, endDateTime, notes, workoutId]
    );

    // Delete old exercises
    await db.runAsync(`DELETE FROM workout_exercises WHERE workoutId = ?;`, [workoutId]);

    // Insert updated exercises
    for (const ex of exercises) {
      await db.runAsync(
        `INSERT INTO workout_exercises (workoutId, exerciseId, sets, reps, weight) VALUES (?, ?, ?, ?, ?);`,
        [workoutId, ex.exerciseId, ex.sets, ex.reps, ex.weight]
      );
    }
  }

  static async deleteWorkout(id) {
    const db = await DatabaseManager.getDB();
    await db.runAsync(`DELETE FROM workout_exercises WHERE workoutId = ?;`, [id]);
    await db.runAsync(`DELETE FROM workout WHERE id = ?;`, [id]);
  }
}