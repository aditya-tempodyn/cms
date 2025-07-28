import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { articleService } from '../../services/mockApiService';
import Button from '../common/Button';
import { showNotification } from '../common/NotificationComponent';

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
      showNotification('Failed to load article', 'error');
      navigate('/articles');
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

  const getStatusBadge = (status) => {
    return <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>;
  };

  const formatContent = (content) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} style={{ marginBottom: '16px', lineHeight: '1.6' }}>
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
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <Link to="/articles">
          <Button variant="outline">← Back to Articles</Button>
        </Link>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to={`/articles/${article.id}/edit`}>
            <Button variant="primary">Edit Article</Button>
          </Link>
        </div>
      </div>

      <article style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <header style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            {getStatusBadge(article.status)}
            <span style={{ color: '#666', fontSize: '14px' }}>👁️ {article.viewCount || 0} views</span>
          </div>
          
          <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#333', marginBottom: '16px' }}>
            {article.title}
          </h1>
          
          {article.summary && (
            <div style={{ fontSize: '18px', color: '#666', marginBottom: '20px', fontStyle: 'italic' }}>
              {article.summary}
            </div>
          )}
          
          <div style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
            <span>📅 Created: {formatDate(article.createdAt)}</span>
            {article.publishedAt && (
              <span style={{ marginLeft: '20px' }}>🚀 Published: {formatDate(article.publishedAt)}</span>
            )}
          </div>
          
          {article.tags && article.tags.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ color: '#666', fontSize: '14px' }}>🏷️ Tags:</span>
              {article.tags.map(tag => (
                <span
                  key={tag.id}
                  className="tag"
                  style={{ 
                    backgroundColor: tag.color,
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </header>

        <main style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
          {formatContent(article.content)}
        </main>
      </article>
    </div>
  );
};

export default ArticleView; 