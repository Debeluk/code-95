import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/login.jsx';
import { Header } from './pages/header.jsx';
import { Courses } from './pages/courses.jsx';
import { TicketsPage } from './pages/tickets.jsx';
import { FormedTest } from './pages/formedTest.jsx';
import { Admin } from './pages/admin.jsx';
import { ProtectedRoute } from './components/req/protectedRoute.jsx';
import { loadState, saveState } from './store/persistence.js';
import { Box } from '@mui/material';
import Notiflix from 'notiflix';
import {GET_CURRENT_USER, REFRESH, WEB_SOCKET_CONNECTION} from './constants/ApiURL.js';
import secureLocalStorage from 'react-secure-storage';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants/authConstants.js';
import {
  ADMIN_PATH,
  COURSES_PATH,
  LOGIN_PATH,
  TEST_PATH,
  TICKETS_PATH
} from './constants/PathURL.js';
import {axiosInstance} from './axiosInterceptor.js';
import { useStore } from './store/store.js';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { ScrollTop } from './components/scrollTop/scrollTop.js';
import axios from "axios";

export const App = () => {
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [attemptsLeft, setAttemptsLeft] = React.useState(1);
  const intervalRef = useRef(null);
  const [block] = useAutoAnimate();
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
    resetStore
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
    if (!backupLoaded) return;
    if (accessToken && refreshToken) {
      if (!sessionId && !websocketConnectionFailed) {
        setAttemptsLeft(1);
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
      wsRef.current.close(1000);
    } else {
      resetStore();
      clearSession();
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
        console.log('Session ID received:', sessionId);
        setSessionId(sessionId);
      }
    };

    ws.onclose = (event) => {
      if (event.code === 1008) {
        switch (event.reason) {
          case 'Bad token':
            console.error('WebSocket closed: Bad token');
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
                    reconnectWebSocket();
                  })
                  .catch((err) => {
                    console.error(err);
                    resetStore();
                    clearSession();
                    setWebsocketConnectionFailed(true);
                  });
              }
            } else {
              resetStore();
              clearSession();
              setWebsocketConnectionFailed(true);
            }
            break;
          case 'Session exists':
            console.error('WebSocket closed: Session exists');
            Notiflix.Notify.failure('Session already exists. Please logout from other device.');
            resetStore();
            clearSession();
            setWebsocketConnectionFailed(true);
            break;
          default:
            console.error('WebSocket closed: ', event.reason);
            setSessionId(null);
            setWebsocketConnectionFailed(true);
        }
      } else if (event.code === 1006) {
        setSessionId(null);
        setWebsocketConnectionFailed(true);
        reconnectWebSocket();
      } else {
        console.error('WebSocket closed with code: ', event.code);
        if (event.code !== 1000) {
          reconnectWebSocket();
        }
        setSessionId(null);
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      reconnectWebSocket();
    };

    return () => {
      ws.close(1000);
    };
  };

  const reconnectWebSocket = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    reconnectTimeoutRef.current = setTimeout(() => {
      if (accessToken && refreshToken) {
        connectWebSocket();
      }
    }, 5000);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'transparent' }} ref={block}>
      <Router>
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
                {/*<Footer />*/}
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
                {/*<Footer />*/}
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
        </Routes>
      </Router>
    </Box>
  );
};
