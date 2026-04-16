import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Vérifier le token plus tard
        }
        setLoading(false);
    }, []);

    const login = async (email, mot_de_passe) => {
        try {
            const response = await apiLogin({ email, mot_de_passe });
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await apiRegister(userData);
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message };
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
        } catch (error) {}
        localStorage.removeItem('token');
        setUser(null);
    };

    // Fonction pour vérifier le rôle
    const hasRole = (role) => {
        return user?.role === role;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};