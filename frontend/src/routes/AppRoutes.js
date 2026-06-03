import React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import VerifyEmail from "../pages/VerifyEmail"; // 1. Import your new page
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} /> 
      <Route path="/signup" element={<Signup />} /> 
      
      {/* 2. Verification URL route handler mapping */}
      <Route path="/verify-email/:token" element={<VerifyEmail />} /> 
      
      {/* Protected Route */}
      <Route 
        path="/dashboard" 
        element={   
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute> 
        }
      /> 
    </Routes>
  );
}

export default AppRoutes;