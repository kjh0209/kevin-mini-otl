"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clearAuth } from '@/lib/api';

export default function Navigation() {
    const pathname = usePathname();

    // Hide nav on auth pages
    if (pathname === '/login' || pathname === '/signup') return null;

    return (
        <nav className="border-b border-gray-800 bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex space-x-8 items-center">
                        <Link href="/dashboard" className="text-xl font-bold font-mono text-text">
                            <span className="text-cta">Kevin</span> Mini OTL
                        </Link>

                        <div className="hidden md:flex space-x-4">
                            <Link
                                href="/dashboard"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/dashboard' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/courses"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/courses' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                            >
                                Courses
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={clearAuth}
                            className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
