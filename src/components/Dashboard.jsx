import React, { useState } from 'react';
import Navbar from './Navbar';
import CreateBlogForm from './CreateBlogForm';
import BlogCards from './BlogCards';

const Dashboard = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleCreateSuccess = () => {
        // Refresh the blogs list by incrementing the trigger value
        setRefreshTrigger(prev => prev + 1);
        setShowCreateModal(false);
    };

    const handleEditSuccess = () => {
        // Refresh the blogs list when a blog is edited
        setRefreshTrigger(prev => prev + 1);
    };

    const handleDeleteSuccess = () => {
        // Refresh the blogs list when a blog is deleted
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Create Blog
                    </button>
                </div>

                {/* Display blog cards */}
                <BlogCards 
                    key={refreshTrigger}
                    onEditSuccess={handleEditSuccess}
                    onDeleteSuccess={handleDeleteSuccess}
                />

                {showCreateModal && (
                    <CreateBlogForm
                        onClose={() => setShowCreateModal(false)}
                        onSuccess={handleCreateSuccess}
                    />
                )}
            </div>
        </>
    );
};

export default Dashboard;