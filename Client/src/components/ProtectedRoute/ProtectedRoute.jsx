import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Use named import

const ProtectedRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem('token');
  let isAdmin = false;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      isAdmin = decodedToken.isAdmin;
    } catch (error) {
      isAdmin = false;
    }
  }

  return (
    isAdmin ? (
      element
    ) : (
      <Navigate
        to="/"
        replace
      />
    )
  );
};

export default ProtectedRoute;
