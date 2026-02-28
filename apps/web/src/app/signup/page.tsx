"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
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
                    profile: {
                        name,
                        studentId
                    }
                }),
            });
            router.push('/login');
        } catch (err: any) {
            setError(err.message || 'Signup failed');
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
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-300">Name</label>
                        <input
                            type="text"
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-300">Student ID</label>
                        <input
                            type="text"
                            className="input"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-300">Email</label>
                        <input
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-300">Password</label>
                        <input
                            type="password"
                            className="input"
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
