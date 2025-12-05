import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode"; 
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // We will use this to redirect the user after login
    // Note: This requires AuthProvider to be inside <Router> in App.jsx
    const navigate = useNavigate(); 

    // 1. Check if user is already logged in when app loads
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser({ email: decoded.sub }); 
                }
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    // 2. Login Function
    const login = async (email, password) => {
        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const response = await api.post('/token', formData);
            
            const { access_token } = response.data;
            localStorage.setItem('token', access_token);

            const decoded = jwtDecode(access_token);
            setUser({ email: decoded.sub });
            
            navigate('/events'); 
            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            return { success: false, message: "Invalid email or password" };
        }
    };

    // 3. Register Function
    const register = async (username, email, password) => {
        try {
            await api.post('/register', { username, email, password });
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.detail || "Registration failed" 
            };
        }
    };

    // 4. Logout Function
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;