import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleService, tagService, scheduleService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import Button from './common/Button';
import { showNotification } from './common/NotificationComponent';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalTags: 0,
    pendingSchedules: 0
  });
  const [recentArticles, setRecentArticles] = useState([]);
  const [mostViewedArticles, setMostViewedArticles] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load statistics
      const [
        articlesResponse,
        publishedResponse,
        tagsResponse,
        schedulesResponse,
        mostViewedResponse,
        popularTagsResponse
      ] = await Promise.all([
        articleService.getAll({ size: 1 }),
        articleService.getPublished({ size: 1 }),
        tagService.getAll({ size: 1 }),
        scheduleService.getAll({ status: 'PENDING', size: 1 }),
        articleService.getMostViewed(),
        tagService.getPopular(5)
      ]);

      // Set statistics
      setStats({
        totalArticles: articlesResponse.data.data.totalElements || 0,
        publishedArticles: publishedResponse.data.data.totalElements || 0,
        draftArticles: (articlesResponse.data.data.totalElements || 0) - (publishedResponse.data.data.totalElements || 0),
        totalTags: tagsResponse.data.data.totalElements || 0,
        pendingSchedules: schedulesResponse.data.data.totalElements || 0
      });

      // Set most viewed articles
      if (mostViewedResponse.data.success) {
        setMostViewedArticles(mostViewedResponse.data.data || []);
      }

      // Set popular tags
      if (popularTagsResponse.data.success) {
        setPopularTags(popularTagsResponse.data.data || []);
      }

      // Load recent articles
      const recentResponse = await articleService.getAll({ 
        size: 5, 
        sortBy: 'createdAt', 
        sortDir: 'desc' 
      });
      
      if (recentResponse.data.success) {
        setRecentArticles(recentResponse.data.data.content || []);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showNotification('Failed to load dashboard data', 'error');
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

  const getStatusBadge = (status) => {
    const statusClasses = {
      PUBLISHED: 'status-published',
      DRAFT: 'status-draft',
      ARCHIVED: 'status-archived'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || ''}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.username}!</h1>
        <p>Here's what's happening with your content publishing system.</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.totalArticles}</h3>
            <p>Total Articles</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.publishedArticles}</h3>
            <p>Published</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <h3>{stats.draftArticles}</h3>
            <p>Drafts</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <h3>{stats.totalTags}</h3>
            <p>Tags</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>{stats.pendingSchedules}</h3>
            <p>Pending Schedules</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Recent Articles */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Articles</h2>
            <Link to="/admin/articles">
              <Button variant="outline" size="small">
                View All
              </Button>
            </Link>
          </div>
          <div className="articles-list">
            {recentArticles.length > 0 ? (
              recentArticles.map(article => (
                <div key={article.id} className="article-item">
                  <div className="article-info">
                    <h4>
                      <Link to={`/admin/articles/${article.id}`} className="article-link">
                        {article.title}
                      </Link>
                    </h4>
                    <p className="article-meta">
                      {getStatusBadge(article.status)} • 
                      Created {formatDate(article.createdAt)} • 
                      {article.viewCount} views
                    </p>
                  </div>
                  <div className="article-actions">
                    <Link to={`/admin/articles/${article.id}/edit`}>
                      <Button variant="outline" size="small">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No articles yet. <Link to="/admin/articles/new">Create your first article</Link></p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Popular Tags */}
        <div className="dashboard-sidebar">
          {/* Quick Actions */}
          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <Link to="/admin/articles/new">
                <Button variant="primary" fullWidth>
                  📝 New Article
                </Button>
              </Link>
              <Link to="/admin/tags/new">
                <Button variant="secondary" fullWidth>
                  🏷️ Create Tag
                </Button>
              </Link>
              <Link to="/admin/schedules/new">
                <Button variant="outline" fullWidth>
                  ⏰ Schedule Publication
                </Button>
              </Link>
            </div>
          </div>

          {/* Most Viewed Articles */}
          <div className="dashboard-section">
            <h2>Most Viewed Articles</h2>
            <div className="popular-list">
              {mostViewedArticles.length > 0 ? (
                mostViewedArticles.map((article, index) => (
                  <div key={article.id} className="popular-item">
                    <span className="rank">#{index + 1}</span>
                    <div className="item-info">
                      <Link to={`/admin/articles/${article.id}`} className="item-title">
                        {article.title}
                      </Link>
                      <span className="item-meta">{article.viewCount} views</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-text">No articles with views yet</p>
              )}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="dashboard-section">
            <h2>Popular Tags</h2>
            <div className="tags-list">
              {popularTags.length > 0 ? (
                popularTags.map(tag => (
                  <span 
                    key={tag.id} 
                    className="tag-chip"
                    style={{ backgroundColor: tag.colorCode || '#667eea' }}
                  >
                    {tag.name}
                  </span>
                ))
              ) : (
                <p className="empty-text">No tags created yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 