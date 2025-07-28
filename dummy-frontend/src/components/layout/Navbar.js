import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getUserInitials = (username) => {
    return username ? username.substring(0, 2).toUpperCase() : 'U';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard" className="brand-link">
          <h2>CPS</h2>
          <span>Content Publishing System</span>
        </Link>
      </div>

      <div className="navbar-menu">
        <Link 
          to="/dashboard" 
          className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
        >
          <span className="nav-icon">📊</span>
          Dashboard
        </Link>
        
        <Link 
          to="/articles" 
          className={`nav-link ${isActive('/articles') ? 'active' : ''}`}
        >
          <span className="nav-icon">📝</span>
          Articles
        </Link>
        
        <Link 
          to="/tags" 
          className={`nav-link ${isActive('/tags') ? 'active' : ''}`}
        >
          <span className="nav-icon">🏷️</span>
          Tags
        </Link>
        
        <Link 
          to="/schedules" 
          className={`nav-link ${isActive('/schedules') ? 'active' : ''}`}
        >
          <span className="nav-icon">⏰</span>
          Schedules
        </Link>
      </div>

      <div className="navbar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {getUserInitials(user?.username)}
          </div>
          <div className="user-details">
            <h4>{user?.username || 'User'}</h4>
            <p>{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        
        <button 
          className="logout-button"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 