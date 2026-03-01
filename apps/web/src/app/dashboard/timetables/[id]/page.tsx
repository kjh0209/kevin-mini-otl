"use client";

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Lecture {
    id: number;
    professor: string;
    time_str: string;
    room: string;
    credit: number;
    course: {
        title: string;
        code: string;
    }
}
interface Profile { id: number }
interface Timetable {
    id: number;
    name: string;
    year: number;
    semester: { year: number; season: string };
    lectures?: Lecture[];
}

export default function TimetableDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [timetable, setTimetable] = useState<Timetable | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const _profile = await fetchApi<Profile>('/users/profile');
                setProfile(_profile);

                if (_profile && id) {
                    const _tt = await fetchApi<Timetable>(`/users/${_profile.id}/timetables/${id}`);
                    setTimetable(_tt);
                }
            } catch (err) {
                console.error('Failed to load timetable', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    const deleteTimetable = async () => {
        if (!profile || !confirm("Are you sure you want to delete this timetable?")) return;

        try {
            await fetchApi(`/users/${profile.id}/timetables/${id}`, {
                method: 'DELETE'
            });
            router.push('/dashboard');
        } catch (_err) {
            alert('Failed to delete timetable');
        }
    };

    const removeLecture = async (lectureId: number) => {
        if (!profile || !confirm("Remove lecture from timetable?")) return;

        try {
            await fetchApi(`/users/${profile.id}/timetables/${id}/lectures/${lectureId}`, {
                method: 'DELETE'
            });
            const _tt = await fetchApi<Timetable>(`/users/${profile.id}/timetables/${id}`);
            setTimetable(_tt);
        } catch (_err) {
            alert('Failed to remove lecture');
        }
    };

    if (loading) return <div className="p-8 text-slate-400 animate-pulse">Loading details...</div>;
    if (!timetable) return <div className="p-8 text-red-500">Timetable not found</div>;

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-6">
                <div>
                    <Link href="/dashboard" className="text-cta text-sm hover:underline mb-2 inline-block">← Back to Dashboard</Link>
                    <h1 className="text-3xl font-bold font-mono text-white">{timetable.name}</h1>
                    <div className="text-slate-400 mt-1">{timetable.semester ? `${timetable.semester.year} ${timetable.semester.season}` : ''}</div>
                </div>
                <button onClick={deleteTimetable} className="text-red-400 hover:text-red-300 transition-colors text-sm px-4 py-2 border border-red-900 rounded-lg hover:bg-red-900/20">
                    Delete Timetable
                </button>
            </div>

            <section>
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-xl font-bold font-mono text-slate-200">Enrolled Lectures ({timetable.lectures?.length || 0})</h2>
                    <Link href="/courses" className="btn-primary text-sm px-4 py-2">Add Lectures</Link>
                </div>

                {timetable.lectures?.length === 0 ? (
                    <div className="text-slate-400 bg-slate-900/50 p-12 rounded-xl border border-dashed border-slate-700 text-center">
                        No lectures added yet. Browse courses to add lectures to this timetable.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {timetable.lectures?.map((lecture) => (
                            <div key={lecture.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative group overflow-hidden">
                                <button
                                    onClick={() => removeLecture(lecture.id)}
                                    className="absolute top-2 right-2 text-slate-500 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove Lecture"
                                >
                                    ✕
                                </button>
                                <div className="mb-4">
                                    <div className="text-xs font-mono text-cta mb-1">{lecture.course.code}</div>
                                    <h3 className="font-bold text-white text-lg leading-tight">{lecture.course.title}</h3>
                                </div>
                                <div className="space-y-2 text-sm text-slate-300">
                                    <div className="flex items-start">
                                        <span className="w-20 text-slate-500">Prof:</span>
                                        <span>{lecture.professor}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="w-20 text-slate-500">Time:</span>
                                        <span>{lecture.time_str}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="w-20 text-slate-500">Room:</span>
                                        <span>{lecture.room || 'TBD'}</span>
                                    </div>
                                    <div className="flex items-start mt-4 pt-4 border-t border-slate-800">
                                        <span className="w-20 text-slate-500">Credits:</span>
                                        <span className="font-mono text-white">{lecture.credit}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
