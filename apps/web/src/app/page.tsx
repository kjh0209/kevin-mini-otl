"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login or dashboard based on token presence
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-pulse flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-cta"></div>
        <div className="w-4 h-4 rounded-full bg-cta delay-75"></div>
        <div className="w-4 h-4 rounded-full bg-cta delay-150"></div>
      </div>
    </div>
  );
}
