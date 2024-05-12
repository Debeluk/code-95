import React from 'react';
import { Navigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';

export const ProtectedRoute = ({ children, requiredRole }) => {
    const accessToken = secureLocalStorage.getItem('accessToken');
    const user = secureLocalStorage.getItem('currentUser') ? JSON.parse(secureLocalStorage.getItem('currentUser')) : null;
    const userRole = user ? user.userRole : null;

    if (!accessToken) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};
