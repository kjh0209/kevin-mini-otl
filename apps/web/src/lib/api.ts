import Cookies from 'js-cookie';

export const API_BASE = '/api';

export const fetchApi = async <T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    // Attach JWT token from cookie
    const token = Cookies.get('token');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API request failed (${response.status})`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }

    return null as unknown as T;
};
