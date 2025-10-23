import { openDatabaseAsync } from "expo-sqlite";
import exercises from "../data/exercises.json";
import preMadeWorkouts from "../data/premadeworkouts.json";

export async function DBSetup() {
  const db = await openDatabaseAsync("workout.db");

  // --- CREATE TABLES ---
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workout_exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workoutId INTEGER NOT NULL,
      exerciseId INTEGER NOT NULL,
      FOREIGN KEY (workoutId) REFERENCES workouts(id),
      FOREIGN KEY (exerciseId) REFERENCES exercises(id)
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workout_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workoutExerciseId INTEGER NOT NULL,
      setNumber INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      weight REAL NOT NULL,
      FOREIGN KEY (workoutExerciseId) REFERENCES workout_exercises(id)
    );
  `);

  console.log("✅ Tables created or verified");

  // --- INSERT EXERCISES ---
  const [{ count: exCount }] = await db.getAllAsync(
    "SELECT COUNT(*) as count FROM exercises;"
  );

  if (exCount === 0) {
    console.log("🗂 Inserting exercises...");
    for (const ex of exercises) {
      await db.runAsync("INSERT INTO exercises (id, name) VALUES (?, ?);", [
        ex.id,
        ex.name,
      ]);
    }
    console.log("✅ Exercises inserted");
  } else {
    console.log("⚠️ Exercises already exist, skipping insert");
  }

  // --- INSERT WORKOUTS, EXERCISES, AND SETS ---
  const [{ count: wCount }] = await db.getAllAsync(
    "SELECT COUNT(*) as count FROM workouts;"
  );

  if (wCount === 0) {
    console.log("🗂 Inserting pre-made workouts...");
    for (const workout of preMadeWorkouts) {
      // Insert the workout
      await db.runAsync("INSERT INTO workouts (id, name) VALUES (?, ?);", [
        workout.workoutId,
        workout.name,
      ]);

      // Insert each exercise in the workout
      for (const ex of workout.exercises) {
        // Insert the workout-exercise link
        const result = await db.runAsync(
          "INSERT INTO workout_exercises (workoutId, exerciseId) VALUES (?, ?);",
          [workout.workoutId, ex.exerciseId]
        );

        const workoutExerciseId = result.lastInsertRowId;

        // Handle the nested Sets array
        if (Array.isArray(ex.Sets) && ex.Sets.length > 0) {
          for (let i = 0; i < ex.Sets.length; i++) {
            const set = ex.Sets[i];
            await db.runAsync(
              "INSERT INTO workout_sets (workoutExerciseId, setNumber, reps, weight) VALUES (?, ?, ?, ?);",
              [workoutExerciseId, i + 1, set.reps, set.weight]
            );
          }
        } else {
          // Default to 1 empty set if none provided
          await db.runAsync(
            "INSERT INTO workout_sets (workoutExerciseId, setNumber, reps, weight) VALUES (?, ?, ?, ?);",
            [workoutExerciseId, 1, 0, 0]
          );
        }
      }
    }
    console.log("✅ Pre-made workouts inserted");
  } else {
    console.log("⚠️ Workouts already exist, skipping insert");
  }

  console.log("🎉 Database setup complete!");
}
