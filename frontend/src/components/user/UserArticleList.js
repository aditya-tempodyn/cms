import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../../services/apiService';
import './UserArticleList.css';

const UserArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('publishedAt');
  const [sortDir, setSortDir] = useState('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    loadArticles();
  }, [currentPage, sortBy, sortDir, searchTerm]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDir,
        search: searchTerm
      };

      console.log('Loading articles with params:', params);
      const response = await articleService.getPublished(params);
      console.log('Articles response:', response.data);
      
      // Handle the backend response structure
      const responseData = response.data.data || response.data;
      setArticles(responseData.content || []);
      setTotalPages(responseData.totalPages || 0);
      setTotalElements(responseData.totalElements || 0);
      setError(null);
    } catch (err) {
      console.error('Error loading articles:', err);
      setError('Failed to load articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
    setCurrentPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (loading && (!articles || articles.length === 0)) {
    return (
      <div className="user-article-list">
        <div className="user-article-list-container">
          <div className="loading-spinner">Loading articles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-article-list">
      <div className="user-article-list-container">
        {/* Header */}
        <div className="user-article-list-header">
          <h1>Published Articles</h1>
          <p>Discover amazing content from our writers</p>
        </div>

        {/* Search and Filters */}
        <div className="user-article-list-controls">
          <form onSubmit={handleSearch} className="user-article-search">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="user-article-search-input"
            />
            <button type="submit" className="user-article-search-button">
              🔍 Search
            </button>
          </form>

          <div className="user-article-sort">
            <span>Sort by:</span>
            <button
              className={`sort-button ${sortBy === 'publishedAt' ? 'active' : ''}`}
              onClick={() => handleSort('publishedAt')}
            >
              Date {sortBy === 'publishedAt' && (sortDir === 'asc' ? '↑' : '↓')}
            </button>
            <button
              className={`sort-button ${sortBy === 'title' ? 'active' : ''}`}
              onClick={() => handleSort('title')}
            >
              Title {sortBy === 'title' && (sortDir === 'asc' ? '↑' : '↓')}
            </button>
            <button
              className={`sort-button ${sortBy === 'viewCount' ? 'active' : ''}`}
              onClick={() => handleSort('viewCount')}
            >
              Views {sortBy === 'viewCount' && (sortDir === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        {/* Results Info */}
        {!loading && articles && (
          <div className="user-article-results-info">
            <p>Showing {articles.length} of {totalElements} articles</p>
          </div>
        )}

        {/* Articles Grid */}
        {error && (
          <div className="user-article-error">
            <p>{error}</p>
            <button onClick={loadArticles} className="retry-button">
              Try Again
            </button>
          </div>
        )}

        {!error && articles && (
          <div className="user-article-grid">
            {articles.map((article) => (
              <div key={article.id} className="user-article-card">
                {article.featuredImageUrl && (
                  <div className="user-article-image">
                    <img src={article.featuredImageUrl} alt={article.title} />
                  </div>
                )}
                <div className="user-article-content">
                  <h2 className="user-article-title">
                    <Link to={`/user/articles/${article.id}`}>
                      {article.title}
                    </Link>
                  </h2>
                  <p className="user-article-summary">
                    {truncateText(article.summary || article.content)}
                  </p>
                  <div className="user-article-meta">
                    <span className="user-article-date">
                      📅 {formatDate(article.publishedAt)}
                    </span>
                    <span className="user-article-views">
                      👁️ {article.viewCount || 0} views
                    </span>
                  </div>
                  {article.tags && article.tags.length > 0 && (
                    <div className="user-article-tags">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span key={tag.id} className="user-article-tag">
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="user-article-pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
              className="pagination-button"
            >
              ← Previous
            </button>
            <span className="pagination-info">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="pagination-button"
            >
              Next →
            </button>
          </div>
        )}

        {!loading && articles && articles.length === 0 && !error && (
          <div className="user-article-empty">
            <p>No articles found. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserArticleList; 