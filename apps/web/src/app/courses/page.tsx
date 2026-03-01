"use client";

import useSWR from 'swr';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';

interface Course {
    id: number;
    title: string;
    code: string;
    summary: string | null;
    lectures?: unknown[];
}

export default function CoursesPage() {
    const { data: courses, isLoading } = useSWR<Course[]>('/courses', fetchApi);

    if (isLoading) return <div className="p-8 text-slate-400 animate-pulse">Loading courses...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-mono">Course Catalog</h1>
                <div className="text-sm text-slate-400">{courses?.length || 0} courses available</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses?.map((course) => (
                    <Link href={`/courses/${course.id}`} key={course.id} className="card group hover:border-primary">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-white group-hover:text-cta transition-colors leading-tight">{course.title}</h3>
                            <span className="bg-slate-800 text-xs px-2 py-1 flex-shrink-0 rounded text-slate-300 ml-4 font-mono">{course.code}</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-2 line-clamp-2">{course.summary || 'No summary provided.'}</p>
                        <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                            <span className="text-xs text-slate-500">{course.lectures?.length || 0} Lectures available</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
