import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/login.jsx';
import { Header } from './pages/header.jsx';
import { Footer } from './pages/footer.jsx';
import { Courses } from './pages/courses.jsx';
import { TicketsPage } from './pages/tickets.jsx';
import { FormedTest } from './pages/formedTest.jsx';
import { Admin } from './pages/admin.jsx';
import { UserInfo } from './pages/userInfo.jsx';
import { ProtectedRoute } from './components/req/protectedRoute.jsx';
import { loadState, saveState } from './store/persistence.js';

export const App = () => {
  useEffect(() => {
    loadState();
    window.addEventListener('beforeunload', saveState);
    return () => {
      window.addEventListener('beforeunload', saveState);
    };
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/courses"
          element={
            <ProtectedRoute requiredRole="USER">
              <Header />
              <Courses />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute requiredRole="USER">
              <Header />
              <TicketsPage />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test"
          element={
            <ProtectedRoute requiredRole="USER">
              <Header />
              <FormedTest />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <Header />
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-info"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <Header />
              <UserInfo />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};
