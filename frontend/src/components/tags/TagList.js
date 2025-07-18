import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tagService } from '../../services/apiService';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import { showNotification } from '../common/NotificationComponent';
import './TagList.css';

const TagList = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    name: '',
    search: ''
  });

  useEffect(() => {
    loadTags();
  }, [currentPage, filters]);

  const loadTags = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        size: 12,
        sortBy: 'name',
        sortDir: 'asc',
        ...filters
      };

      const response = await tagService.getAll(params);
      
      if (response.data.success) {
        setTags(response.data.data.content || []);
        setTotalPages(response.data.data.totalPages || 0);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
      showNotification('Failed to load tags', 'error');
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
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      search: ''
    });
    setCurrentPage(0);
  };

  const handleDelete = async (id, tagName) => {
    if (window.confirm(`Are you sure you want to delete the tag "${tagName}"? This action cannot be undone.`)) {
      try {
        const response = await tagService.delete(id);
        if (response.data.success) {
          showNotification('Tag deleted successfully', 'success');
          loadTags();
        }
      } catch (error) {
        console.error('Error deleting tag:', error);
        showNotification(error.response?.data?.message || 'Failed to delete tag', 'error');
      }
    }
  };

  const getContrastColor = (hexColor) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  if (loading && tags.length === 0) {
    return <div className="loading">Loading tags...</div>;
  }

  return (
    <div className="tag-list">
      <div className="page-header">
        <div className="header-content">
          <h1>Tags</h1>
          <p>Organize your content with custom tags</p>
        </div>
        <Link to="/tags/new">
          <Button variant="primary">
            🏷️ New Tag
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
            placeholder="Search tags..."
          />
          
          <FormInput
            type="text"
            name="name"
            label="Name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Filter by name..."
          />
          
          <div className="filter-actions">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Tags Grid */}
      <div className="tags-container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : tags.length > 0 ? (
          <div className="tags-grid">
            {tags.map(tag => (
              <div 
                key={tag.id} 
                className="tag-card"
                style={{ borderColor: tag.color }}
              >
                <div className="tag-header">
                  <div 
                    className="tag-color-preview"
                    style={{ backgroundColor: tag.color }}
                  >
                    <span 
                      className="tag-name"
                      style={{ color: getContrastColor(tag.color) }}
                    >
                      {tag.name}
                    </span>
                  </div>
                </div>
                
                <div className="tag-info">
                  {tag.description && (
                    <p className="tag-description">
                      {tag.description}
                    </p>
                  )}
                  
                  <div className="tag-stats">
                    <span className="stat-item">
                      📊 {tag.usageCount || 0} articles
                    </span>
                    <span className="stat-item">
                      🔥 {tag.popularityScore || 0} popularity
                    </span>
                  </div>
                  
                  {tag.createdAt && (
                    <div className="tag-meta">
                      <span className="created-date">
                        📅 Created: {new Date(tag.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="tag-actions">
                  <Link to={`/tags/${tag.id}/edit`}>
                    <Button variant="outline" size="small">
                      Edit
                    </Button>
                  </Link>
                  <Button 
                    variant="danger" 
                    size="small"
                    onClick={() => handleDelete(tag.id, tag.name)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🏷️</div>
            <h3>No tags found</h3>
            <p>Get started by creating your first tag to organize your content</p>
            <Link to="/tags/new">
              <Button variant="primary">
                Create Tag
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <Button 
            variant="outline" 
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </Button>
          
          <span className="pagination-info">
            Page {currentPage + 1} of {totalPages}
          </span>
          
          <Button 
            variant="outline" 
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Tag Statistics Summary */}
      {tags.length > 0 && (
        <div className="tags-summary">
          <h3>Tag Statistics</h3>
          <div className="summary-stats">
            <div className="summary-item">
              <strong>{tags.length}</strong>
              <span>Total Tags</span>
            </div>
            <div className="summary-item">
              <strong>{tags.reduce((sum, tag) => sum + (tag.usageCount || 0), 0)}</strong>
              <span>Total Usage</span>
            </div>
            <div className="summary-item">
              <strong>{tags.reduce((sum, tag) => sum + (tag.popularityScore || 0), 0)}</strong>
              <span>Total Popularity</span>
            </div>
            <div className="summary-item">
              <strong>{Math.round(tags.reduce((sum, tag) => sum + (tag.usageCount || 0), 0) / tags.length) || 0}</strong>
              <span>Avg Usage</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagList; 