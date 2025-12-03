import axios from 'axios';

// Create an instance pointing to your FastAPI backend
const api = axios.create({
    baseURL: 'http://localhost:8000', 
});

// Interceptor: Automatically adds the Token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;