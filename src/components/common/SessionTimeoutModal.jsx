import React from 'react';
import { FiClock, FiLogOut, FiRefreshCw } from 'react-icons/fi';
import '../styles/SessionTimeoutModal.css';

const SessionTimeoutModal = ({ 
  isVisible, 
  timeLeft, 
  onExtendSession, 
  onLogout 
}) => {
  if (!isVisible) return null;

  return (
    <div className="session-timeout-overlay">
      <div className="session-timeout-modal">
        <div className="session-timeout-header">
          <div className="session-timeout-icon">
            <FiClock />
          </div>
          <h3>Session Timeout Warning</h3>
        </div>
        
        <div className="session-timeout-content">
          <p>
            You have been inactive for 4 minutes. Your session will expire in{' '}
            <span className="session-timeout-countdown">{timeLeft}</span> seconds.
          </p>
          <p className="session-timeout-subtitle">
            Click "Stay Logged In" to continue your session, or you will be automatically logged out.
          </p>
        </div>
        
        <div className="session-timeout-actions">
          <button 
            className="session-timeout-btn session-timeout-btn-primary"
            onClick={onExtendSession}
          >
            <FiRefreshCw />
            Stay Logged In
          </button>
          <button 
            className="session-timeout-btn session-timeout-btn-secondary"
            onClick={onLogout}
          >
            <FiLogOut />
            Log Out Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutModal;
