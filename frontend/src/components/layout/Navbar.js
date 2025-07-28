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
    navigate('/admin/login');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/admin/dashboard" className="brand-link">
          <h2>CPS</h2>
          <span>Content Publishing System</span>
        </Link>
      </div>

      <div className="navbar-menu">
        <Link 
          to="/admin/dashboard" 
          className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
        >
          <span className="nav-icon">📊</span>
          Dashboard
        </Link>
        
        <Link 
          to="/admin/articles" 
          className={`nav-link ${isActive('/admin/articles') ? 'active' : ''}`}
        >
          <span className="nav-icon">📝</span>
          Articles
        </Link>
        
        <Link 
          to="/admin/tags" 
          className={`nav-link ${isActive('/admin/tags') ? 'active' : ''}`}
        >
          <span className="nav-icon">🏷️</span>
          Tags
        </Link>
        
        <Link 
          to="/admin/schedules" 
          className={`nav-link ${isActive('/admin/schedules') ? 'active' : ''}`}
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