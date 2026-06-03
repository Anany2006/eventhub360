import React from 'react';
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // Check if our Login component saved an auth token to browser storage
  const token = localStorage.getItem("token");

  // If the token exists, load the page. If not, redirect them back to Login ('/')
  return token ? children : <Navigate to="/" />;
}

export default ProtectedRoute;