import React from 'react';
import { Navigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import {useStore} from "../../store/store.js";

export const ProtectedRoute = ({ children, requiredRole }) => {
    const user = useStore(state => state.currentUser);
    const accessToken = secureLocalStorage.getItem('accessToken');
    const userRole = user ? user.userRole : null;

    if (!accessToken) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};
