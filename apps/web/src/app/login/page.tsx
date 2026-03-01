"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || 'Login failed');
            }

            const data = await res.json();

            if (!data.accessToken) {
                throw new Error('Invalid credentials');
            }

            Cookies.set('token', data.accessToken, { path: '/' });
            router.push('/dashboard');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Login failed');
            }
        } finally {
            setLoading(false);
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

                <button type="submit" className="btn-primary w-full mt-6" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <p className="text-center text-sm text-slate-400">
                    Don&apos;t have an account?{' '}
                    <a href="/signup" className="text-cta hover:underline">
                        Sign up
                    </a>
                </p>
            </form>
        </div>
    );
}
