"use client";

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
    const [profile, setProfile] = useState<any>(null);
    const [timetables, setTimetables] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDashboard() {
            try {
                const _profile = await fetchApi<any>('/users/profile');
                setProfile(_profile);

                if (_profile) {
                    const _timetables = await fetchApi<any[]>(`/users/${_profile.id}/timetables`);
                    setTimetables(_timetables);
                }
            } catch (err) {
                console.error('Failed to load dashboard', err);
            } finally {
                setLoading(false);
            }
        }
        loadDashboard();
    }, []);

    const createTimetable = async () => {
        const name = prompt("Enter a name for the new timetable:");
        if (!name) return;

        const year = parseInt(prompt("Enter year (e.g. 2024):") || "2024");
        const semester = parseInt(prompt("Enter semester (id):") || "1");

        try {
            await fetchApi(`/users/${profile.id}/timetables`, {
                method: 'POST',
                body: JSON.stringify({ name, year, semester_id: semester }),
            });
            // Reload timetables
            const _timetables = await fetchApi<any[]>(`/users/${profile.id}/timetables`);
            setTimetables(_timetables);
        } catch (err) {
            alert('Failed to create timetable');
        }
    };

    if (loading) return <div className="p-8 text-slate-400 animate-pulse">Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
                <h1 className="text-3xl font-bold font-mono">Welcome back, {profile?.profile?.name || 'Student'}</h1>
                <p className="text-slate-400 mt-2">Manage your timetables and explore courses for the upcoming semester.</p>
                <div className="mt-6 flex space-x-4">
                    <button onClick={createTimetable} className="btn-primary">Create Timetable</button>
                    <Link href="/courses" className="btn-secondary">Browse Courses</Link>
                </div>
            </section>

            {/* Timetables Grid */}
            <section>
                <h2 className="text-xl font-bold mb-4 font-mono text-slate-200">Your Timetables</h2>
                {timetables.length === 0 ? (
                    <div className="text-slate-400 bg-slate-900/50 p-6 rounded-xl border border-dashed border-slate-700 text-center text-sm">
                        You haven't created any timetables yet. Create one to get started.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {timetables.map(tt => (
                            <div key={tt.id} className="card group">
                                <h3 className="text-lg font-bold text-white group-hover:text-cta transition-colors">{tt.name}</h3>
                                <div className="text-sm text-slate-400 mt-1">Year {tt.year} • Semester {tt.semester.year} {tt.semester.season}</div>
                                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                                    <span className="text-xs text-slate-500">{tt.lectures?.length || 0} Lectures</span>
                                    <Link href={`/dashboard/timetables/${tt.id}`} className="text-cta text-sm hover:underline">View details →</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
