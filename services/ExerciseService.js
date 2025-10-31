 import { DatabaseManager } from '../utils/DatabaseManager';

export default class ExerciseService {
  static async getAllExercises() {
    const db = await DatabaseManager.getDB();
    return await db.getAllAsync('SELECT * FROM exercises;');
  }

  static async addExercise(name) {
    const db = await DatabaseManager.getDB();
    const result = await db.runAsync(
      'INSERT INTO exercises (name) VALUES (?);',
      [name]
    );
    return result.lastInsertRowId;
  }
}