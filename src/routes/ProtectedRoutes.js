// src/components/ProtectedRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import SideBar from "../components/sidebar/SideBar";

const ProtectedRoute = ({ loggedIn, onLogout }) => {
  return loggedIn ? (
    <>
      <SideBar onLogout={onLogout} />
      <div className="main-content">
        <div className="main">
          <Outlet />
        </div>
      </div>
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
