import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { scheduleService } from '../../services/apiService';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import { showNotification } from '../common/NotificationComponent';
import './ScheduleList.css';

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });

  useEffect(() => {
    loadSchedules();
  }, [currentPage, filters]);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        size: 10,
        sortBy: 'scheduledAt',
        sortDir: 'asc',
        ...filters
      };

      const response = await scheduleService.getAll(params);
      
      if (response.data.success) {
        setSchedules(response.data.data.content || []);
        setTotalPages(response.data.data.totalPages || 0);
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
      showNotification('Failed to load schedules', 'error');
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
      status: '',
      search: ''
    });
    setCurrentPage(0);
  };

  const handleExecute = async (id) => {
    if (window.confirm('Are you sure you want to execute this schedule now?')) {
      try {
        const response = await scheduleService.execute(id);
        if (response.data.success) {
          showNotification('Schedule executed successfully', 'success');
          loadSchedules();
        }
      } catch (error) {
        console.error('Error executing schedule:', error);
        showNotification(error.response?.data?.message || 'Failed to execute schedule', 'error');
      }
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this schedule?')) {
      try {
        const response = await scheduleService.cancel(id);
        if (response.data.success) {
          showNotification('Schedule cancelled successfully', 'success');
          loadSchedules();
        }
      } catch (error) {
        console.error('Error cancelling schedule:', error);
        showNotification(error.response?.data?.message || 'Failed to cancel schedule', 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this schedule? This action cannot be undone.')) {
      try {
        const response = await scheduleService.delete(id);
        if (response.data.success) {
          showNotification('Schedule deleted successfully', 'success');
          loadSchedules();
        }
      } catch (error) {
        console.error('Error deleting schedule:', error);
        showNotification(error.response?.data?.message || 'Failed to delete schedule', 'error');
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
    const statusClasses = {
      PENDING: 'status-pending',
      COMPLETED: 'status-completed',
      FAILED: 'status-failed',
      CANCELLED: 'status-cancelled'
    };
    
    const statusLabels = {
      PENDING: 'Pending',
      COMPLETED: 'Completed',
      FAILED: 'Failed',
      CANCELLED: 'Cancelled'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || ''}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const getTimeUntilSchedule = (scheduledAt) => {
    const now = new Date();
    const scheduled = new Date(scheduledAt);
    const diff = scheduled - now;
    
    if (diff < 0) {
      return 'Overdue';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  if (loading && schedules.length === 0) {
    return <div className="loading">Loading schedules...</div>;
  }

  return (
    <div className="schedule-list">
      <div className="page-header">
        <div className="header-content">
          <h1>Scheduled Publications</h1>
          <p>Manage your content publishing schedule</p>
        </div>
        <Link to="/schedules/new">
          <Button variant="primary">
            ⏰ New Schedule
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
            placeholder="Search schedules..."
          />
          
          <div className="form-input-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="form-input"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          
          <div className="filter-actions">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Schedules Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : schedules.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Article</th>
                <th>Scheduled For</th>
                <th>Status</th>
                <th>Time Remaining</th>
                <th>Retry Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map(schedule => (
                <tr key={schedule.id} className={`schedule-row status-${schedule.status.toLowerCase()}`}>
                  <td>
                    <div className="article-info">
                      {schedule.article ? (
                        <Link 
                          to={`/admin/articles/${schedule.article.id}`} 
                          className="article-link"
                        >
                          {schedule.article.title}
                        </Link>
                      ) : (
                        <span className="article-deleted">Article Deleted</span>
                      )}
                      {schedule.description && (
                        <div className="schedule-description">
                          {schedule.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="schedule-time">
                      <div className="scheduled-date">
                        {formatDate(schedule.scheduledAt)}
                      </div>
                      {schedule.status === 'PENDING' && (
                        <div className={`time-remaining ${getTimeUntilSchedule(schedule.scheduledAt) === 'Overdue' ? 'overdue' : ''}`}>
                          {getTimeUntilSchedule(schedule.scheduledAt)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{getStatusBadge(schedule.status)}</td>
                  <td>
                    <div className="time-info">
                      {schedule.status === 'PENDING' ? (
                        <span className={`countdown ${getTimeUntilSchedule(schedule.scheduledAt) === 'Overdue' ? 'overdue' : ''}`}>
                          {getTimeUntilSchedule(schedule.scheduledAt)}
                        </span>
                      ) : (
                        <span className="completed-time">
                          {schedule.executedAt ? formatDate(schedule.executedAt) : '-'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`retry-count ${schedule.retryCount > 0 ? 'has-retries' : ''}`}>
                      {schedule.retryCount}/3
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/admin/schedules/${schedule.id}/edit`}>
                        <Button variant="outline" size="small">
                          Edit
                        </Button>
                      </Link>
                      
                      {schedule.status === 'PENDING' && (
                        <>
                          <Button 
                            variant="success" 
                            size="small"
                            onClick={() => handleExecute(schedule.id)}
                          >
                            Execute Now
                          </Button>
                          <Button 
                            variant="warning" 
                            size="small"
                            onClick={() => handleCancel(schedule.id)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      
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
          <div className="empty-state">
            <div className="empty-icon">⏰</div>
            <h3>No schedules found</h3>
            <p>Create your first schedule to automatically publish articles</p>
            <Link to="/admin/schedules/new">
              <Button variant="primary">
                Create Schedule
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

      {/* Schedule Statistics */}
      {schedules.length > 0 && (
        <div className="schedule-stats">
          <h3>Schedule Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <strong>{schedules.filter(s => s.status === 'PENDING').length}</strong>
              <span>Pending</span>
            </div>
            <div className="stat-item">
              <strong>{schedules.filter(s => s.status === 'COMPLETED').length}</strong>
              <span>Completed</span>
            </div>
            <div className="stat-item">
              <strong>{schedules.filter(s => s.status === 'FAILED').length}</strong>
              <span>Failed</span>
            </div>
            <div className="stat-item">
              <strong>{schedules.filter(s => s.status === 'CANCELLED').length}</strong>
              <span>Cancelled</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleList; 