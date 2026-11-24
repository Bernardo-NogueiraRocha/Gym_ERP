"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/register-workout/date-picker";

interface WorkoutSessionOverviewProps {
    workoutDate: Date | undefined;
    onWorkoutDateChange: (date: Date) => void;
    elapsedSeconds: number;
    isTimerPaused: boolean;
    onTimerPauseToggle: () => void;
    onDurationSet: (minutes: number) => void;
    completedSets: number;
    totalSets: number;
}

function formatDuration(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
        .map((part) => String(part).padStart(2, "0"))
        .join(":");
}

export function WorkoutSessionOverview({
    workoutDate,
    onWorkoutDateChange,
    elapsedSeconds,
    isTimerPaused,
    onTimerPauseToggle,
    onDurationSet,
    completedSets,
    totalSets,
}: WorkoutSessionOverviewProps) {
    const [manualDurationMinutes, setManualDurationMinutes] = useState("");
    const durationMinutes = Number(manualDurationMinutes);
    const canSetDuration = manualDurationMinutes.trim() !== ""
        && Number.isFinite(durationMinutes)
        && Number.isInteger(durationMinutes)
        && durationMinutes >= 0;
    const progressPercentage = totalSets > 0
        ? Math.round((completedSets / totalSets) * 100)
        : 0;

    function applyManualDuration() {
        if (!canSetDuration) return;
        onDurationSet(Math.floor(durationMinutes));
        setManualDurationMinutes("");
    }

    return (
        <section className="space-y-5 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
            <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-3">
                    <h2 className="font-semibold text-foreground">Workout date</h2>
                    <DatePicker
                        date={workoutDate}
                        onSelect={(date) => {
                            if (date) onWorkoutDateChange(date);
                        }}
                    />
                    <p className="text-sm text-muted-foreground">
                        If left unselected, today’s date will be used.
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 className="font-semibold text-foreground">Duration</h2>
                            <p className="text-sm text-muted-foreground">
                                {isTimerPaused ? "Timer paused" : "Timer running"}
                            </p>
                            <p
                                className="text-3xl font-semibold tabular-nums text-foreground"
                                role="timer"
                                aria-label={`Workout duration ${formatDuration(elapsedSeconds)}`}
                            >
                                {formatDuration(elapsedSeconds)}
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onTimerPauseToggle}
                            aria-pressed={isTimerPaused}
                        >
                            {isTimerPaused ? "Resume timer" : "Pause timer"}
                        </Button>
                    </div>

                    <div className="flex items-end gap-2">
                        <label className="min-w-0 flex-1 space-y-1 text-sm text-muted-foreground">
                            <span className="block">Set duration (minutes)</span>
                            <Input
                                type="number"
                                min="0"
                                step="1"
                                inputMode="numeric"
                                value={manualDurationMinutes}
                                onChange={(event) => setManualDurationMinutes(event.target.value)}
                            />
                        </label>
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={!canSetDuration}
                            onClick={applyManualDuration}
                        >
                            Set
                        </Button>
                    </div>
                </div>
            </div>

            <div className="space-y-3 border-t border-border pt-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="font-semibold text-foreground">Workout progress</h2>
                        <p className="text-sm text-muted-foreground">
                            Track completed sets throughout the session.
                        </p>
                    </div>
                    <span className="text-lg font-semibold tabular-nums text-primary">
                        {progressPercentage}%
                    </span>
                </div>

                <div
                    className="h-3 w-full overflow-hidden rounded-full bg-muted"
                    role="progressbar"
                    aria-valuenow={progressPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Workout completion"
                >
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-300 ease-in-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{completedSets} of {totalSets} sets completed</span>
                    <span>{totalSets - completedSets} remaining</span>
                </div>
            </div>
        </section>
    );
}
