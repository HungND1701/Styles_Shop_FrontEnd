// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!user || user.type !== role) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;