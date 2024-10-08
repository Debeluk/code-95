import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { LoginPage } from './pages/login.jsx';
import { Header } from './pages/header.jsx';
import { Courses } from './pages/courses.jsx';
import { TicketsPage } from './pages/tickets.jsx';
import { FormedTest } from './pages/formedTest.jsx';
import { Admin } from './pages/admin.jsx';
import { ExistSession } from './pages/existSession.jsx';
import { ProtectedRoute } from './components/req/protectedRoute.jsx';
import { loadState, saveState } from './store/persistence.js';
import { Box, CircularProgress } from '@mui/material';
import Notiflix from 'notiflix';
import { GET_CURRENT_USER, REFRESH, WEB_SOCKET_CONNECTION } from './constants/ApiURL.js';
import secureLocalStorage from 'react-secure-storage';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants/authConstants.js';
import {
  ADMIN_PATH,
  COURSES_PATH,
  LOGIN_PATH,
  TEST_PATH,
  TICKETS_PATH,
  EXIST_SESSION_PATH
} from './constants/PathURL.js';
import { axiosInstance } from './axiosInterceptor.js';
import { useStore } from './store/store.js';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { ScrollTop } from './components/scrollTop/scrollTop.js';
import axios from 'axios';

export const App = () => {
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [attemptsLeft, setAttemptsLeft] = useState(1);
  const intervalRef = useRef(null);
  const [block] = useAutoAnimate();
  const [loading, setLoading] = useState(true);
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
    backupLoaded,
    resetStore,
    setNeedNavigateToSessionExists
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
    setWebsocketConnectionFailed: state.setWebsocketConnectionFailed,
    resetStore: state.resetStore,
    setNeedNavigateToSessionExists: state.setNeedNavigateToSessionExists
  }));

  useEffect(() => {
    loadState();

    const handleBeforeUnload = () => {
      saveState();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveState();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const intervalId = setInterval(saveState, 10000);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      if (!backupLoaded) return;
      if (accessToken && refreshToken) {
        try {
          await handleWebSocketConnection();
        } catch (error) {
          if (error.message === 'Session exists') {
            setNeedNavigateToSessionExists(true);
          }
        } finally {
          setLoading(false);
        }
      } else {
        resetStore();
        clearSession();
        setLoading(false);
      }
    };

    initializeApp();
  }, [accessToken, refreshToken, sessionId, backupLoaded]);

  const handleWebSocketConnection = () => {
    return new Promise((resolve, reject) => {
      if (!sessionId && !websocketConnectionFailed) {
        setAttemptsLeft(1);
        connectWebSocket(resolve, reject);
      } else if (sessionId && !currentUser) {
        axiosInstance
          .get(GET_CURRENT_USER)
          .then((response) => {
            setCurrentUser(response.data);
            resolve();
          })
          .catch((err) => {
            console.error('Error during login or fetching user details:', err.message);
            reject(err);
          });
      } else {
        resolve();
      }
    });
  };

  const clearSession = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setSessionId(null);
    secureLocalStorage.removeItem(ACCESS_TOKEN);
    secureLocalStorage.removeItem(REFRESH_TOKEN);
    reconnectTimeoutRef.current = null;
    if (wsRef.current) {
      wsRef.current?.close(1000);
      wsRef.current = null;
    }
  };

  const connectWebSocket = (resolve, reject) => {
    const ws = new WebSocket(WEB_SOCKET_CONNECTION(accessToken, refreshToken));
    wsRef.current = ws;

    ws.onopen = () => {
      intervalRef.current = setInterval(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          const currentDateTime = new Date().toISOString();
          wsRef.current.send(`Time: ${currentDateTime}`);
        }
      }, 85000);
    };

    ws.onmessage = (event) => {
      const message = event.data;
      if (message.startsWith('SESSION:')) {
        setAttemptsLeft(1);
        const sessionId = message.split(' ')[1];
        setSessionId(sessionId);
        resolve();
      }
    };

    ws.onclose = (event) => {
      if (event.code === 1008) {
        switch (event.reason) {
          case 'Bad token':
            if (attemptsLeft > 0) {
              setAttemptsLeft(attemptsLeft - 1);
              if (refreshToken) {
                axios
                  .post(REFRESH, { token: refreshToken })
                  .then(({ data }) => {
                    secureLocalStorage.setItem(ACCESS_TOKEN, data.accessToken);
                    secureLocalStorage.setItem(REFRESH_TOKEN, data.refreshToken);
                    setAccessToken(data.accessToken);
                    setRefreshToken(data.refreshToken);
                    reconnectWebSocket(resolve, reject);
                  })
                  .catch((err) => {
                    console.error(err);
                    resetStore();
                    clearSession();
                    setWebsocketConnectionFailed(true);
                    reject(err);
                  });
              }
            } else {
              resetStore();
              clearSession();
              setWebsocketConnectionFailed(true);
              reject(new Error('Bad token'));
            }
            break;
          case 'Session exists':
            Notiflix.Notify.failure('Session already exists. Please logout from other device!');
            resetStore();
            clearSession();
            reject(new Error('Session exists'));
            break;
          default:
            setSessionId(null);
            setWebsocketConnectionFailed(true);
            reject(new Error('WebSocket error'));
        }
      } else if (event.code === 1006) {
        setSessionId(null);
        setWebsocketConnectionFailed(true);
        reconnectWebSocket(resolve, reject);
      } else {
        if (event.code !== 1000) {
          reconnectWebSocket(resolve, reject);
        }
        setSessionId(null);
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    ws.onerror = (error) => {
      reconnectWebSocket(resolve, reject);
    };
  };

  const reconnectWebSocket = (resolve, reject) => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    reconnectTimeoutRef.current = setTimeout(() => {
      if (accessToken && refreshToken) {
        connectWebSocket(resolve, reject);
      }
    }, 5000);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'transparent' }} ref={block}>
      {loading ? (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress sx={{ color: 'black' }} />
        </Box>
      ) : (
        <Router>
          <AppRoutes />
        </Router>
      )}
    </Box>
  );
};

const AppRoutes = () => {
  const navigate = useNavigate();
  const { needNavigateToSessionExists, setNeedNavigateToSessionExists } = useStore((state) => ({
    needNavigateToSessionExists: state.needNavigateToSessionExists,
    setNeedNavigateToSessionExists: state.setNeedNavigateToSessionExists
  }));

  useEffect(() => {
    if (needNavigateToSessionExists) {
      navigate(EXIST_SESSION_PATH);
      setNeedNavigateToSessionExists(false);
    }
  }, [needNavigateToSessionExists, navigate, setNeedNavigateToSessionExists]);

  return (
    <Routes>
      <Route
        path={LOGIN_PATH}
        element={
          <ProtectedRoute>
            <ScrollTop />
            <LoginPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={COURSES_PATH}
        element={
          <ProtectedRoute requiredRole="USER">
            <Header />
            <ScrollTop />
            <Courses />
          </ProtectedRoute>
        }
      />
      <Route
        path={TICKETS_PATH}
        element={
          <ProtectedRoute requiredRole="USER">
            <Header />
            <ScrollTop />
            <TicketsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={TEST_PATH}
        element={
          <ProtectedRoute requiredRole="USER">
            <Header />
            <ScrollTop />
            <FormedTest />
          </ProtectedRoute>
        }
      />
      <Route
        path={ADMIN_PATH}
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <Header />
            <ScrollTop />
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route path={EXIST_SESSION_PATH} element={<ExistSession />} />
    </Routes>
  );
};
