'use client';
import type { StudentList } from "@/lib/types";
import { useMemo, useState } from "react";


interface StudentSelectorProps {
    usersData: StudentList;
    selectedUserId: string | null;
    onSelect: (studentId: string) => void;
}

export function StudentSelector({ usersData, selectedUserId, onSelect }: StudentSelectorProps) {
    const [search, setSearch] = useState("");
    const filteredUsers = useMemo(() => {
        const normalizedSearch = search.trim().toLocaleLowerCase();
        return usersData.filter((student) =>
            (student.name ?? "").toLocaleLowerCase().includes(normalizedSearch)
        );
    }, [usersData, search]);

    return (
        <div className="space-y-3 w-full xl:w-2/5 self-center">
            <div className="text-center text-xl font-semibold text-slate-100">
                Student List
            </div>
            <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search students by name"
                aria-label="Search students by name"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 placeholder:text-zinc-500"
            />
            <div className="max-h-96 space-y-2 overflow-y-auto">
                {filteredUsers.map((student) => (
                    <button
                        type="button"
                        key={student.student_id}
                        onClick={() => onSelect(student.student_id)}
                        aria-pressed={selectedUserId === student.student_id}
                        className={`w-full rounded-lg border p-4 text-left transition ${selectedUserId === student.student_id
                            ? "border-blue-500 bg-blue-950/50"
                            : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600"
                            }`}
                    >
                        <span className="font-semibold text-zinc-100">{student.name}</span>
                        {selectedUserId === student.student_id && (
                            <span className="ml-2 text-sm text-blue-300">Selected</span>
                        )}
                    </button>
                ))}
                {filteredUsers.length === 0 && (
                    <p className="p-4 text-center text-zinc-400">No students match your search.</p>
                )}
            </div>
        </div>
    )
}
