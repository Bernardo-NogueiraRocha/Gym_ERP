import type { StudentList } from "@/lib/types";


interface StudentSelectorProps {
    usersData: StudentList;
}

export function StudentSelector({usersData}: StudentSelectorProps) {
    return (
        <div className="space-y-3 w-2/5 self-center">
            <div className="text-center text-xl font-semibold text-slate-100">
                Student List
            </div>
            <div>
                {usersData.map(
                    (userData)=>{
                        return(
                            <div 
                        key={userData.student_id}
                        className="p-4 border border-zinc-800 rounded-lg bg-zinc-900/50 space-y-2"
                    >
                        <h3 className="font-semibold text-zinc-100">{userData.name}</h3>
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}