import type { getWorkoutRequests } from "@/lib/queries/workout-requests";

type WorkoutRequest = Awaited<ReturnType<typeof getWorkoutRequests>>[number];

interface WorkoutRequestListProps {
    workoutRequests: WorkoutRequest[];
    selectedStudentId: string | null;
    onSelectStudent: (studentId: string) => void;
}

export function WorkoutRequestList({ workoutRequests, selectedStudentId, onSelectStudent }: WorkoutRequestListProps) {
    if (!workoutRequests || workoutRequests.length === 0) {
        return (
            <div className="p-4 text-zinc-400 text-center">
                No workout requests found.
            </div>
        );
    }

    return (
        <div className="space-y-3 w-full xl:w-2/5 self-center">
            <h1 className="text-center text-xl font-semibold text-slate-100">
                Workout Requests
            </h1>
            {workoutRequests.map((workoutRequest) => {
                return (
                    <button
                        type="button"
                        key={workoutRequest.requestId}
                        onClick={() => onSelectStudent(workoutRequest.studentId)}
                        aria-pressed={selectedStudentId === workoutRequest.studentId}
                        className={`w-full p-4 border rounded-lg text-left space-y-2 ${selectedStudentId === workoutRequest.studentId ? "border-blue-500 bg-blue-950/50" : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600"}`}
                    >
                        <h3 className="font-semibold text-zinc-100">{workoutRequest.studentName}</h3>
                        <p className="text-sm text-zinc-400">Experience: {workoutRequest.experienceLevel}</p>
                        <p className="text-sm text-zinc-400">Priorities: {workoutRequest.priorities}</p>
                        
                        {workoutRequest.hasInjuries && (
                            <p className=" text-red-400">
                                Limitations / Injuries: {workoutRequest.injuryDetails}
                            </p>
                        )}
                        {workoutRequest.solved && (
                            <p className="text-green-400">Solved</p>   
                        )}
                        {!workoutRequest.solved && (
                            <p className="text-red-400">Not solved</p>   
                        )}
                    </button>
                );
            })}
        </div>
    );
}
