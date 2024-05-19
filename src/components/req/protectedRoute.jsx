import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { useStore } from '../../store/store.js';
import {ADMIN_PATH, COURSES_PATH, LOGIN_PATH} from "../../constants/PathURL.js";

export const ProtectedRoute = ({ children, requiredRole }) => {
  console.log(useStore.getState());
  const navigate = useNavigate();
  const [showContent, setShowContent] = React.useState(false);
  const backupLoaded = useStore((state) => state.backupLoaded);
  const user = useStore((state) => state.currentUser);
  const accessToken = useStore((state) => state.accessToken);
  const userRole = user ? user.userRole : null;

  useEffect(() => {
    if (!backupLoaded) return;
    if (window.location.pathname === LOGIN_PATH && user) {
      navigate(user.userRole === 'ADMIN' ? ADMIN_PATH : COURSES_PATH);
    } else if (!accessToken) {
      console.log(accessToken);
      navigate(LOGIN_PATH);
    } else if (requiredRole && userRole !== requiredRole) {
      if (userRole === 'ADMIN') {
        navigate(ADMIN_PATH);
      } else {
        navigate(COURSES_PATH);
      }
    }
    setShowContent(true);
  }, [backupLoaded, accessToken, userRole, user, requiredRole, navigate]);
  return showContent && children;
};
