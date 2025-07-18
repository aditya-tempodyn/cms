import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tagService } from '../../services/apiService';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import { showNotification } from '../common/NotificationComponent';
import './TagForm.css';

const TagForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3498db'
  });

  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Predefined color options
  const colorOptions = [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#2c3e50',
    '#8e44ad', '#16a085', '#27ae60', '#f1c40f', '#d35400',
    '#c0392b', '#7f8c8d', '#2980b9', '#17a2b8', '#28a745',
    '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997'
  ];

  useEffect(() => {
    if (isEditing) {
      loadTag();
    }
  }, [id, isEditing]);

  const loadTag = async () => {
    try {
      setLoading(true);
      const response = await tagService.getById(id);
      if (response.data.success) {
        const tag = response.data.data;
        setFormData({
          name: tag.name || '',
          description: tag.description || '',
          color: tag.color || '#3498db'
        });
      }
    } catch (error) {
      console.error('Error loading tag:', error);
      showNotification('Failed to load tag', 'error');
      navigate('/tags');
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

  const handleColorSelect = (color) => {
    setFormData(prev => ({
      ...prev,
      color
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Tag name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Tag name must be at least 2 characters';
    } else if (formData.name.length > 50) {
      errors.name = 'Tag name must be less than 50 characters';
    } else if (!/^[a-zA-Z0-9\s-_]+$/.test(formData.name)) {
      errors.name = 'Tag name can only contain letters, numbers, spaces, hyphens, and underscores';
    }

    if (formData.description && formData.description.length > 200) {
      errors.description = 'Description must be less than 200 characters';
    }

    if (!formData.color || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(formData.color)) {
      errors.color = 'Please select a valid color';
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
      
      let response;
      if (isEditing) {
        response = await tagService.update(id, formData);
      } else {
        response = await tagService.create(formData);
      }

      if (response.data.success) {
        showNotification(
          `Tag ${isEditing ? 'updated' : 'created'} successfully`, 
          'success'
        );
        navigate('/tags');
      }
    } catch (error) {
      console.error('Error saving tag:', error);
      const errorMessage = error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} tag`;
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/tags');
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

  if (loading && isEditing) {
    return <div className="loading">Loading tag...</div>;
  }

  return (
    <div className="tag-form">
      <div className="page-header">
        <div className="header-content">
          <h1>{isEditing ? 'Edit Tag' : 'Create New Tag'}</h1>
          <p>{isEditing ? 'Update tag information' : 'Add a new tag to organize your content'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-container">
          <div className="form-main">
            <FormInput
              type="text"
              name="name"
              label="Tag Name"
              value={formData.name}
              onChange={handleInputChange}
              error={validationErrors.name}
              placeholder="Enter tag name..."
              required
            />

            <div className="form-input-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`form-input ${validationErrors.description ? 'error' : ''}`}
                placeholder="Brief description of this tag..."
                rows="3"
                maxLength="200"
              />
              <div className="input-meta">
                <span className={`char-count ${formData.description.length > 180 ? 'warning' : ''}`}>
                  {formData.description.length}/200
                </span>
              </div>
              {validationErrors.description && (
                <div className="form-error">{validationErrors.description}</div>
              )}
            </div>

            <div className="form-input-group">
              <label className="form-label">Color</label>
              
              {/* Custom Color Input */}
              <div className="color-input-container">
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="color-picker"
                />
                <FormInput
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  error={validationErrors.color}
                  placeholder="#3498db"
                  className="color-text-input"
                />
              </div>
              
              {/* Predefined Colors */}
              <div className="color-options">
                <span className="color-options-label">Quick Colors:</span>
                <div className="color-grid">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`color-option ${formData.color === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorSelect(color)}
                      title={color}
                    >
                      {formData.color === color && (
                        <span 
                          className="checkmark"
                          style={{ color: getContrastColor(color) }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="form-preview">
            <h3>Preview</h3>
            <div className="tag-preview-container">
              <div 
                className="tag-preview"
                style={{ 
                  backgroundColor: formData.color,
                  color: getContrastColor(formData.color)
                }}
              >
                <div className="preview-header">
                  <span className="preview-name">
                    {formData.name || 'Tag Name'}
                  </span>
                </div>
                {formData.description && (
                  <div className="preview-description">
                    {formData.description}
                  </div>
                )}
                <div className="preview-meta">
                  Color: {formData.color}
                </div>
              </div>
              
              {/* Example usage */}
              <div className="usage-examples">
                <h4>How it will appear:</h4>
                <div className="example-contexts">
                  <div className="example-item">
                    <span className="example-label">In articles:</span>
                    <span 
                      className="example-tag"
                      style={{ 
                        backgroundColor: formData.color,
                        color: getContrastColor(formData.color)
                      }}
                    >
                      {formData.name || 'Tag'}
                    </span>
                  </div>
                  <div className="example-item">
                    <span className="example-label">As button:</span>
                    <button 
                      className="example-button"
                      style={{ 
                        borderColor: formData.color,
                        color: formData.color
                      }}
                    >
                      {formData.name || 'Tag'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading}
            loading={loading}
          >
            {isEditing ? 'Update Tag' : 'Create Tag'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TagForm; 