import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
