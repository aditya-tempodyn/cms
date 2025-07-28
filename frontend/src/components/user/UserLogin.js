import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserAuth.css';

const UserLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', formData);
      const { token, user } = response.data;

      // Store user token separately from admin token
      localStorage.setItem('userToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/user/articles');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-auth">
      <div className="user-auth-container">
        <div className="user-auth-card">
          <div className="user-auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue reading</p>
          </div>

          {error && (
            <div className="user-auth-error">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="user-auth-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="user-auth-button"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="user-auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/user/register" className="user-auth-link">
                Sign up here
              </Link>
            </p>
            <Link to="/user/articles" className="user-auth-link">
              Continue as guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin; 