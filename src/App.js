import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoutes";
import routes from "./routes/routes";
import "./components/sidebar/sidebar.css";
import "./components/components.css";
import { LanguageProvider } from "./components/LanguageContext";
// 🧩 Import Material UI Theme
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// 🎨 Import your two theme definitions
import { themeA, themeB } from './theme';
const App = () => {
  // 1. Existing Login Logic
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true";
  });

  const handleLogin = () => {
    setLoggedIn(true);
    localStorage.setItem("loggedIn", "true");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("loggedIn");
  };

  
  // 2. New Theme Logic
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Initialize theme state from localStorage, defaulting to 'A'
    return localStorage.getItem("appTheme") === "B" ? "B" : "A";
  });

  const toggleTheme = () => {
    const newTheme = currentTheme === "A" ? "B" : "A";
    setCurrentTheme(newTheme);
    localStorage.setItem("appTheme", newTheme);
  };
  
  // Select the theme object to be applied
  const appliedTheme = currentTheme === "A" ? themeA : themeB;
 
  useEffect(() => {
    localStorage.setItem("appTheme", currentTheme);
    if (currentTheme === "B") {
      document.body.classList.add("theme-b");
    } else {
      document.body.classList.remove("theme-b");
    }
  }, [currentTheme]);

  return (
    <LanguageProvider>
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />
      <div className="App">
        <BrowserRouter basename="/">
          <Routes>
            {/* Existing Root Path Logic: Redirects to dashboard if logged in */}
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
            
            {/* Existing Login Route */}
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            
            {/* Protected Routes */}
            <Route
              element={
                // 4. Pass Theme props to ProtectedRoute
                <ProtectedRoute 
                  loggedIn={loggedIn} 
                  onLogout={handleLogout} 
                  currentTheme={currentTheme} // Pass state
                  toggleTheme={toggleTheme}   // Pass toggle function
                  
                />
              }
            >
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;