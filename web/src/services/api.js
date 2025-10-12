// API calls
// Service layer for handling HTTP requests and API communication

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// API request helper function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get auth token from localStorage
  const token = localStorage.getItem('authToken');
  
  // Default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };

  // Merge default options with provided options
  const config = {
    headers: defaultHeaders,
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  // Login user
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // Logout user
  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST'
    });
  },

  // Register new user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Verify token
  verifyToken: async () => {
    return apiRequest('/auth/verify');
  },

  // Reset password
  resetPassword: async (email) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }
};

// User management API calls
export const userAPI = {
  // Get all users
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/users${queryString ? `?${queryString}` : ''}`);
  },

  // Get user by ID
  getUserById: async (userId) => {
    return apiRequest(`/users/${userId}`);
  },

  // Create new user
  createUser: async (userData) => {
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Update user
  updateUser: async (userId, userData) => {
    return apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },

  // Delete user
  deleteUser: async (userId) => {
    return apiRequest(`/users/${userId}`, {
      method: 'DELETE'
    });
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }
};

// System administration API calls
export const systemAPI = {
  // Get system settings
  getSettings: async () => {
    return apiRequest('/admin/settings');
  },

  // Update system settings
  updateSettings: async (settings) => {
    return apiRequest('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  },

  // Get system statistics
  getStats: async () => {
    return apiRequest('/admin/stats');
  },

  // Get system logs
  getLogs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/logs${queryString ? `?${queryString}` : ''}`);
  },

  // Backup system
  createBackup: async () => {
    return apiRequest('/admin/backup', {
      method: 'POST'
    });
  },

  // Restore system
  restoreBackup: async (backupId) => {
    return apiRequest('/admin/restore', {
      method: 'POST',
      body: JSON.stringify({ backupId })
    });
  }
};

// Dashboard API calls
export const dashboardAPI = {
  // Get dashboard data
  getDashboardData: async (userRole) => {
    return apiRequest(`/dashboard/${userRole}`);
  },

  // Get analytics data
  getAnalytics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/dashboard/analytics${queryString ? `?${queryString}` : ''}`);
  }
};

// Encoding API calls (for encoder dashboard)
export const encodingAPI = {
  // Get encoding tasks
  getTasks: async () => {
    return apiRequest('/encoding/tasks');
  },

  // Create new encoding task
  createTask: async (taskData) => {
    return apiRequest('/encoding/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  },

  // Update task status
  updateTask: async (taskId, updates) => {
    return apiRequest(`/encoding/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  // Delete encoding task
  deleteTask: async (taskId) => {
    return apiRequest(`/encoding/tasks/${taskId}`, {
      method: 'DELETE'
    });
  },

  // Start encoding
  startEncoding: async (taskId) => {
    return apiRequest(`/encoding/tasks/${taskId}/start`, {
      method: 'POST'
    });
  },

  // Stop encoding
  stopEncoding: async (taskId) => {
    return apiRequest(`/encoding/tasks/${taskId}/stop`, {
      method: 'POST'
    });
  }
};

// Viewer API calls (for viewer dashboard)
export const viewerAPI = {
  // Get content list
  getContent: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/content${queryString ? `?${queryString}` : ''}`);
  },

  // Get content by ID
  getContentById: async (contentId) => {
    return apiRequest(`/content/${contentId}`);
  },

  // Get viewing statistics
  getViewingStats: async () => {
    return apiRequest('/viewer/stats');
  },

  // Get popular content
  getPopularContent: async (limit = 10) => {
    return apiRequest(`/viewer/popular?limit=${limit}`);
  },

  // Track view
  trackView: async (contentId, viewData) => {
    return apiRequest('/viewer/track', {
      method: 'POST',
      body: JSON.stringify({ contentId, ...viewData })
    });
  }
};

// File upload API calls
export const uploadAPI = {
  // Upload file
  uploadFile: async (file, onProgress = null) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('authToken');
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(percentComplete);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${API_BASE_URL}/upload`);
      
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      xhr.send(formData);
    });
  },

  // Delete file
  deleteFile: async (fileId) => {
    return apiRequest(`/upload/${fileId}`, {
      method: 'DELETE'
    });
  }
};

// Export all APIs
export default {
  auth: authAPI,
  user: userAPI,
  system: systemAPI,
  dashboard: dashboardAPI,
  encoding: encodingAPI,
  viewer: viewerAPI,
  upload: uploadAPI
};