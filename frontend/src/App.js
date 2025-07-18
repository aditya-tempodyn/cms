import React from 'react';
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
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NotificationComponent />
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated() && <Navbar />}
      <main className={isAuthenticated() ? 'main-content' : 'auth-content'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/articles"
            element={
              <ProtectedRoute>
                <ArticleList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/articles/new"
            element={
              <ProtectedRoute>
                <ArticleForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/articles/:id/edit"
            element={
              <ProtectedRoute>
                <ArticleForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/articles/:id"
            element={
              <ProtectedRoute>
                <ArticleView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tags"
            element={
              <ProtectedRoute>
                <TagList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tags/new"
            element={
              <ProtectedRoute>
                <TagForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tags/:id/edit"
            element={
              <ProtectedRoute>
                <TagForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedules"
            element={
              <ProtectedRoute>
                <ScheduleList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedules/new"
            element={
              <ProtectedRoute>
                <ScheduleForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedules/:id/edit"
            element={
              <ProtectedRoute>
                <ScheduleForm />
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
};

export default App; 