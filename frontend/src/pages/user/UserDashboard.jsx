import React, { useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
// import ApplyPolicy from "./user/ApplyPolicy";
import AppliedPolicies from "./user/AppliedPolicies";
import ApplyClaim from "./user/ApplyClaim";
import UserQueries from "./user/UserQueries";
import TrackClaims from "./user/TrackClaims";
import AvailablePolicies from "./user/AvailablePolicies";
import UserProfile from "./user/UserProfile";
import "./UserDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { path: "/user/available-policies", label: "Available Policies", icon: "📋" },
    // { path: "/user/apply-policy", label: "Apply Policies" },
    { path: "/user/applied-policies", label: "Applied Policies", icon: "📄" },
    { path: "/user/apply-claim", label: "Apply Claims", icon: "📝" },
    { path: "/user/track-claims", label: "Track Claims", icon: "🔍" },
    { path: "/user/queries", label: "Queries", icon: "💬" },
    { path: "/user/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="user-dashboard">
      <header className="user-appbar">
        <div className="user-toolbar">
          <button className="user-menu-btn" onClick={handleDrawerToggle}>
            ☰
          </button>
          <button className="user-collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? '→' : '←'}
          </button>
          <h1 className="user-title">User Dashboard</h1>
          <button className="user-logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <div 
           className={`user-drawer-overlay ${mobileOpen ? 'open' : ''}`}
           onClick={handleDrawerToggle}></div>
      
      <nav className={`user-drawer ${mobileOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <ul className="user-drawer-list">
          {menuItems.map((item) => (
            <li key={item.path} className="user-drawer-item">
              <Link
                to={item.path}
                className={`user-drawer-link ${
                  location.pathname === item.path ? 'active' : ''
                }`}
                onClick={() => {
                  setMobileOpen(false);
                  setSidebarCollapsed(true);
                }}
              >
                <span className="user-drawer-icon">{item.icon}</span>
                <span className="user-drawer-text">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <main className={`user-main ${sidebarCollapsed ? 'expanded' : ''}`}>
        <Routes>
          <Route path="available-policies" element={<AvailablePolicies />} />
          {/* <Route path="apply-policy" element={<ApplyPolicy />} /> */}
          <Route path="applied-policies" element={<AppliedPolicies />} />
          <Route path="apply-claim" element={<ApplyClaim />} />
          <Route path="track-claims" element={<TrackClaims />} />
          <Route path="queries" element={<UserQueries />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="*" element={<AvailablePolicies />} />
        </Routes>
      </main>
    </div>
  );
};

export default UserDashboard;
