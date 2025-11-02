import { openDatabaseAsync } from 'expo-sqlite';

export const DatabaseManager = {
  db: null,

  async getDB() {
    if (!this.db) {
      this.db = await openDatabaseAsync('workout.db');
    }
    return this.db;
  },

  async close() {
    if (this.db) {
      try {
        await this.db.closeAsync();
      } catch (err) {
        console.error('Error closing DB:', err);
      } finally {
        this.db = null;
      }
    }
  }
};