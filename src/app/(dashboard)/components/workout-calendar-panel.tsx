import { WorkoutHistoryCalendar } from "./workout-history-calendar";

export function WorkoutCalendarPanel({ workoutDates }: { workoutDates: string[] }) {
    return (
        <aside className="h-fit rounded-lg border border-border bg-card p-4">
            <h2 className="mb-3 text-lg font-semibold text-card-foreground">This month</h2>
            <WorkoutHistoryCalendar workoutDates={workoutDates} />
        </aside>
    );
}
