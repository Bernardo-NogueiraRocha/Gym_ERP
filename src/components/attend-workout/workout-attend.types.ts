import type { WorkoutItems, ExerciseOption } from "@/lib/types";

export type MuscleStimulus = {
    slug: string;
    stimulusStrength: number;
};

export type ActiveSet = {
    setNumber: number;
    targetReps: number | null;
    actualReps: string;
    actualWeight: string;
    completed: boolean;
};

export type ActiveExercise = {
    exerciseId: string;
    exerciseName: string;
    restSeconds: number | null;
    muscles: MuscleStimulus[];
    sets: ActiveSet[];
};

export function buildInitialExercises(items: WorkoutItems): ActiveExercise[] {
    return items.map((item) => ({
        exerciseId: item.exerciseId,
        exerciseName: item.exerciseName,
        restSeconds: item.restSeconds,
        muscles: item.muscles,
        sets: Array.from({ length: item.sets ?? 1 }, (_, index) => ({
            setNumber: index + 1,
            targetReps: item.reps,
            actualReps: item.reps != null ? String(item.reps) : "",
            actualWeight: "",
            completed: false,
        })),
    }));
}

export function createActiveExercise(exercise: ExerciseOption): ActiveExercise {
    return {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        restSeconds: null,
        muscles: [],
        sets: Array.from({ length: 3 }, (_, index) => ({
            setNumber: index + 1,
            targetReps: null,
            actualReps: "",
            actualWeight: "",
            completed: false,
        })),
    };
}
