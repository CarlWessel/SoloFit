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

  static async editExercise(id, newName) {
    const db = await DatabaseManager.getDB();
    await db.runAsync(
      'UPDATE exercises SET name = ? WHERE id = ?;',
      [newName, id]
    );
  }

  static async deleteExercise(id) {
    const db = await DatabaseManager.getDB();
    const result = await db.runAsync(
      'DELETE FROM exercises WHERE id = ?;',
      [id]
    );

  return result.changes > 0; 
}
}