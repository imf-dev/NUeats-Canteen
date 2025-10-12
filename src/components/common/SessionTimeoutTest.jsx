import React, { useState } from 'react';
import { useSessionTimeout } from '../../hooks/useSessionTimeout';

// This component is for testing purposes only
// You can temporarily add it to any screen to test session timeout
const SessionTimeoutTest = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isWarningVisible, timeLeft, extendSession, handleLogout } = useSessionTimeout();

  if (!isVisible) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        background: '#3b82f6',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
      }} onClick={() => setIsVisible(true)}>
        Test Session Timeout
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      minWidth: '250px'
    }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#1f2937' }}>
        Session Timeout Test
      </h4>
      
      <div style={{ marginBottom: '12px', fontSize: '14px', color: '#6b7280' }}>
        <div>Warning Visible: {isWarningVisible ? 'Yes' : 'No'}</div>
        <div>Time Left: {timeLeft}s</div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={extendSession}
          style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Extend Session
        </button>
        
        <button
          onClick={handleLogout}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Force Logout
        </button>
        
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: '#6b7280',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Hide
        </button>
      </div>
    </div>
  );
};

export default SessionTimeoutTest;
