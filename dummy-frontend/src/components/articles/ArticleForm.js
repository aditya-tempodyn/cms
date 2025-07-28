import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { articleService, tagService } from '../../services/mockApiService';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import { showNotification } from '../common/NotificationComponent';

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
          title: article.title,
          summary: article.summary,
          content: article.content,
          status: article.status,
          tags: article.tags || []
        });
        setSelectedTags(article.tags || []);
      }
    } catch (error) {
      showNotification('Failed to load article', 'error');
      navigate('/articles');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => {
      const isSelected = prev.some(t => t.id === tag.id);
      if (isSelected) {
        return prev.filter(t => t.id !== tag.id);
      } else {
        return [...prev, tag];
      }
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.content.trim()) errors.content = 'Content is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const articleData = {
        ...formData,
        tags: selectedTags
      };
      
      if (isEditing) {
        await articleService.update(id, articleData);
        showNotification('Article updated successfully', 'success');
      } else {
        await articleService.create(articleData);
        showNotification('Article created successfully', 'success');
      }
      
      navigate('/articles');
    } catch (error) {
      showNotification('Failed to save article', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="loading">Loading article...</div>;
  }

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1>{isEditing ? 'Edit Article' : 'Create New Article'}</h1>
        <p>Fill in the details below to {isEditing ? 'update' : 'create'} your article.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <FormInput
          type="text"
          name="title"
          label="Title"
          value={formData.title}
          onChange={handleChange}
          error={validationErrors.title}
          placeholder="Enter article title"
          required
        />

        <FormInput
          type="textarea"
          name="summary"
          label="Summary"
          value={formData.summary}
          onChange={handleChange}
          placeholder="Brief summary of the article"
          rows={3}
        />

        <FormInput
          type="textarea"
          name="content"
          label="Content"
          value={formData.content}
          onChange={handleChange}
          error={validationErrors.content}
          placeholder="Write your article content here..."
          rows={10}
          required
        />

        <div className="form-input-group">
          <label className="form-label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-input"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>

        <div className="form-input-group">
          <label className="form-label">Tags</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {availableTags.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag)}
                style={{
                  padding: '6px 12px',
                  border: selectedTags.some(t => t.id === tag.id) ? '2px solid #007bff' : '1px solid #ddd',
                  backgroundColor: selectedTags.some(t => t.id === tag.id) ? tag.color : 'white',
                  color: selectedTags.some(t => t.id === tag.id) ? 'white' : '#333',
                  borderRadius: '16px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px' }}>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/articles')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Article' : 'Create Article')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm; 