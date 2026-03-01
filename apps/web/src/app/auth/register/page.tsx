"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetchApi("/users/signup", {
                method: "POST",
                body: JSON.stringify(formData),
            });
            router.push("/auth/login");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Registration failed");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="clay-card p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-[var(--color-primary)]">Join Us! 🚀</h1>
                {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 ml-1 text-slate-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                            placeholder="Kevin Kim"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 ml-1 text-slate-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                            placeholder="hello@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 ml-1 text-slate-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="clay-btn clay-btn-cta w-full mt-6 text-lg">
                        Create Account
                    </button>
                </form>

                <p className="text-center mt-6 text-slate-600 font-medium">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-[var(--color-secondary)] hover:text-[var(--color-primary)] font-bold transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
