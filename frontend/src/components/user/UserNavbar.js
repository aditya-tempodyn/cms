import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserNavbar.css';

const UserNavbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    navigate('/user/articles');
  };

  return (
    <nav className="user-navbar">
      <div className="user-navbar-container">
        <div className="user-navbar-brand">
          <Link to="/user/articles" className="user-navbar-logo">
            📖 Content Hub
          </Link>
        </div>

        <div className="user-navbar-menu">
          <Link to="/user/articles" className="user-navbar-link">
            Articles
          </Link>
          {user.id && (
            <Link to="/user/dashboard" className="user-navbar-link">
              Dashboard
            </Link>
          )}
        </div>

        <div className="user-navbar-auth">
          {user.id ? (
            <div className="user-navbar-user">
              <span className="user-navbar-username">Welcome, {user.firstName || user.username}</span>
              <button onClick={handleLogout} className="user-navbar-logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="user-navbar-auth-buttons">
              <Link to="/user/login" className="user-navbar-login">
                Login
              </Link>
              <Link to="/user/register" className="user-navbar-register">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar; 