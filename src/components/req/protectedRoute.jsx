import React from 'react';
import {Navigate} from 'react-router-dom';

export const ProtectedRoute = ({children}) => {
    const isAuthenticated = localStorage.getItem('accessToken');

    return isAuthenticated ? children : <Navigate to="/" replace/>;
};
