import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
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

      <div className="navbar-user">
        <div className="user-info">
          <span className="user-name">
            {user?.username}
          </span>
          <span className="user-role">
            {user?.roles?.[0]?.replace('ROLE_', '')}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="small" 
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar; 