import { pgTable, text, uuid, real, primaryKey } from "drizzle-orm/pg-core";
import { exercises } from ".";

// Muscles Table
export const muscles = pgTable("muscles", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(), // e.g., "Pectoralis Major"
    slug: text("slug").notNull().unique(), // e.g., "chest" (matches the library's expected ID)
    bodyGroup: text("body_group"), // e.g., "Upper Body"
});


// Junction Table: Which exercises hit which muscles and how hard they are stimulated
export const exerciseMuscles = pgTable("exercise_muscles", {
    exerciseId: uuid("exercise_id")
        .notNull()
        .references(() => exercises.id, { onDelete: "cascade" }),
    muscleId: uuid("muscle_id")
        .notNull()
        .references(() => muscles.id, { onDelete: "cascade" }),
    stimulusStrength: real("stimulus_strength").notNull(), // e.g., 1.0 (primary), 0.5 (secondary)
},
    (table) => [
        primaryKey({
            columns: [table.exerciseId, table.muscleId],
        }),
    ],);