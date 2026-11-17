import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getStudentData } from '@/lib/queries/students';
import { getWorkoutData, getWorkoutItems } from '@/lib/queries/workouts';
import { WorkoutAttendanceForm } from '@/components/attend-workout/workout-attend-form';
import { getAllExercises, getExercisesWorkoutItems } from '@/lib/queries/exercises';

interface AttendWorkoutPageProps {
    params: Promise<{ workoutId: string }>;
}

export default async function AttendWorkoutPage({ params }: AttendWorkoutPageProps) {
    const { workoutId } = await params;

    let session;
    try {
        session = await auth.api.getSession({
            headers: await headers()
        });
    } catch (error) {
        console.error("Failed to fetch session:", error);
    }

    const userId = session?.user.id;

    if (!userId) {
        return (
            <div className="p-6 text-center text-zinc-400">
                No userId found. Please sign in.
            </div>
        );
    }

    const studentData = await getStudentData(userId);

    const workoutData = await getWorkoutData(workoutId);

    const workoutItems = await getExercisesWorkoutItems(workoutId);

    const exerciseList = await getAllExercises();

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl font-bold text-white">Attending Workout</h1>
            <p className="text-sm text-zinc-400">Workout ID: {workoutId}</p>
            <p className="text-sm text-zinc-400">User ID: {userId}</p>
            <p>
                {workoutData.title} <br />
                {workoutData.startDate}
            </p>
            {workoutItems.map(
                (item) => (
                    <p>
                        
                    </p>
                )
            )
            }
            <WorkoutAttendanceForm 
                workoutData={workoutData} 
                workoutItems={workoutItems}
                exercises={exerciseList}
            />
        </div>
    );
}