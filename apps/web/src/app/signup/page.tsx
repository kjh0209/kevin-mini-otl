"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [majorId, setMajorId] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await fetchApi('/users/signup', {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password,
                    firstName,
                    lastName,
                    majorId: parseInt(majorId, 10)
                }),
            });
            router.push('/login');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Signup failed');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <form onSubmit={handleSignup} className="card w-full max-w-md space-y-6">
                <div>
                    <h1 className="text-2xl font-bold font-mono text-text">Create Account</h1>
                    <p className="text-sm text-slate-400 mt-2">Join Kevin Mini OTL today</p>
                </div>

                {error && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">{error}</div>}

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-300">First Name</label>
                            <input
                                type="text"
                                className="input w-full"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-300">Last Name</label>
                            <input
                                type="text"
                                className="input w-full"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-300">Department / Major</label>
                        <select
                            className="input w-full bg-slate-900"
                            value={majorId}
                            onChange={(e) => setMajorId(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select your Major</option>
                            <option value="1">Mechanical Engineering (ME)</option>
                            <option value="2">Electrical Engineering (EE)</option>
                            <option value="3">Business Technology Management (BTM)</option>
                            <option value="4">Industrial Design (ID)</option>
                            <option value="5">Industrial & Systems Engineering (IE)</option>
                            <option value="6">Transdisciplinary Studies (TS)</option>
                            <option value="7">Computer Science (CS)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-300">Email</label>
                        <input
                            type="email"
                            className="input w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-300">Password</label>
                        <input
                            type="password"
                            className="input w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="btn-primary w-full mt-6">
                    Sign Up
                </button>

                <p className="text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <a href="/login" className="text-cta hover:underline">
                        Sign in
                    </a>
                </p>
            </form>
        </div>
    );
}
