"use server";

import { cookies } from "next/headers";

export async function loginAction(email: string, password: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/users/login`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        }
    );

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err && typeof err === 'object' && 'message' in err ? String(err.message) : "Invalid credentials");
    }

    const data = await res.json();
    const cookieStore = await cookies();
    cookieStore.set("token", data.accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });

    return true;
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("token");
}
