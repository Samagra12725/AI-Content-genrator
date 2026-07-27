import React from "react";
import { Navigate } from "react-router-dom";
import { api } from "../services/api";

const ProtectedRoute = ({ children }) => {
  if (!api.isAuthenticated()) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
