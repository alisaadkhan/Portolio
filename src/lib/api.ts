const API_URL = 'http://localhost:5000/api';

export const api = {
    get: async (endpoint: string) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
        return res.json();
    },

    post: async (endpoint: string, body: any) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || res.statusText);
        }
        return res.json();
    },

    put: async (endpoint: string, body: any) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || res.statusText);
        }
        return res.json();
    },

    delete: async (endpoint: string) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
        return res.json();
    }
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};
