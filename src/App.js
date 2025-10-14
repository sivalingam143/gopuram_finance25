import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import NetworkStatusPopup from "./networkalert";
import ProtectedRoute from "./routes/ProtectedRoutes";
import routes from "./routes/routes";
import "./components/sidebar/sidebar.css";
import "./components/components.css";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(() => {
    // Check localStorage for the logged-in status
    return localStorage.getItem("loggedIn") === "true";
  });

  const handleLogin = () => {
    setLoggedIn(true);
    localStorage.setItem("loggedIn", "true"); // Persist login state
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("loggedIn"); // Remove login state
  };

  return (
    <div className="App">
      <BrowserRouter basename="/">
        <Routes>
          <Route
            path="/"
            element={
              loggedIn ? (
                <Navigate to="/console/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            element={
              <ProtectedRoute loggedIn={loggedIn} onLogout={handleLogout} />
            }
          >
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
