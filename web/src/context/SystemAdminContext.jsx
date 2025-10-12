import React, { createContext, useContext, useReducer, useEffect } from 'react';

// System Admin Context for managing system-wide settings and state
const SystemAdminContext = createContext();

// System admin reducer
const systemAdminReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_SYSTEM_SETTINGS':
      return {
        ...state,
        systemSettings: action.payload,
        isLoading: false
      };
    case 'UPDATE_SETTING':
      return {
        ...state,
        systemSettings: {
          ...state.systemSettings,
          [action.payload.key]: action.payload.value
        }
      };
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
        isLoading: false
      };
    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, action.payload]
      };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        )
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };
    case 'SET_SYSTEM_STATS':
      return {
        ...state,
        systemStats: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Initial system admin state
const initialState = {
  systemSettings: {
    maintenanceMode: false,
    maxUsers: 1000,
    systemName: 'Admin Portal',
    version: '1.0.0',
    debugMode: false
  },
  users: [],
  systemStats: {
    totalUsers: 0,
    activeUsers: 0,
    systemUptime: 0,
    memoryUsage: 0,
    cpuUsage: 0
  },
  isLoading: false,
  error: null
};

// System Admin Provider Component
export const SystemAdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(systemAdminReducer, initialState);

  // Load system data on mount
  useEffect(() => {
    loadSystemData();
  }, []);

  // Load system settings and data
  const loadSystemData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API calls - replace with actual API endpoints
      const [settingsResponse, usersResponse, statsResponse] = await Promise.all([
        fetch('/api/admin/settings'),
        fetch('/api/admin/users'),
        fetch('/api/admin/stats')
      ]);

      // For demo purposes, using mock data
      const mockSettings = {
        maintenanceMode: false,
        maxUsers: 1000,
        systemName: 'Admin Portal',
        version: '1.0.0',
        debugMode: false
      };

      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', active: true },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'encoder', active: true },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'viewer', active: false }
      ];

      const mockStats = {
        totalUsers: 150,
        activeUsers: 45,
        systemUptime: 99.9,
        memoryUsage: 65,
        cpuUsage: 23
      };

      dispatch({ type: 'SET_SYSTEM_SETTINGS', payload: mockSettings });
      dispatch({ type: 'SET_USERS', payload: mockUsers });
      dispatch({ type: 'SET_SYSTEM_STATS', payload: mockStats });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  // Update system setting
  const updateSystemSetting = async (key, value) => {
    try {
      // Simulate API call
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      });

      dispatch({
        type: 'UPDATE_SETTING',
        payload: { key, value }
      });

      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Add new user
  const addUser = async (userData) => {
    try {
      // Simulate API call
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const newUser = await response.json();
      dispatch({ type: 'ADD_USER', payload: newUser });

      return { success: true, user: newUser };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Update user
  const updateUser = async (userId, userData) => {
    try {
      // Simulate API call
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const updatedUser = await response.json();
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });

      return { success: true, user: updatedUser };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      // Simulate API call
      await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });

      dispatch({ type: 'DELETE_USER', payload: userId });

      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Refresh system stats
  const refreshStats = async () => {
    try {
      // Simulate API call
      const mockStats = {
        totalUsers: Math.floor(Math.random() * 200) + 100,
        activeUsers: Math.floor(Math.random() * 50) + 20,
        systemUptime: 99.9,
        memoryUsage: Math.floor(Math.random() * 40) + 50,
        cpuUsage: Math.floor(Math.random() * 30) + 10
      };

      dispatch({ type: 'SET_SYSTEM_STATS', payload: mockStats });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const value = {
    ...state,
    updateSystemSetting,
    addUser,
    updateUser,
    deleteUser,
    clearError,
    refreshStats,
    loadSystemData
  };

  return (
    <SystemAdminContext.Provider value={value}>
      {children}
    </SystemAdminContext.Provider>
  );
};

// Custom hook to use system admin context
export const useSystemAdmin = () => {
  const context = useContext(SystemAdminContext);
  if (!context) {
    throw new Error('useSystemAdmin must be used within a SystemAdminProvider');
  }
  return context;
};

export default SystemAdminContext;