// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Mock user session initializing matching Task 4 Dataset schema parameters
    const [user, setUser] = useState({
        name: "Rahul Sharma",
        email: "rahul@isoftzone.com",
        role: "manager", // Admin, HR, Manager, Employee options
        token: "mock-jwt-token-xyz"
    });

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);