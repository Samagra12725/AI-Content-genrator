import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sparkles, History, LogOut, LayoutDashboard, User } from "lucide-react";
import { api } from "../services/api";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = api.isAuthenticated();
  const currentUser = api.getCurrentUser();

  const handleLogout = () => {
    api.logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <Sparkles className="logo-icon" />
          <span>ProductGen<span className="logo-highlight">.AI</span></span>
        </Link>

        {isAuthenticated && (
          <nav className="navbar-nav">
            <Link
              to="/dashboard"
              className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/history"
              className={`nav-link ${isActive("/history") ? "active" : ""}`}
            >
              <History size={18} />
              <span>History</span>
            </Link>
          </nav>
        )}

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <div className="user-info">
                <User size={16} className="user-icon" />
                <span className="user-name">{currentUser?.name}</span>
              </div>
              <button onClick={handleLogout} className="btn-logout" title="Log Out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              {location.pathname !== "/login" && (
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
              )}
              {location.pathname !== "/register" && (
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
