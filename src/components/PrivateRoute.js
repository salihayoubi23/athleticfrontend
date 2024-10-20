import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token'); // Vérifiez si l'utilisateur est authentifié

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
