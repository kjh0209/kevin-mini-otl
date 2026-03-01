export const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export const fetchApi = async <T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    // Isomorphic check for token (client side document.cookie)
    if (typeof document !== 'undefined') {
        const tokenMatch = document.cookie.match(/(^|;)\s*token\s*=\s*([^;]+)/);
        const token = tokenMatch ? tokenMatch[2] : null;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
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


