import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService } from '../../services/apiService';
import './UserArticleView.css';

const UserArticleView = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const response = await articleService.getById(id);
      
      // Handle the backend response structure
      const responseData = response.data.data || response.data;
      setArticle(responseData);
      setError(null);
    } catch (err) {
      setError('Failed to load article. Please try again.');
      console.error('Error loading article:', err);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="user-article-view">
        <div className="user-article-view-container">
          <div className="loading-spinner">Loading article...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-article-view">
        <div className="user-article-view-container">
          <div className="user-article-error">
            <p>{error}</p>
            <button onClick={loadArticle} className="retry-button">
              Try Again
            </button>
            <Link to="/user/articles" className="back-button">
              ← Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="user-article-view">
        <div className="user-article-view-container">
          <div className="user-article-not-found">
            <h2>Article Not Found</h2>
            <p>The article you're looking for doesn't exist or has been removed.</p>
            <Link to="/user/articles" className="back-button">
              ← Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-article-view">
      <div className="user-article-view-container">
        {/* Back Button */}
        <div className="user-article-back">
          <Link to="/user/articles" className="back-link">
            ← Back to Articles
          </Link>
        </div>

        {/* Article Header */}
        <article className="user-article-content">
          <header className="user-article-header">
            <h1 className="user-article-title">{article.title}</h1>
            
            <div className="user-article-meta">
              <div className="user-article-author">
                <span className="author-label">By</span>
                <span className="author-name">
                  {article.author?.firstName} {article.author?.lastName}
                </span>
              </div>
              
              <div className="user-article-info">
                <span className="publish-date">
                  📅 Published on {formatDate(article.publishedAt)}
                </span>
                <span className="view-count">
                  👁️ {article.viewCount || 0} views
                </span>
              </div>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="user-article-tags">
                {article.tags.map((tag) => (
                  <span key={tag.id} className="user-article-tag">
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Featured Image */}
          {article.featuredImageUrl && (
            <div className="user-article-featured-image">
              <img src={article.featuredImageUrl} alt={article.title} />
            </div>
          )}

          {/* Article Summary */}
          {article.summary && (
            <div className="user-article-summary">
              <p>{article.summary}</p>
            </div>
          )}

          {/* Article Content */}
          <div className="user-article-body">
            <div 
              className="user-article-text"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Article Footer */}
          <footer className="user-article-footer">
            <div className="user-article-stats">
              <span className="stat-item">
                📅 Created: {formatDate(article.createdAt)}
              </span>
              {article.updatedAt !== article.createdAt && (
                <span className="stat-item">
                  ✏️ Updated: {formatDate(article.updatedAt)}
                </span>
              )}
            </div>
          </footer>
        </article>

        {/* Related Articles Section */}
        <div className="user-article-related">
          <h3>More Articles</h3>
          <Link to="/user/articles" className="browse-more-button">
            Browse All Articles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserArticleView; 