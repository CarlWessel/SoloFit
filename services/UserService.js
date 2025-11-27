import { DatabaseManager } from '../utils/DatabaseManager';

export default class UserService {

  // Fetch user profile
  static async getUserProfile() {
      const db = await DatabaseManager.getDB();
      const result = await db.getFirstAsync('SELECT * FROM user_profile');
      return result || null;
  }

  // Create a new user profile 
  static async createUserProfile(name, age, gender) {
  const db = await DatabaseManager.getDB();

  const result = await db.runAsync(
      'INSERT INTO user_profile (name, age, gender) VALUES (?, ?, ?);',
      [name, age, gender]
  );

  return result.lastInsertRowId;
  }


  // Update existing profile (partial updates supported)
  static async updateUserProfile({ name, age, gender }) {
    const db = await DatabaseManager.getDB();

    // Build dynamic query to only update fields provided
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (age !== undefined) {
      updates.push('age = ?');
      values.push(age);
    }
    if (gender !== undefined) {
      updates.push('gender = ?');
      values.push(gender);
    }

    if (updates.length === 0) {
      throw new Error('No fields provided for update.');
    }

    const query = `
      UPDATE user_profile
      SET ${updates.join(', ')}
      WHERE id = 1;
    `;

    await db.runAsync(query, values);
  }
}
