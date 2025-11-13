import { openDatabaseAsync } from 'expo-sqlite';

export const DatabaseManager = {
  db: null,
  initPromise: null,
  isInitialized: false,
  
  async initialize() {
    // If already initializing, return existing promise
    if (this.initPromise) {
      return this.initPromise;
    }
    
    // If already initialized, return immediately
    if (this.isInitialized && this.db) {
      return this.db;
    }
    
    // Start initialization
    this.initPromise = this._performInitialization();
    
    try {
      await this.initPromise;
      this.isInitialized = true;
      return this.db;
    } catch (error) {
      console.error('Database initialization failed:', error);
      this.initPromise = null;
      throw error;
    }
  },
  
  async _performInitialization() {
    try {
      console.log('Opening database...');
      this.db = await openDatabaseAsync('workout.db');
      console.log('Database opened successfully');
      
      // Run DBSetup here
      await this._setupTables();
      
      return this.db;
    } catch (error) {
      console.error('Error in _performInitialization:', error);
      this.db = null;
      throw error;
    }
  },
  
  async _setupTables() {
    // Move your DBSetup logic here
    const db = this.db;
    
    // Create exercises tables
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL
      );
    `);
    
    // Create routines table with isPremade flag
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS routines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        isPremade INTEGER NOT NULL DEFAULT 0
      );
    `);
    
    // Create routine_exercises table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS routine_exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        routineId INTEGER NOT NULL,
        exerciseId INTEGER NOT NULL,
        FOREIGN KEY (routineId) REFERENCES routines(id),
        FOREIGN KEY (exerciseId) REFERENCES exercises(id)
      );
    `);
    
    // Create routine_exercises_sets table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS routine_exercise_sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        routineExerciseId INTEGER NOT NULL,
        setNumber INTEGER NOT NULL,
        reps INTEGER NOT NULL,
        weight REAL NOT NULL,
        FOREIGN KEY (routineExerciseId) REFERENCES routine_exercises(id)
      );
    `);
    
    // Create workout table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS workout (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        startDateTime TEXT NOT NULL,
        endDateTime TEXT NOT NULL,
        notes TEXT
      );
    `);
    
    // Create workout_exercises table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS workout_exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workoutId INTEGER NOT NULL,
        exerciseId INTEGER NOT NULL,
        FOREIGN KEY (workoutId) REFERENCES workout(id),
        FOREIGN KEY (exerciseId) REFERENCES exercises(id)
      );
    `);
    
    // Create workout_exercises_sets table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS workout_exercises_sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workoutExerciseId INTEGER NOT NULL,
        setNumber INTEGER NOT NULL,
        reps INTEGER NOT NULL,
        weight REAL NOT NULL,
        FOREIGN KEY (workoutExerciseId) REFERENCES workout_exercises(id)
      );
    `);
    
    console.log('Tables created successfully');
  },
  
  async getDB() {
    // Always ensure initialization before returning DB
    if (!this.isInitialized || !this.db) {
      await this.initialize();
    }
    
    // Validate connection is still alive
    try {
      await this.db.getFirstAsync('SELECT 1');
      return this.db;
    } catch (e) {
      console.warn('Database connection lost, reinitializing...');
      this.db = null;
      this.isInitialized = false;
      this.initPromise = null;
      return await this.initialize();
    }
  },

  async close() {
    if (this.db) {
      try {
        await this.db.closeAsync();
      } catch (err) {
        console.error('Error closing DB:', err);
      } finally {
        this.db = null;
        this.isInitialized = false;
        this.initPromise = null;
      }
    }
  }
};