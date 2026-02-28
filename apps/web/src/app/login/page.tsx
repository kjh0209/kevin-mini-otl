"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = require('react').useState('');
    const [password, setPassword] = require('react').useState('');
    const [error, setError] = require('react').useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const data = await fetchApi<{ access_token: string }>('/users/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            Cookies.set('token', data.access_token);
            localStorage.setItem('token', data.access_token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <form onSubmit={handleLogin} className="card w-full max-w-md space-y-6">
                <div>
                    <h1 className="text-2xl font-bold font-mono text-text">Kevin Mini OTL</h1>
                    <p className="text-sm text-slate-400 mt-2">Sign in to your dashboard</p>
                </div>

                {error && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">{error}</div>}

                <div className="space-y-4">
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
                    Sign In
                </button>

                <p className="text-center text-sm text-slate-400">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-cta hover:underline">
                        Sign up
                    </a>
                </p>
            </form>
        </div>
    );
}
