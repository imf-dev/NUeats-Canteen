import React, { useState } from 'react';
import { LoginForm } from '../components/Forms.jsx';

const LoginScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (formData) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Login logic will be implemented here
      console.log('Login attempt:', formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to dashboard on success
      // This will be handled by routing logic
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        <h1>Admin Portal Login</h1>
        {error && <div className="error-message">{error}</div>}
        <LoginForm onSubmit={handleLogin} />
        {isLoading && <div className="loading">Logging in...</div>}
      </div>
    </div>
  );
};

export default LoginScreen;