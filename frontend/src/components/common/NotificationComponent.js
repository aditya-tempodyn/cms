import React, { useState, useEffect } from 'react';
import './NotificationComponent.css';

let addNotification;

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    addNotification = (message, type = 'info', duration = 5000) => {
      const id = Date.now();
      const notification = { id, message, type, duration };
      
      setNotifications(prev => [...prev, notification]);
      
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    };
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
          onClick={() => removeNotification(notification.id)}
        >
          <span className="notification-message">{notification.message}</span>
          <button
            className="notification-close"
            onClick={(e) => {
              e.stopPropagation();
              removeNotification(notification.id);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

// Export function to trigger notifications from anywhere
export const showNotification = (message, type, duration) => {
  if (addNotification) {
    addNotification(message, type, duration);
  }
};

export default NotificationComponent; 