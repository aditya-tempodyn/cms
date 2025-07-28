import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tagService } from '../../services/mockApiService';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import { showNotification } from '../common/NotificationComponent';

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
  const [errors, setErrors] = useState({});

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
        setFormData(response.data.data);
      }
    } catch (error) {
      showNotification('Failed to load tag', 'error');
      navigate('/tags');
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
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isEditing) {
        await tagService.update(id, formData);
        showNotification('Tag updated successfully', 'success');
      } else {
        await tagService.create(formData);
        showNotification('Tag created successfully', 'success');
      }
      navigate('/tags');
    } catch (error) {
      showNotification('Failed to save tag', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1>{isEditing ? 'Edit Tag' : 'Create New Tag'}</h1>
        <p>Tags help organize and categorize your content.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <FormInput
          type="text"
          name="name"
          label="Tag Name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Enter tag name"
          required
        />

        <FormInput
          type="textarea"
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Optional description for this tag"
          rows={3}
        />

        <div className="form-input-group">
          <label className="form-label">Color</label>
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="form-input"
            style={{ height: '44px', width: '100px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <span>Preview:</span>
          <span
            style={{
              backgroundColor: formData.color,
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            {formData.name || 'Tag Name'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/tags')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Tag' : 'Create Tag')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TagForm; 