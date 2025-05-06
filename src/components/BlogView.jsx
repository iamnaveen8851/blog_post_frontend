import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BlogView = () => {
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get blog data from localStorage
    const storedBlog = localStorage.getItem('viewBlog');
    
    if (storedBlog) {
      setBlog(JSON.parse(storedBlog));
    } else {
      // Redirect to blogs page if no blog found in localStorage
      navigate('/blogs');
    }
  }, [navigate]);

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { title, description, image, author, createdAt, content } = blog;
  
  const date = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <button 
        onClick={() => navigate('/')}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Blogs
      </button>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <div className="h-80 overflow-hidden">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
          
          <div className="flex items-center mb-6 border-b border-gray-200 pb-4">
            <div className="flex-shrink-0">
              <img 
                src={author.profilePicture || "https://via.placeholder.com/40"} 
                alt={author.username} 
                className="h-10 w-10 rounded-full"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{author.username}</p>
              <p className="text-sm text-gray-500">{date}</p>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <div className="text-lg text-gray-700 mb-6 font-medium">{description}</div>
            
            <div className="text-gray-700">
              {content ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <p className="text-gray-600 italic">No additional content available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogView;