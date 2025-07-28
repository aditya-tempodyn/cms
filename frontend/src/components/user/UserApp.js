import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserNavbar from './UserNavbar';
import UserArticleList from './UserArticleList';
import UserArticleView from './UserArticleView';
import UserLogin from './UserLogin';
import UserRegister from './UserRegister';
import UserDashboard from './UserDashboard';

const UserApp = () => {
  const userToken = localStorage.getItem('userToken');
  const isAuthenticated = !!userToken;

  return (
    <div className="user-app">
      {isAuthenticated && <UserNavbar />}
      <main className={isAuthenticated ? 'user-main-content' : 'user-auth-content'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/user/articles" element={<UserArticleList />} />
          <Route path="/user/articles/:id" element={<UserArticleView />} />

          {/* Protected Routes */}
          <Route
            path="/user/dashboard"
            element={
              isAuthenticated ? <UserDashboard /> : <Navigate to="/user/login" />
            }
          />

          {/* Default route - redirect to articles */}
          <Route path="/user" element={<Navigate to="/user/articles" />} />
          <Route path="*" element={<Navigate to="/user/articles" />} />
        </Routes>
      </main>
    </div>
  );
};

export default UserApp; 