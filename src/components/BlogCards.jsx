import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { axiosInstance } from '../utils/axiosInstance';

const BlogCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-4/6"></div>
        <div className="flex items-center mt-6">
          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
          <div className="ml-3 w-20 h-4 bg-gray-200 rounded"></div>
          <div className="ml-auto w-16 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const BlogCard = ({ blog, onEdit, onDelete }) => {
  const { _id, title, description, image, author, createdAt } = blog;
  
  const date = new Date(createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short'
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">
          {description}
        </p>
        <div className="flex items-center mt-4">
          <div className="flex-shrink-0">
            <img 
              src={author.profilePicture || "https://via.placeholder.com/40"} 
              alt={author.username} 
              className="h-10 w-10 rounded-full"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{author.username}</p>
          </div>
          <div className="ml-auto flex space-x-2">
            <span className="text-sm text-gray-500">{date}</span>
            <button 
              onClick={() => onEdit(blog)}
              className="text-blue-500 hover:text-blue-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button 
              onClick={() => onDelete(_id)}
              className="text-red-500 hover:text-red-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ blogId, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
        <p className="text-gray-500 mb-6">Are you sure you want to delete this blog post? This action cannot be undone.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(blogId)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const EditBlogForm = ({ blog, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: blog.title,
    description: blog.description,
    image: blog.image
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await axiosInstance.patch(`blogs/updateBlog/${blog._id}`, formData);
      onSuccess();
    } catch (err) {
      setError('Failed to update blog post');
      console.error('Error updating blog:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Edit Blog Post</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Image URL
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BlogCards = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/blogs');
      setBlogs(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch blogs');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleEditClick = (blog) => {
    setEditingBlog(blog);
  };

  const handleDeleteClick = (blogId) => {
    setBlogToDelete(blogId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async (blogId) => {
    try {
      await axiosInstance.delete(`blogs/deleteBlog/${blogId}`);
      setBlogs(blogs.filter(blog => blog._id !== blogId));
      setShowDeleteModal(false);
      setBlogToDelete(null);
    } catch (err) {
      console.error('Error deleting blog:', err);
      setError('Failed to delete blog');
    }
  };

  const handleEditSuccess = () => {
    setEditingBlog(null);
    fetchBlogs();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <BlogCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard
            key={blog._id}
            blog={blog}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      {showDeleteModal && (
        <DeleteConfirmModal
          blogId={blogToDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setBlogToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {editingBlog && (
        <EditBlogForm
          blog={editingBlog}
          onClose={() => setEditingBlog(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
};

export default BlogCards;