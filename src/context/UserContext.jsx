import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Initialize user state from localStorage
        const savedUser = localStorage.getItem('userData');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (userData) => {
        // Extract required user data from the response
        const userInfo = {
            username: userData.data.username,
            profilePicture: userData.data.profilePicture,
            email: userData.data.email,
            id: userData.data._id
        };
        
        // Save token and user data in localStorage
        localStorage.setItem('accessToken', userData.accessToken);
        localStorage.setItem('userData', JSON.stringify(userInfo));
        // Save user data in state
        setUser(userInfo);
    };

    const logout = () => {
        // Clear both state and localStorage
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};