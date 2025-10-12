// Navigation menu
// Page navigation components

import React from 'react';

const Navigation = () => {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h1>Admin Portal</h1>
      </div>
      <ul className="nav-menu">
        <li className="nav-item">
          <a href="/dashboard" className="nav-link">Dashboard</a>
        </li>
        <li className="nav-item">
          <a href="/admin" className="nav-link">Admin</a>
        </li>
        <li className="nav-item">
          <a href="/encoder" className="nav-link">Encoder</a>
        </li>
        <li className="nav-item">
          <a href="/viewer" className="nav-link">Viewer</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;