# Session Timeout Implementation

## Overview
The application now includes a 5-minute session timeout feature that automatically logs out users after 5 minutes of inactivity (AFK - Away From Keyboard).

## How It Works

### 1. Activity Detection
The system monitors the following user activities:
- Mouse movements (`mousemove`)
- Mouse clicks (`mousedown`, `click`)
- Keyboard presses (`keypress`)
- Scrolling (`scroll`)
- Touch events (`touchstart`)

### 2. Timeout Timeline
- **0-4 minutes**: Normal operation, timers reset on any activity
- **4 minutes**: Warning modal appears with 60-second countdown
- **5 minutes**: Automatic logout if no activity

### 3. User Options
When the warning modal appears, users can:
- **Stay Logged In**: Extends the session for another 5 minutes
- **Log Out Now**: Immediately logs out without waiting

## Files Added

### Core Implementation
- `src/hooks/useSessionTimeout.js` - Main timeout logic and activity detection
- `src/components/common/SessionTimeoutModal.jsx` - Warning modal component
- `src/components/styles/SessionTimeoutModal.css` - Modal styling

### Integration
- `src/App.jsx` - Integrated session timeout for authenticated users
- `src/components/common/SessionTimeoutTest.jsx` - Testing component (optional)

## Configuration

### Timeout Settings
```javascript
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
const WARNING_TIME = 4 * 60 * 1000; // 4 minutes - show warning 1 minute before logout
```

### Customization
To modify the timeout duration, update the constants in `src/hooks/useSessionTimeout.js`:
- `SESSION_TIMEOUT`: Total time before logout
- `WARNING_TIME`: When to show the warning modal

## Testing

### Manual Testing
1. Log into the application
2. Wait 4 minutes without any activity
3. Warning modal should appear with 60-second countdown
4. Test both "Stay Logged In" and "Log Out Now" buttons

### Test Component
For development/testing, you can temporarily add the `SessionTimeoutTest` component to any screen:
```jsx
import SessionTimeoutTest from './components/common/SessionTimeoutTest';

// Add to your component's render method
<SessionTimeoutTest />
```

## Security Features

### Automatic Cleanup
- Clears all timers on component unmount
- Prevents memory leaks
- Handles edge cases gracefully

### Supabase Integration
- Properly signs out from Supabase
- Clears local storage and session storage
- Forces page reload to ensure clean state

### Activity Reset
- Any detected activity resets the entire timeout
- Prevents false timeouts during active use
- Responsive to all user interactions

## Browser Compatibility
- Works in all modern browsers
- Uses standard DOM events
- No external dependencies beyond React

## Notes
- Only active for authenticated users
- Not shown on login page
- Modal has high z-index (9999) to appear above all content
- Responsive design for mobile devices
