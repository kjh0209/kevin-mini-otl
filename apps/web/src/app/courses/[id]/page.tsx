"use client";

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useParams } from 'next/navigation';

export default function CourseDetailPage() {
    const { id } = useParams();
    const [course, setCourse] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [timetables, setTimetables] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const _course = await fetchApi<any>(`/courses/${id}`);
                setCourse(_course);

                try {
                    const _profile = await fetchApi<any>('/users/profile');
                    setProfile(_profile);
                    if (_profile) {
                        const _tt = await fetchApi<any[]>(`/users/${_profile.id}/timetables`);
                        setTimetables(_tt);
                    }
                } catch (e) {
                    // Unauthenticated or profile fail, ignore
                }
            } catch (err) {
                console.error('Failed to load course', err);
            } finally {
                setLoading(false);
            }
        }
        if (id) loadData();
    }, [id]);

    const addToTimetable = async (lectureId: number) => {
        if (!profile) return alert("Please log in first.");
        if (timetables.length === 0) return alert("You don't have any timetables. Create one in dashboard first.");

        const ttIdStr = prompt("Enter Timetable ID to add to:\n" + timetables.map(t => `${t.id}: ${t.name}`).join("\n"));
        if (!ttIdStr) return;
        const ttId = parseInt(ttIdStr);

        try {
            await fetchApi(`/users/${profile.id}/timetables/${ttId}/lectures/${lectureId}`, {
                method: 'POST'
            });
            alert('Successfully added!');
        } catch (err: any) {
            alert('Failed to add: ' + err.message);
        }
    };

    if (loading) return <div className="p-8 text-slate-400 animate-pulse">Loading course details...</div>;
    if (!course) return <div className="p-8 text-red-400">Course not found</div>;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-primary text-white text-sm font-mono px-3 py-1 rounded-full">{course.code}</span>
                </div>
                <h1 className="text-4xl font-bold font-mono mb-4 text-white">{course.title}</h1>
                <p className="text-slate-300 leading-relaxed text-lg">{course.summary}</p>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-6 font-mono border-b border-slate-800 pb-2">Available Lectures</h2>
                <div className="space-y-4">
                    {course.lectures?.length === 0 ? (
                        <div className="text-slate-400 bg-slate-900/50 p-6 rounded-xl border border-dashed border-slate-700 text-center">
                            No lectures available for this course.
                        </div>
                    ) : (
                        course.lectures?.map((lecture: any) => (
                            <div key={lecture.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-colors relative">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="text-white font-semibold text-lg">{lecture.professor}</div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm bg-slate-800 px-2 py-1 rounded text-slate-300">{lecture.time_str}</span>
                                        <button onClick={() => addToTimetable(lecture.id)} className="bg-cta hover:bg-green-500 text-white text-xs px-3 py-1 rounded font-bold transition-colors cursor-pointer border-none pb-2 pt-2">Add</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
                                    <div>
                                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Room</div>
                                        <div className="text-slate-300">{lecture.room || 'TBD'}</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Quota</div>
                                        <div className="text-slate-300">{lecture.quota}</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Credit</div>
                                        <div className="text-slate-300">{lecture.credit}</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Type</div>
                                        <div className="text-slate-300">{lecture.type}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
