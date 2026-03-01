"use client";

import { useState } from 'react';
import useSWR from 'swr';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';
import Cookies from 'js-cookie';

interface Profile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

interface Timetable {
    id: number;
    name: string;
    year: number;
    semester: { year: number; season: string };
    entries?: unknown[];
}

export default function DashboardPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newYear, setNewYear] = useState(new Date().getFullYear().toString());
    const [newSemester, setNewSemester] = useState("1");

    const token = Cookies.get('token');

    const { data: profile, isLoading: isProfileLoading, error: profileError } = useSWR<Profile>(
        token ? '/users/profile' : null,
        fetchApi
    );

    const { data: timetables, mutate: mutateTimetables } = useSWR<Timetable[]>(
        profile?.id ? `/users/${profile.id}/timetables` : null,
        fetchApi
    );

    const createTimetable = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile?.id) return;
        try {
            await fetchApi(`/users/${profile.id}/timetables`, {
                method: 'POST',
                body: JSON.stringify({
                    name: newName,
                    year: parseInt(newYear),
                    semester_id: parseInt(newSemester)
                }),
            });
            setIsModalOpen(false);
            setNewName("");
            mutateTimetables();
        } catch (err) {
            console.error('Create timetable error:', err);
            alert('Failed to create timetable');
        }
    };

    // Not logged in
    if (!token) {
        return (
            <div className="p-8 text-center">
                <p className="text-slate-400 mb-4">Please log in to view your dashboard.</p>
                <a href="/login" className="btn-primary">Go to Login</a>
            </div>
        );
    }

    if (isProfileLoading) return <div className="p-8 text-slate-400 animate-pulse">Loading dashboard...</div>;

    if (profileError) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-400 mb-4">Failed to load profile. Your session may have expired.</p>
                <a href="/login" className="btn-primary" onClick={() => Cookies.remove('token')}>Log in again</a>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
                <h1 className="text-3xl font-bold font-mono">Welcome back, {profile?.firstName || 'Student'}</h1>
                <p className="text-slate-400 mt-2">Manage your timetables and explore courses for the upcoming semester.</p>
                <div className="mt-6 flex space-x-4">
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary">Create Timetable</button>
                    <Link href="/courses" className="btn-secondary">Browse Courses</Link>
                </div>
            </section>

            {/* Timetables Grid */}
            <section>
                <h2 className="text-xl font-bold mb-4 font-mono text-slate-200">Your Timetables</h2>
                {!timetables || timetables.length === 0 ? (
                    <div className="text-slate-400 bg-slate-900/50 p-6 rounded-xl border border-dashed border-slate-700 text-center text-sm">
                        You haven&apos;t created any timetables yet. Create one to get started.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {timetables.map((tt) => (
                            <div key={tt.id} className="card group">
                                <h3 className="text-lg font-bold text-white group-hover:text-cta transition-colors">{tt.name || `Timetable #${tt.id}`}</h3>
                                <div className="text-sm text-slate-400 mt-1">
                                    {tt.semester ? `${tt.semester.year} ${tt.semester.season}` : `Year ${tt.year}`}
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                                    <span className="text-xs text-slate-500">{tt.entries?.length || 0} Entries</span>
                                    <Link href={`/dashboard/timetables/${tt.id}`} className="text-cta text-sm hover:underline">View details →</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Create Timetable Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                        <h2 className="text-2xl font-bold text-white mb-6">New Timetable</h2>
                        <form onSubmit={createTimetable} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-300">Timetable Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cta"
                                    placeholder="e.g. My Fall Schedule"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-slate-300">Year</label>
                                    <input
                                        type="number"
                                        required
                                        value={newYear}
                                        onChange={(e) => setNewYear(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cta"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-slate-300">Semester ID</label>
                                    <input
                                        type="number"
                                        required
                                        value={newSemester}
                                        onChange={(e) => setNewSemester(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cta"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors text-white font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-xl bg-cta hover:bg-cta/90 transition-colors text-slate-900 font-bold"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
