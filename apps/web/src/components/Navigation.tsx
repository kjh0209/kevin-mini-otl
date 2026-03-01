"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Navigation() {
    const router = useRouter();
    const pathname = usePathname();

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(!!Cookies.get('token'));
    }, [pathname]);

    const handleLogout = () => {
        Cookies.remove('token');
        router.push('/login');
    };

    // Hide nav on auth pages
    if (pathname === '/login' || pathname === '/signup' || pathname === '/auth/login' || pathname === '/auth/register') return null;

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
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                            >
                                Log out
                            </button>
                        ) : (
                            <div className="flex space-x-4">
                                <Link
                                    href="/login"
                                    className="text-slate-300 hover:text-white text-sm font-medium transition-colors flex items-center"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
