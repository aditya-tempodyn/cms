import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { articleService, tagService } from '../../services/apiService';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import { showNotification } from '../common/NotificationComponent';
import './ArticleForm.css';

const ArticleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    status: 'DRAFT',
    tags: []
  });

  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    loadTags();
    if (isEditing) {
      loadArticle();
    }
  }, [id, isEditing]);

  const loadTags = async () => {
    try {
      const response = await tagService.getAll({ page: 0, size: 100 });
      if (response.data.success) {
        setAvailableTags(response.data.data.content || []);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const loadArticle = async () => {
    try {
      setLoading(true);
      const response = await articleService.getById(id);
      if (response.data.success) {
        const article = response.data.data;
        setFormData({
          title: article.title || '',
          summary: article.summary || '',
          content: article.content || '',
          status: article.status || 'DRAFT',
          tags: article.tags || []
        });
        setSelectedTags(article.tags || []);
      }
    } catch (error) {
      console.error('Error loading article:', error);
      showNotification('Failed to load article', 'error');
      navigate('/articles');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTagToggle = (tag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    
    if (isSelected) {
      setSelectedTags(prev => prev.filter(t => t.id !== tag.id));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 200) {
      errors.title = 'Title must be less than 200 characters';
    }

    if (!formData.summary.trim()) {
      errors.summary = 'Summary is required';
    } else if (formData.summary.length < 10) {
      errors.summary = 'Summary must be at least 10 characters';
    } else if (formData.summary.length > 500) {
      errors.summary = 'Summary must be less than 500 characters';
    }

    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    } else if (formData.content.length < 50) {
      errors.content = 'Content must be at least 50 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('Please fix the validation errors', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        tags: selectedTags
      };

      let response;
      if (isEditing) {
        response = await articleService.update(id, submitData);
      } else {
        response = await articleService.create(submitData);
      }

      if (response.data.success) {
        showNotification(
          `Article ${isEditing ? 'updated' : 'created'} successfully`, 
          'success'
        );
        navigate('/articles');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      showNotification(
        error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} article`, 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    const originalStatus = formData.status;
    setFormData(prev => ({ ...prev, status: 'DRAFT' }));
    
    // Create a temporary form submission
    const event = { preventDefault: () => {} };
    await handleSubmit(event);
    
    // Restore original status if save failed
    setFormData(prev => ({ ...prev, status: originalStatus }));
  };

  const handleCancel = () => {
    navigate('/articles');
  };

  if (loading && isEditing) {
    return <div className="loading">Loading article...</div>;
  }

  return (
    <div className="article-form">
      <div className="page-header">
        <div className="header-content">
          <h1>{isEditing ? 'Edit Article' : 'Create New Article'}</h1>
          <p>{isEditing ? 'Update your article content' : 'Share your thoughts with the world'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
          <div className="main-content">
            <FormInput
              type="text"
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleInputChange}
              error={validationErrors.title}
              placeholder="Enter article title..."
              required
            />

            <div className="form-input-group">
              <label className="form-label">Summary</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                className={`form-input summary-input ${validationErrors.summary ? 'error' : ''}`}
                placeholder="Brief summary of your article..."
                rows="3"
                maxLength="500"
              />
              <div className="input-meta">
                <span className={`char-count ${formData.summary.length > 450 ? 'warning' : ''}`}>
                  {formData.summary.length}/500
                </span>
              </div>
              {validationErrors.summary && (
                <div className="form-error">{validationErrors.summary}</div>
              )}
            </div>

            <div className="form-input-group">
              <label className="form-label">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className={`form-input content-input ${validationErrors.content ? 'error' : ''}`}
                placeholder="Write your article content here..."
                rows="15"
              />
              <div className="input-meta">
                <span className="char-count">
                  {formData.content.length} characters
                </span>
              </div>
              {validationErrors.content && (
                <div className="form-error">{validationErrors.content}</div>
              )}
            </div>
          </div>

          <div className="sidebar">
            <div className="form-section">
              <h3>Publish Settings</h3>
              
              <div className="form-input-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>Tags</h3>
              <div className="tags-container">
                {availableTags.length > 0 ? (
                  availableTags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      className={`tag-button ${selectedTags.some(t => t.id === tag.id) ? 'selected' : ''}`}
                      onClick={() => handleTagToggle(tag)}
                      style={{
                        backgroundColor: selectedTags.some(t => t.id === tag.id) ? tag.color : 'transparent',
                        borderColor: tag.color,
                        color: selectedTags.some(t => t.id === tag.id) ? '#fff' : tag.color
                      }}
                    >
                      {tag.name}
                    </button>
                  ))
                ) : (
                  <div className="no-tags">
                    <p>No tags available</p>
                    <Button variant="outline" size="small" onClick={() => navigate('/tags')}>
                      Create Tags
                    </Button>
                  </div>
                )}
              </div>
              
              {selectedTags.length > 0 && (
                <div className="selected-tags">
                  <label className="form-label">Selected Tags:</label>
                  <div className="selected-tags-list">
                    {selectedTags.map(tag => (
                      <span
                        key={tag.id}
                        className="selected-tag"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                        <button
                          type="button"
                          className="remove-tag"
                          onClick={() => handleTagToggle(tag)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <div className="action-group">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            
            {formData.status !== 'DRAFT' && (
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleSaveAsDraft}
                disabled={loading}
              >
                Save as Draft
              </Button>
            )}
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading}
            loading={loading}
          >
            {isEditing ? 'Update Article' : 'Create Article'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm; 