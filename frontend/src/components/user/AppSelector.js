import React from 'react';
import './AppSelector.css';

const AppSelector = ({ onSelectApp }) => {
  return (
    <div className="app-selector">
      <div className="app-selector-container">
        <h1 className="app-selector-title">Content Hub</h1>
        <p className="app-selector-subtitle">Choose your experience</p>
        
        <div className="app-options">
          <div className="app-option" onClick={() => onSelectApp('user')}>
            <div className="app-option-icon">📖</div>
            <h2>User App</h2>
            <p>Read articles, search content, and explore published stories</p>
            <div className="app-option-features">
              <span>• Browse Articles</span>
              <span>• Search & Filter</span>
              <span>• Read Content</span>
              <span>• User Account</span>
            </div>
          </div>
          
          <div className="app-option" onClick={() => onSelectApp('admin')}>
            <div className="app-option-icon">⚙️</div>
            <h2>Admin App</h2>
            <p>Manage content, create articles, and control the publishing system</p>
            <div className="app-option-features">
              <span>• Create Articles</span>
              <span>• Manage Content</span>
              <span>• User Management</span>
              <span>• Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSelector; 