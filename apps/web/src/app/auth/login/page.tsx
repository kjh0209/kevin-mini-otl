"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import Link from "next/link";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginAction(email, password);
            router.push("/dashboard");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An error occurred');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="clay-card p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-[var(--color-primary)]">Welcome Back! ✨</h1>
                {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 ml-1 text-slate-700">Email</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                            placeholder="hello@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 ml-1 text-slate-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="clay-btn w-full mt-6 text-lg">
                        Login
                    </button>
                </form>

                <p className="text-center mt-6 text-slate-600 font-medium">
                    Don't have an account?{" "}
                    <Link href="/auth/register" className="text-[var(--color-secondary)] hover:text-[var(--color-primary)] font-bold transition-colors">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
