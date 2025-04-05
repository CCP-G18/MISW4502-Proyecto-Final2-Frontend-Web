import { createContext, useState, useEffect } from 'react';
import { loginUser, logoutUser } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) setUser({ token, isStatic: token === 'fake-jwt-token' });
    }, []);

    const login = async (email, password) => {
        const data = await loginUser(email, password);
        setUser({ token: data.access_token, isStatic: data.access_token === 'fake-jwt-token' });
    };

    const logout = () => {
        logoutUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};