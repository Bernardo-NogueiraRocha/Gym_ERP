import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getWorkoutData } from '@/lib/queries/workouts';
import { WorkoutAttendanceForm } from '@/components/attend-workout/workout-attend-form';
import { getAllExercises, getWorkoutItemsWithMuscles } from '@/lib/queries/exercises';

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
            <div className="p-6 text-center text-muted-foreground">
                No userId found. Please sign in.
            </div>
        );
    }

    const workoutData = await getWorkoutData(workoutId);

    const workoutItems = await getWorkoutItemsWithMuscles(workoutId);

    const exerciseList = await getAllExercises();

    return (
        <div className="space-y-4 p-6">
            <h1 className="text-xl font-semibold text-foreground">Attending Workout</h1>
            <p className='font-semibold text-xl'>
                {workoutData.title} <br />
            </p>
            <WorkoutAttendanceForm 
                workoutData={workoutData} 
                workoutItems={workoutItems}
                exerciseList={exerciseList}
            />
        </div>
    );
}
