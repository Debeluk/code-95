import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/login.jsx';
import { Header } from './pages/header.jsx';
import { Footer } from './pages/footer.jsx';
import { Courses } from './pages/courses.jsx';
import { TicketsPage } from './pages/tickets.jsx';
import { FormedTest } from './pages/formedTest.jsx';
import { Admin } from './pages/admin.jsx';
import { ProtectedRoute } from './components/req/protectedRoute.jsx';
import { loadState, saveState } from './store/persistence.js';
import { Box } from '@mui/material';
import Notiflix from 'notiflix';
import { GET_CURRENT_USER, WEB_SOCKET_CONNECTION } from './constants/ApiURL.js';
import secureLocalStorage from 'react-secure-storage';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants/authConstants.js';
import {
  ADMIN_PATH,
  COURSES_PATH,
  LOGIN_PATH,
  TEST_PATH,
  TICKETS_PATH,
  USER_INFO_PATH
} from './constants/PathURL.js';
import { axiosInstance } from './axiosInterceptor.js';
import { useStore } from './store/store.js';

export const App = () => {
  const wsRef = useRef(null);
  const {
    accessToken,
    refreshToken,
    sessionId,
    currentUser,
    websocketConnectionFailed,
    setWebsocketConnectionFailed,
    setCurrentUser,
    setAccessToken,
    setRefreshToken,
    setSessionId,
    backupLoaded
  } = useStore((state) => ({
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
    sessionId: state.sessionId,
    setAccessToken: state.setAccessToken,
    setRefreshToken: state.setRefreshToken,
    setSessionId: state.setSessionId,
    currentUser: state.currentUser,
    backupLoaded: state.backupLoaded,
    setCurrentUser: state.setCurrentUser,
    websocketConnectionFailed: state.websocketConnectionFailed,
    setWebsocketConnectionFailed: state.setWebsocketConnectionFailed
  }));
  useEffect(() => {
    loadState();
    window.addEventListener('beforeunload', saveState);
    return () => {
      window.removeEventListener('beforeunload', saveState);
    };
  }, []);

  useEffect(() => {
    if (!backupLoaded) return;
    if (accessToken && refreshToken) {
      if (!sessionId && !websocketConnectionFailed) {
        connectWebSocket();
      }
      if (sessionId && !currentUser) {
        axiosInstance
          .get(GET_CURRENT_USER)
          .then((response) => {
            setCurrentUser(response.data);
          })
          .catch((err) => {
            console.error('Error during login or fetching user details:', err.message);
          });
      }
    } else if (wsRef.current) {
      wsRef.current.close();
    }
  }, [accessToken, refreshToken, sessionId, backupLoaded]);

  const clearSession = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setSessionId(null);
    secureLocalStorage.removeItem(ACCESS_TOKEN);
    secureLocalStorage.removeItem(REFRESH_TOKEN);
  };

  const connectWebSocket = () => {
    const ws = new WebSocket(WEB_SOCKET_CONNECTION(accessToken, refreshToken));
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const sessionId = event.data;
      console.log('Session ID received:', sessionId);
      setSessionId(sessionId);
    };

    ws.onclose = (event) => {
      if (event.code === 1008) {
        switch (event.reason) {
          case 'Bad token':
            console.error('WebSocket closed: Bad token');
            clearSession();
            setWebsocketConnectionFailed(true);
            break;
          case 'Session exists':
            console.error('WebSocket closed: Session exists');
            Notiflix.Notify.failure('Session already exists. Please logout from other device.');
            setSessionId(null);
            setWebsocketConnectionFailed(true);
            break;
          default:
            console.error('WebSocket closed: ', event.reason);
            setSessionId(null);
            setWebsocketConnectionFailed(true);
        }
      } else {
        console.error('WebSocket closed with code: ', event.code);
        setSessionId(null);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
      <Router>
        <Routes>
          <Route
            path={LOGIN_PATH}
            element={
              <ProtectedRoute>
                <LoginPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={COURSES_PATH}
            element={
              <ProtectedRoute requiredRole="USER">
                <Header />
                <Courses />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route
            path={TICKETS_PATH}
            element={
              <ProtectedRoute requiredRole="USER">
                <Header />
                <TicketsPage />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route
            path={TEST_PATH}
            element={
              <ProtectedRoute requiredRole="USER">
                <Header />
                <FormedTest />
              </ProtectedRoute>
            }
          />
          <Route
            path={ADMIN_PATH}
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Header />
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Box>
  );
};
