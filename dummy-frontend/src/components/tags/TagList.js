import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tagService } from '../../services/mockApiService';
import Button from '../common/Button';
import { showNotification } from '../common/NotificationComponent';

const TagList = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const response = await tagService.getAll({ size: 100 });
      if (response.data.success) {
        setTags(response.data.data.content || []);
      }
    } catch (error) {
      showNotification('Failed to load tags', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        await tagService.delete(id);
        showNotification('Tag deleted successfully', 'success');
        loadTags();
      } catch (error) {
        showNotification('Failed to delete tag', 'error');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading tags...</div>;
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <h1>Tags</h1>
          <p>Organize your content with tags</p>
        </div>
        <Link to="/tags/new">
          <Button variant="primary">🏷️ New Tag</Button>
        </Link>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        {tags.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {tags.map(tag => (
              <div key={tag.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: tag.color
                    }}
                  />
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{tag.name}</h3>
                </div>
                
                {tag.description && (
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>{tag.description}</p>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#999' }}>
                    Created {new Date(tag.createdAt).toLocaleDateString()}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/tags/${tag.id}/edit`}>
                      <Button variant="outline" size="small">Edit</Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(tag.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No tags found</h3>
            <p>Create your first tag to organize your content!</p>
            <Link to="/tags/new">
              <Button variant="primary">Create Tag</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagList; 