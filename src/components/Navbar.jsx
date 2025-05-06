import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Navbar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useUser();

    // Remove this line as it's causing unnecessary re-renders
    // const data = localStorage.getItem('userData');
    // console.log(data, "====data")

    // Close drawer when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDrawerOpen && !event.target.closest('.profile-menu')) {
                setIsDrawerOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDrawerOpen]);

    const handleLogout = () => {
        setIsDrawerOpen(false); // Close the drawer before logout
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-800">Blog Post</h1>
                    </div>

                    {user && (
                        <div className="flex items-center">
                            <div className="relative profile-menu">
                                <button
                                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                                    className="flex items-center focus:outline-none"
                                >
                                    <img
                                        src={user.profilePicture}
                                        alt="Profile"
                                        className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                                    />
                                </button>

                                {isDrawerOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <div className="px-4 py-2 border-b">
                                            <p className="text-sm font-medium text-gray-900">{user.username}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;