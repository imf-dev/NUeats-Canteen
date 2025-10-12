// Main layout with navigation
// Reusable UI components

import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="layout-header">
        {/* Navigation will be rendered here */}
      </header>
      <main className="layout-main">
        {children}
      </main>
      <footer className="layout-footer">
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default Layout;