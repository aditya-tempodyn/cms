import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { scheduleService, articleService } from '../../services/mockApiService';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import { showNotification } from '../common/NotificationComponent';

const ScheduleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    articleId: '',
    scheduledDate: ''
  });
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadArticles();
    if (isEditing) {
      loadSchedule();
    }
  }, [id, isEditing]);

  const loadArticles = async () => {
    try {
      const response = await articleService.getAll({ size: 100, status: 'DRAFT' });
      if (response.data.success) {
        setArticles(response.data.data.content || []);
      }
    } catch (error) {
      console.error('Failed to load articles:', error);
    }
  };

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const response = await scheduleService.getById(id);
      if (response.data.success) {
        const schedule = response.data.data;
        setFormData({
          articleId: schedule.articleId.toString(),
          scheduledDate: new Date(schedule.scheduledDate).toISOString().slice(0, 16)
        });
      }
    } catch (error) {
      showNotification('Failed to load schedule', 'error');
      navigate('/schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.articleId) newErrors.articleId = 'Please select an article';
    if (!formData.scheduledDate) newErrors.scheduledDate = 'Please select a date and time';
    
    // Check if date is in the future
    if (formData.scheduledDate && new Date(formData.scheduledDate) <= new Date()) {
      newErrors.scheduledDate = 'Scheduled date must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const scheduleData = {
        articleId: parseInt(formData.articleId),
        scheduledDate: new Date(formData.scheduledDate).toISOString()
      };

      if (isEditing) {
        await scheduleService.update(id, scheduleData);
        showNotification('Schedule updated successfully', 'success');
      } else {
        await scheduleService.create(scheduleData);
        showNotification('Schedule created successfully', 'success');
      }
      navigate('/schedules');
    } catch (error) {
      showNotification('Failed to save schedule', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Set minimum date to current date/time
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1>{isEditing ? 'Edit Schedule' : 'Create New Schedule'}</h1>
        <p>Schedule an article to be published at a specific date and time.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <div className="form-input-group">
          <label className="form-label required">Article</label>
          <select
            name="articleId"
            value={formData.articleId}
            onChange={handleChange}
            className={`form-input ${errors.articleId ? 'error' : ''}`}
          >
            <option value="">Select an article to schedule</option>
            {articles.map(article => (
              <option key={article.id} value={article.id}>
                {article.title}
              </option>
            ))}
          </select>
          {errors.articleId && <span className="form-error">{errors.articleId}</span>}
        </div>

        <FormInput
          type="datetime-local"
          name="scheduledDate"
          label="Scheduled Date & Time"
          value={formData.scheduledDate}
          onChange={handleChange}
          error={errors.scheduledDate}
          min={getMinDateTime()}
          required
        />

        {formData.scheduledDate && (
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '20px' }}>
            <strong>Preview:</strong> This article will be published on{' '}
            <strong>
              {new Date(formData.scheduledDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </strong>
          </div>
        )}

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/schedules')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Schedule' : 'Create Schedule')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm; 