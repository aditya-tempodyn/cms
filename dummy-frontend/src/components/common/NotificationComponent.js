import React, { useState, useEffect } from 'react';
import './NotificationComponent.css';

let notificationEmitter = null;

export const showNotification = (message, type = 'info', title = null, duration = 5000) => {
  if (notificationEmitter) {
    notificationEmitter({
      id: Date.now() + Math.random(),
      message,
      type,
      title,
      duration
    });
  }
};

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    notificationEmitter = (notification) => {
      setNotifications(prev => [...prev, notification]);

      // Auto remove after duration
      setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);
    };

    return () => {
      notificationEmitter = null;
    };
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  const getTitle = (type, customTitle) => {
    if (customTitle) return customTitle;
    
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
      default:
        return 'Info';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-icon">
            {getIcon(notification.type)}
          </div>
          <div className="notification-content">
            <div className="notification-title">
              {getTitle(notification.type, notification.title)}
            </div>
            <div className="notification-message">
              {notification.message}
            </div>
          </div>
          <button
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationComponent; 