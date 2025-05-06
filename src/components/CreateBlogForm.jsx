import React, { useState } from 'react';
import { axiosInstance } from '../utils/axiosInstance';

const CreateBlogForm = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null
    });
    const [errors, setErrors] = useState({
        title: '',
        description: '',
        image: ''
    });
    const [touched, setTouched] = useState({
        title: false,
        description: false,
        image: false
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const validateField = (name, value) => {
        switch (name) {
            case 'title':
                if (!value.trim()) return 'Title is required';
                if (value.trim().length < 3) return 'Title must be at least 3 characters';
                if (value.trim().length > 100) return 'Title must be less than 100 characters';
                return '';
            case 'description':
                if (!value.trim()) return 'Description is required';
                if (value.trim().length < 10) return 'Description must be at least 10 characters';
                if (value.trim().length > 1000) return 'Description must be less than 1000 characters';
                return '';
            case 'image':
                if (!value) return 'Image is required';
                const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                if (!validTypes.includes(value.type)) {
                    return 'Please upload a valid image file (jpg, jpeg, png, or gif)';
                }
                if (value.size > 5 * 1024 * 1024) {
                    return 'Image size must be less than 5MB';
                }
                return '';
            default:
                return '';
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
        
        const value = name === 'image' ? formData.image : e.target.value;
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            
            const error = validateField('image', file);
            setErrors(prev => ({
                ...prev,
                image: error
            }));
            setTouched(prev => ({
                ...prev,
                image: true
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields
        const newErrors = {
            title: validateField('title', formData.title),
            description: validateField('description', formData.description),
            image: validateField('image', formData.image)
        };
        
        setErrors(newErrors);
        setTouched({
            title: true,
            description: true,
            image: true
        });

        // Check if there are any errors
        if (Object.values(newErrors).some(error => error)) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('image', formData.image);

            await axiosInstance.post('/blogs/createBlog', formDataToSend);
            
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
            
            onSuccess();
            onClose();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create blog');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Create New Blog</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`mt-1 block w-full rounded-md border shadow-sm px-4 py-2 ${
                                touched.title && errors.title 
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                                    : touched.title && !errors.title
                                    ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                                    : 'border-gray-400 focus:border-indigo-500 focus:ring-indigo-500'
                            }`}
                            placeholder="Enter blog title"
                        />
                        {touched.title && errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            rows={4}
                            className={`mt-1 block w-full rounded-md border shadow-sm px-4 py-2 ${
                                touched.description && errors.description 
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                                    : touched.description && !errors.description
                                    ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                                    : 'border-gray-400 focus:border-indigo-500 focus:ring-indigo-500'
                            }`}
                            placeholder="Enter blog description"
                        />
                        {touched.description && errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            onBlur={handleBlur}
                            className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 ${
                                touched.image && errors.image 
                                    ? 'border-red-300' 
                                    : touched.image && !errors.image
                                    ? 'border-green-300'
                                    : 'border-gray-400'
                            } rounded-md border px-4 py-2`}
                        />
                        {previewImage && (
                            <img src={previewImage} alt="Preview" className="mt-2 h-32 object-cover rounded" />
                        )}
                        {touched.image && errors.image && (
                            <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                        )}
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || Object.values(errors).some(error => error)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating...
                                </>
                            ) : 'Create Blog'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBlogForm;