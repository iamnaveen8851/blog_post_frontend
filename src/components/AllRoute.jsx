import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import SignupForm from './SignUp';
import Dashboard from './Dashboard';
import PrivateRoute from './PrivateRoute';
import { useUser } from '../context/UserContext';

const AllRoute = () => {
    const { user } = useUser();
    
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/signup" element={user ? <Navigate to="/" /> : <SignupForm />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            
            {/* Private Routes */}
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default AllRoute;