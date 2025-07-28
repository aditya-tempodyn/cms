import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../../services/apiService';
import './UserDashboard.css';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    loadRecentArticles();
  }, []);

  const loadUserData = () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  };

  const loadRecentArticles = async () => {
    try {
      const response = await articleService.getPublished({ page: 0, size: 5 });
      
      // Handle the backend response structure
      const responseData = response.data.data || response.data;
      setRecentArticles(responseData.content || []);
    } catch (err) {
      console.error('Error loading recent articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="user-dashboard-container">
          <div className="loading-spinner">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="user-dashboard-container">
        {/* Welcome Section */}
        <div className="user-dashboard-header">
          <h1>Welcome back, {user?.firstName || user?.username}!</h1>
          <p>Here's what's new in your reading world</p>
        </div>

        {/* Quick Actions */}
        <div className="user-dashboard-actions">
          <Link to="/user/articles" className="dashboard-action-card">
            <div className="action-icon">📖</div>
            <h3>Browse Articles</h3>
            <p>Discover new content</p>
          </Link>
          
          <Link to="/user/articles" className="dashboard-action-card">
            <div className="action-icon">🔍</div>
            <h3>Search Content</h3>
            <p>Find what interests you</p>
          </Link>
        </div>

        {/* Recent Articles */}
        <div className="user-dashboard-section">
          <h2>Recent Articles</h2>
          <div className="recent-articles-grid">
            {recentArticles.map((article) => (
              <div key={article.id} className="recent-article-card">
                <h3>
                  <Link to={`/user/articles/${article.id}`}>
                    {article.title}
                  </Link>
                </h3>
                <p className="article-summary">
                  {article.summary?.substring(0, 100)}...
                </p>
                <div className="article-meta">
                  <span className="article-date">
                    📅 {formatDate(article.publishedAt)}
                  </span>
                  <span className="article-views">
                    👁️ {article.viewCount || 0} views
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="view-all-articles">
            <Link to="/user/articles" className="view-all-button">
              View All Articles
            </Link>
          </div>
        </div>

        {/* User Info */}
        <div className="user-dashboard-section">
          <h2>Your Account</h2>
          <div className="user-info-card">
            <div className="user-info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <div className="user-info-item">
              <span className="info-label">Username:</span>
              <span className="info-value">{user?.username}</span>
            </div>
            <div className="user-info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="user-info-item">
              <span className="info-label">Member since:</span>
              <span className="info-value">
                {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 