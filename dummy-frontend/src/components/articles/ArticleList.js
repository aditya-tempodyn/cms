import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../../services/mockApiService';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import { showNotification } from '../common/NotificationComponent';
import './ArticleList.css';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    title: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    loadArticles();
  }, [currentPage, filters]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        size: 10,
        sortBy: 'createdAt',
        sortDir: 'desc',
        ...filters
      };

      const response = await articleService.getAll(params);
      
      if (response.data.success) {
        setArticles(response.data.data.content || []);
        setTotalPages(response.data.data.totalPages || 0);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      showNotification('Failed to load articles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(0); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilters({
      title: '',
      status: '',
      search: ''
    });
    setCurrentPage(0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await articleService.delete(id);
        showNotification('Article deleted successfully', 'success');
        loadArticles();
      } catch (error) {
        showNotification('Failed to delete article', 'error');
      }
    }
  };

  const handlePublish = async (id) => {
    try {
      await articleService.publish(id);
      showNotification('Article published successfully', 'success');
      loadArticles();
    } catch (error) {
      showNotification('Failed to publish article', 'error');
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
    return <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>;
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={currentPage === i ? 'active' : ''}
          onClick={() => setCurrentPage(i)}
        >
          {i + 1}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        {pages}
        <button
          disabled={currentPage === totalPages - 1}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading articles...</div>;
  }

  return (
    <div className="article-list">
      <div className="page-header">
        <div className="header-content">
          <h1>Articles</h1>
          <p>Manage your published content</p>
        </div>
        <Link to="/articles/new">
          <Button variant="primary">
            📝 New Article
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <FormInput
            type="text"
            name="search"
            label="Search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search articles..."
          />
          
          <FormInput
            type="text"
            name="title"
            label="Title"
            value={filters.title}
            onChange={handleFilterChange}
            placeholder="Filter by title..."
          />
          
          <div className="form-input-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="form-input"
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          
          <div className="filter-actions">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="articles-table">
        {articles.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Summary</th>
                <th>Status</th>
                <th>Tags</th>
                <th>Views</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id}>
                  <td>
                    <Link to={`/articles/${article.id}`} className="article-title">
                      {article.title}
                    </Link>
                  </td>
                  <td>
                    <div className="article-summary">{article.summary}</div>
                  </td>
                  <td>{getStatusBadge(article.status)}</td>
                  <td>
                    <div className="article-tags">
                      {article.tags.map(tag => (
                        <span
                          key={tag.id}
                          className="tag"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{article.viewCount || 0}</td>
                  <td>
                    <div className="article-meta">{formatDate(article.createdAt)}</div>
                  </td>
                  <td>
                    <div className="article-actions">
                      <Link to={`/articles/${article.id}/edit`}>
                        <Button variant="outline" size="small">Edit</Button>
                      </Link>
                      {article.status === 'DRAFT' && (
                        <Button
                          variant="success"
                          size="small"
                          onClick={() => handlePublish(article.id)}
                        >
                          Publish
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDelete(article.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <h3>No articles found</h3>
            <p>Create your first article to get started!</p>
            <Link to="/articles/new">
              <Button variant="primary">Create Article</Button>
            </Link>
          </div>
        )}
      </div>

      {renderPagination()}
    </div>
  );
};

export default ArticleList; 