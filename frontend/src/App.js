import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminDashboard } from './pages/AdminDashboard';
import { AgentDashboard } from './pages/AgentDashboard';
import { FieldDetail } from './pages/FieldDetail';
import { CreateField } from './pages/CreateField';
import { AdminFieldsList } from './pages/AdminFieldsList';
import './App.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/agent'} />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fields"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminFieldsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fields/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <FieldDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-field"
          element={
            <ProtectedRoute requiredRole="admin">
              <CreateField />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agent"
          element={
            <ProtectedRoute requiredRole="agent">
              <AgentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/fields/:id"
          element={
            <ProtectedRoute requiredRole="agent">
              <FieldDetail />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
