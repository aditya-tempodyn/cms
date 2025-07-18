import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { articleService } from '../../services/apiService';
import Button from '../common/Button';
import { showNotification } from '../common/NotificationComponent';
import './ArticleView.css';

const ArticleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const response = await articleService.getById(id);
      
      if (response.data.success) {
        setArticle(response.data.data);
      } else {
        showNotification('Article not found', 'error');
        navigate('/articles');
      }
    } catch (error) {
      console.error('Error loading article:', error);
      if (error.response?.status === 404) {
        showNotification('Article not found', 'error');
      } else {
        showNotification('Failed to load article', 'error');
      }
      navigate('/articles');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      const response = await articleService.publish(id);
      if (response.data.success) {
        showNotification('Article published successfully', 'success');
        loadArticle(); // Refresh to show updated status
      }
    } catch (error) {
      console.error('Error publishing article:', error);
      showNotification(error.response?.data?.message || 'Failed to publish article', 'error');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      try {
        const response = await articleService.delete(id);
        if (response.data.success) {
          showNotification('Article deleted successfully', 'success');
          navigate('/articles');
        }
      } catch (error) {
        console.error('Error deleting article:', error);
        showNotification(error.response?.data?.message || 'Failed to delete article', 'error');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const formatContent = (content) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="content-paragraph">
        {paragraph}
      </p>
    ));
  };

  if (loading) {
    return <div className="loading">Loading article...</div>;
  }

  if (!article) {
    return (
      <div className="error-state">
        <h2>Article Not Found</h2>
        <p>The article you're looking for doesn't exist or has been removed.</p>
        <Link to="/articles">
          <Button variant="primary">Back to Articles</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="article-view">
      {/* Navigation */}
      <div className="article-nav">
        <Link to="/articles" className="back-link">
          ← Back to Articles
        </Link>
        
        <div className="article-actions">
          <Link to={`/articles/${id}/edit`}>
            <Button variant="outline" size="small">
              ✏️ Edit
            </Button>
          </Link>
          
          {article.status === 'DRAFT' && (
            <Button 
              variant="success" 
              size="small"
              onClick={handlePublish}
            >
              📤 Publish
            </Button>
          )}
          
          <Button 
            variant="danger" 
            size="small"
            onClick={handleDelete}
          >
            🗑️ Delete
          </Button>
        </div>
      </div>

      {/* Article Header */}
      <header className="article-header">
        <div className="article-meta">
          {getStatusBadge(article.status)}
          <span className="view-count">👁️ {article.viewCount || 0} views</span>
        </div>
        
        <h1 className="article-title">{article.title}</h1>
        
        {article.summary && (
          <div className="article-summary">
            {article.summary}
          </div>
        )}
        
        <div className="article-info">
          <div className="date-info">
            <span className="created-date">
              📅 Created: {formatDate(article.createdAt)}
            </span>
            {article.updatedAt && article.updatedAt !== article.createdAt && (
              <span className="updated-date">
                🔄 Updated: {formatDate(article.updatedAt)}
              </span>
            )}
            {article.publishedAt && (
              <span className="published-date">
                🚀 Published: {formatDate(article.publishedAt)}
              </span>
            )}
          </div>
          
          {article.tags && article.tags.length > 0 && (
            <div className="article-tags">
              <span className="tags-label">🏷️ Tags:</span>
              <div className="tags-list">
                {article.tags.map(tag => (
                  <span
                    key={tag.id}
                    className="tag"
                    style={{ 
                      backgroundColor: tag.color,
                      color: '#fff'
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Article Content */}
      <main className="article-content">
        <div className="content-body">
          {formatContent(article.content)}
        </div>
      </main>

      {/* Article Footer */}
      <footer className="article-footer">
        <div className="footer-stats">
          <div className="stat-item">
            <strong>Word Count:</strong> {article.content ? article.content.split(/\s+/).length : 0}
          </div>
          <div className="stat-item">
            <strong>Character Count:</strong> {article.content ? article.content.length : 0}
          </div>
          <div className="stat-item">
            <strong>Reading Time:</strong> ~{Math.ceil((article.content ? article.content.split(/\s+/).length : 0) / 200)} min
          </div>
        </div>
        
        <div className="footer-actions">
          <Link to={`/articles/${id}/edit`}>
            <Button variant="primary">
              Edit Article
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default ArticleView; 