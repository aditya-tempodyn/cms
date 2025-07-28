import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import ArticleList from './components/articles/ArticleList';
import ArticleForm from './components/articles/ArticleForm';
import ArticleView from './components/articles/ArticleView';
import TagList from './components/tags/TagList';
import TagForm from './components/tags/TagForm';
import ScheduleList from './components/schedules/ScheduleList';
import ScheduleForm from './components/schedules/ScheduleForm';
import Navbar from './components/layout/Navbar';
import NotificationComponent from './components/common/NotificationComponent';

// New User App Components
import AppSelector from './components/user/AppSelector';
import UserApp from './components/user/UserApp';
import UserLogin from './components/user/UserLogin';
import UserRegister from './components/user/UserRegister';
import UserArticleList from './components/user/UserArticleList';
import UserArticleView from './components/user/UserArticleView';
import UserNavbar from './components/user/UserNavbar';

import './App.css';

// Protected Route component for Admin App
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated() ? children : <Navigate to="/admin/login" />;
};

// Protected Route component for User App
const UserProtectedRoute = ({ children }) => {
  const userToken = localStorage.getItem('userToken');
  return userToken ? children : <Navigate to="/user/login" />;
};

function App() {
  const [selectedApp, setSelectedApp] = useState(null);

  // If no app is selected, show the app selector
  if (!selectedApp) {
    return <AppSelector onSelectApp={setSelectedApp} />;
  }

  // If admin app is selected, show the existing admin interface
  if (selectedApp === 'admin') {
    return (
      <AuthProvider>
        <Router>
          <div className="App">
            <NotificationComponent />
            <AdminAppContent />
          </div>
        </Router>
      </AuthProvider>
    );
  }

  // If user app is selected, show the new user interface
  if (selectedApp === 'user') {
    return (
      <Router>
        <div className="App">
          <UserApp />
        </div>
      </Router>
    );
  }

  return null;
}

const AdminAppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated() && <Navbar />}
      <main className={isAuthenticated() ? 'main-content' : 'auth-content'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/articles"
            element={
              <ProtectedRoute>
                <ArticleList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/articles/new"
            element={
              <ProtectedRoute>
                <ArticleForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/articles/:id/edit"
            element={
              <ProtectedRoute>
                <ArticleForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/articles/:id"
            element={
              <ProtectedRoute>
                <ArticleView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tags"
            element={
              <ProtectedRoute>
                <TagList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tags/new"
            element={
              <ProtectedRoute>
                <TagForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tags/:id/edit"
            element={
              <ProtectedRoute>
                <TagForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/schedules"
            element={
              <ProtectedRoute>
                <ScheduleList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/schedules/new"
            element={
              <ProtectedRoute>
                <ScheduleForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/schedules/:id/edit"
            element={
              <ProtectedRoute>
                <ScheduleForm />
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </main>
    </>
  );
};

export default App; 