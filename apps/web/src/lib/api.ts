export const API_BASE = '/api';

export const fetchApi = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API request failed');
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }

    return null as unknown as T;
};

export const clearAuth = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        const Cookies = require('js-cookie');
        Cookies.remove('token');
        window.location.href = '/login';
    }
};
