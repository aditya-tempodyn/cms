import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { scheduleService } from '../../services/mockApiService';
import Button from '../common/Button';
import { showNotification } from '../common/NotificationComponent';

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const response = await scheduleService.getAll({ size: 100 });
      if (response.data.success) {
        setSchedules(response.data.data.content || []);
      }
    } catch (error) {
      showNotification('Failed to load schedules', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await scheduleService.delete(id);
        showNotification('Schedule deleted successfully', 'success');
        loadSchedules();
      } catch (error) {
        showNotification('Failed to delete schedule', 'error');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    return <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>;
  };

  if (loading) {
    return <div className="loading">Loading schedules...</div>;
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <h1>Publishing Schedules</h1>
          <p>Manage when your articles get published</p>
        </div>
        <Link to="/schedules/new">
          <Button variant="primary">⏰ New Schedule</Button>
        </Link>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
        {schedules.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Article</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Scheduled Date</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Created</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map(schedule => (
                <tr key={schedule.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}>
                    <div>
                      <div style={{ fontWeight: '500', color: '#333', marginBottom: '4px' }}>
                        {schedule.article?.title || 'Unknown Article'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        ID: {schedule.articleId}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '15px', color: '#333' }}>
                    {formatDate(schedule.scheduledDate)}
                  </td>
                  <td style={{ padding: '15px' }}>
                    {getStatusBadge(schedule.status)}
                  </td>
                  <td style={{ padding: '15px', color: '#666', fontSize: '14px' }}>
                    {formatDate(schedule.createdAt)}
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/schedules/${schedule.id}/edit`}>
                        <Button variant="outline" size="small">Edit</Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDelete(schedule.id)}
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
          <div className="empty-state" style={{ padding: '60px 20px' }}>
            <h3>No schedules found</h3>
            <p>Schedule your first article for publication!</p>
            <Link to="/schedules/new">
              <Button variant="primary">Create Schedule</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleList; 