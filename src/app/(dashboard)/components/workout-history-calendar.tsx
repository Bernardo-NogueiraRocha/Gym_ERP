"use client";

import { Calendar } from "@/components/ui/calendar";

export function WorkoutHistoryCalendar({ workoutDates }: { workoutDates: string[] }) {
    const workoutDays = workoutDates.map((value) => {
        const [year, month, day] = value.split("-").map(Number);
        return new Date(year, month - 1, day);
    });

    return (
        <div>
            <Calendar
                mode="single"
                modifiers={{ workout: workoutDays }}
                modifiersClassNames={{ workout: "bg-primary text-primary-foreground font-semibold rounded-md" }}
                className="mx-auto w-full"
            />
            <p className="mt-2 text-center text-sm text-muted-foreground">
                <span className="mr-2 inline-block size-2 rounded-full bg-primary" aria-hidden="true" />
                Workout completed
            </p>
        </div>
    );
}
