'use client';

import { useState, useTransition } from "react";
import { workoutRequests, experienceLevelEnum } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";
import { Button } from "../ui/button";
import { requestWorkoutAction } from "@/app/actions/request-workout/actions";

type NewWorkoutRequest = InferInsertModel<typeof workoutRequests>;

export function WorkoutRequestForm({ studentId }: { studentId: string }) {
    const [experienceLevel, setExperienceLevel] = useState<NewWorkoutRequest['experienceLevel']>('beginner');
    const [priorities, setPriorities] = useState<string>('');
    const [focusedMuscles, setFocusedMuscles] = useState<string>('');
    const [hasInjuries, setHasInjuries] = useState<boolean>(false);
    const [injuryDetails, setInjuryDetails] = useState<string>('');

    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        startTransition(async () => {
            try {
                await requestWorkoutAction({
                    studentId,
                    experienceLevel,
                    priorities,
                    focusedMuscles,
                    hasInjuries,
                    injuryDetails: hasInjuries ? injuryDetails : null,
                });

                alert("Workout request submitted successfully!");
            } catch (error) {
                alert("Something went wrong. Please try again.");
            }
        });
    };

    return (
        <div className="m-5 border self-center w-4/6 p-6 rounded-lg bg-slate-900 shadow-lg">
            <h2 className="text-center text-2xl font-semibold text-slate-100 mb-6">
                Request Workout
            </h2>

            <form onSubmit={handleSubmit} className="mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Experience Level */}
                    <section>
                        <div className="text-slate-200 text-lg font-semibold mb-2">
                            Experience Level
                        </div>

                        <div className="flex gap-4">
                            {experienceLevelEnum.enumValues.map((level) => (
                                <label key={level} className="flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="experienceLevel"
                                        value={level}
                                        checked={experienceLevel === level}
                                        onChange={() => setExperienceLevel(level)}
                                    />
                                    <span className="capitalize">{level}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Priorities */}
                    <section>
                        <label htmlFor="priorities" className="block text-slate-200 text-lg font-semibold mb-2">
                            Priorities
                        </label>

                        <input
                            id="priorities"
                            type="text"
                            name="priorities"
                            value={priorities}
                            onChange={(e) => setPriorities(e.target.value)}
                            placeholder="e.g., Strength, Hypertrophy, Endurance"
                            className="bg-slate-300 text-black p-2 rounded w-full text-sm"
                        />
                    </section>

                    {/* Focused Muscles */}
                    <section>
                        <label htmlFor="focusedMuscles" className="block text-slate-200 text-lg font-semibold mb-2">
                            Focused Muscles
                        </label>

                        <input
                            id="focusedMuscles"
                            type="text"
                            name="focusedMuscles"
                            value={focusedMuscles}
                            onChange={(e) => setFocusedMuscles(e.target.value)}
                            placeholder="e.g., Chest, Back, Legs"
                            className="bg-slate-300 text-black p-2 rounded w-full text-sm"
                        />
                    </section>

                    {/* Injuries */}
                    <section className="md:col-span-2">
                        <div className="text-slate-200 text-lg font-semibold mb-2">
                            Do you have injuries?
                        </div>

                        <div className="flex gap-5 text-slate-200 mb-3">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="radio"
                                    name="hasInjuries"
                                    checked={hasInjuries === true}
                                    onChange={() => setHasInjuries(true)}
                                />
                                <span>Yes</span>
                            </label>

                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="radio"
                                    name="hasInjuries"
                                    checked={hasInjuries === false}
                                    onChange={() => {
                                        setHasInjuries(false);
                                        setInjuryDetails('');
                                    }}
                                />
                                <span>No</span>
                            </label>
                        </div>

                        {/* Conditional Injury Details */}
                        {hasInjuries && (
                            <div className="mt-2 transition-all duration-300">
                                <label htmlFor="injuryDetails" className="block text-sm text-slate-300 mb-1">
                                    Injury Details
                                </label>

                                <textarea
                                    id="injuryDetails"
                                    name="injuryDetails"
                                    value={injuryDetails}
                                    onChange={(e) => setInjuryDetails(e.target.value)}
                                    placeholder="Please describe your injuries or limitations..."
                                    rows={3}
                                    className="bg-slate-300 text-black p-2 rounded w-full text-sm"
                                />
                            </div>
                        )}
                    </section>

                </div>

                <div className="flex justify-center pt-6">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="text-lg px-6 bg-blue-600 hover:bg-blue-700"
                    >
                        {isPending ? "Submitting..." : "Submit Request"}
                    </Button>
                </div>
            </form>
        </div>
    );
}