import axios from "axios";
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    // Fail fast: avoids Node.js/undici internal TIMEOUT_ERR dumps when the
    // backend is slow or cold-starting on Vercel.
    timeout: 12000,
});

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Response Interceptor: Handle 401 (Optional)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (typeof window !== 'undefined' && error.response?.status === 401) {
            Cookies.remove('token');
            // window.location.href = '/login'; // Optional redirect
        }
        return Promise.reject(error);
    }
);

export default api;

