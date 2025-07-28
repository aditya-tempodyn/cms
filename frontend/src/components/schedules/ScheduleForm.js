import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { scheduleService, articleService } from '../../services/apiService';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import { showNotification } from '../common/NotificationComponent';
import './ScheduleForm.css';

const ScheduleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    articleId: '',
    scheduledAt: '',
    description: ''
  });

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    loadArticles();
    if (isEditing) {
      loadSchedule();
    }
  }, [id, isEditing]);

  const loadArticles = async () => {
    try {
      const response = await articleService.getAll({ 
        page: 0, 
        size: 100, 
        status: 'DRAFT' // Only draft articles can be scheduled
      });
      if (response.data.success) {
        setArticles(response.data.data.content || []);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
    }
  };

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const response = await scheduleService.getById(id);
      if (response.data.success) {
        const schedule = response.data.data;
        setFormData({
          articleId: schedule.article?.id || '',
          scheduledAt: schedule.scheduledAt ? 
            new Date(schedule.scheduledAt).toISOString().slice(0, 16) : '',
          description: schedule.description || ''
        });
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
      showNotification('Failed to load schedule', 'error');
      navigate('/schedules');
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

  const validateForm = () => {
    const errors = {};

    if (!formData.articleId) {
      errors.articleId = 'Please select an article to schedule';
    }

    if (!formData.scheduledAt) {
      errors.scheduledAt = 'Scheduled date and time is required';
    } else {
      const scheduledDate = new Date(formData.scheduledAt);
      const now = new Date();
      
      if (scheduledDate <= now) {
        errors.scheduledAt = 'Scheduled time must be in the future';
      }
      
      // Check if it's more than 1 year in the future
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      
      if (scheduledDate > oneYearFromNow) {
        errors.scheduledAt = 'Scheduled time cannot be more than 1 year in the future';
      }
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
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
        articleId: parseInt(formData.articleId),
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
        description: formData.description || null
      };

      let response;
      if (isEditing) {
        response = await scheduleService.update(id, submitData);
      } else {
        response = await scheduleService.create(submitData);
      }

      if (response.data.success) {
        showNotification(
          `Schedule ${isEditing ? 'updated' : 'created'} successfully`, 
          'success'
        );
        navigate('/schedules');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      const errorMessage = error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} schedule`;
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/schedules');
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // Minimum 5 minutes from now
    return now.toISOString().slice(0, 16);
  };

  const getMaxDateTime = () => {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    return oneYearFromNow.toISOString().slice(0, 16);
  };

  const formatSchedulePreview = () => {
    if (!formData.scheduledAt) return null;
    
    const scheduledDate = new Date(formData.scheduledAt);
    const now = new Date();
    const diff = scheduledDate - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    let timeUntil = '';
    if (days > 0) {
      timeUntil = `${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      timeUntil = `${hours} hour${hours > 1 ? 's' : ''}, ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      timeUntil = `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    
    return {
      formatted: scheduledDate.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      timeUntil
    };
  };

  const selectedArticle = articles.find(article => article.id === parseInt(formData.articleId));
  const schedulePreview = formatSchedulePreview();

  if (loading && isEditing) {
    return <div className="loading">Loading schedule...</div>;
  }

  return (
    <div className="schedule-form">
      <div className="page-header">
        <div className="header-content">
          <h1>{isEditing ? 'Edit Schedule' : 'Create New Schedule'}</h1>
          <p>{isEditing ? 'Update scheduling information' : 'Schedule an article for automatic publishing'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-container">
          <div className="form-main">
            <div className="form-input-group">
              <label className="form-label">Article to Schedule</label>
              <select
                name="articleId"
                value={formData.articleId}
                onChange={handleInputChange}
                className={`form-input ${validationErrors.articleId ? 'error' : ''}`}
                required
              >
                <option value="">Select an article...</option>
                {articles.map(article => (
                  <option key={article.id} value={article.id}>
                    {article.title}
                  </option>
                ))}
              </select>
              {validationErrors.articleId && (
                <div className="form-error">{validationErrors.articleId}</div>
              )}
              {articles.length === 0 && (
                <div className="form-help">
                  No draft articles available. <a href="/articles/new">Create an article</a> first.
                </div>
              )}
            </div>

            <FormInput
              type="datetime-local"
              name="scheduledAt"
              label="Scheduled Date & Time"
              value={formData.scheduledAt}
              onChange={handleInputChange}
              error={validationErrors.scheduledAt}
              min={getMinDateTime()}
              max={getMaxDateTime()}
              required
            />

            <div className="form-input-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`form-input ${validationErrors.description ? 'error' : ''}`}
                placeholder="Optional description for this schedule..."
                rows="3"
                maxLength="500"
              />
              <div className="input-meta">
                <span className={`char-count ${formData.description.length > 450 ? 'warning' : ''}`}>
                  {formData.description.length}/500
                </span>
              </div>
              {validationErrors.description && (
                <div className="form-error">{validationErrors.description}</div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="form-preview">
            <h3>Schedule Preview</h3>
            
            <div className="preview-container">
              {selectedArticle ? (
                <div className="article-preview">
                  <h4>Selected Article</h4>
                  <div className="article-card">
                    <h5>{selectedArticle.title}</h5>
                    {selectedArticle.summary && (
                      <p className="article-summary">
                        {selectedArticle.summary.substring(0, 150)}
                        {selectedArticle.summary.length > 150 && '...'}
                      </p>
                    )}
                    <div className="article-meta">
                      <span>Status: {selectedArticle.status}</span>
                      <span>Created: {new Date(selectedArticle.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-article">
                  <p>Select an article to see preview</p>
                </div>
              )}

              {schedulePreview && (
                <div className="schedule-preview">
                  <h4>Scheduling Details</h4>
                  <div className="schedule-card">
                    <div className="schedule-info">
                      <strong>Publish Date:</strong>
                      <span>{schedulePreview.formatted}</span>
                    </div>
                    <div className="schedule-info">
                      <strong>Time Until:</strong>
                      <span className="time-until">{schedulePreview.timeUntil}</span>
                    </div>
                    {formData.description && (
                      <div className="schedule-info">
                        <strong>Description:</strong>
                        <span>{formData.description}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="schedule-tips">
                <h4>Tips</h4>
                <ul>
                  <li>Only DRAFT articles can be scheduled</li>
                  <li>Schedule at least 5 minutes in the future</li>
                  <li>The system will automatically retry failed publishes</li>
                  <li>You can cancel or modify schedules before execution</li>
                </ul>
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
            {isEditing ? 'Update Schedule' : 'Create Schedule'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm; 