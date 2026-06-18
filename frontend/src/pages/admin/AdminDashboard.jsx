import React, { useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import CreatePolicy from "./admin/CreatePolicy";
import ManageClaims from "./admin/ManageClaims";
import AdminQueries from "./admin/AdminQueries";
import ViewPolicies from "./admin/ViewPolicies";
import AdminProfile from "./admin/AdminProfile";
import "./AdminDashboard.css";

const AdminDashboard = () => {
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
    { path: "/admin/create-policy", label: "Create Policy", icon: "📋" },
    { path: "/admin/manage-claims", label: "Manage Claims", icon: "⚖️" },
    { path: "/admin/user-queries", label: "User Queries", icon: "💬" },
    { path: "/admin/view-policies", label: "View Policies", icon: "👁️" },
    { path: "/admin/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="admin-dashboard">
      <header className="admin-appbar">
        <div className="admin-toolbar">
          <button className="admin-menu-btn" onClick={handleDrawerToggle}>
            ☰
          </button>
          <button className="admin-collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? '→' : '←'}
          </button>
          <h1 className="admin-title">Admin Dashboard</h1>
          <button className="admin-logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>
      
      <div 
           className={`admin-drawer-overlay ${mobileOpen ? 'open' : ''}`}
           onClick={handleDrawerToggle}></div>
      
      <nav className={`admin-drawer ${mobileOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <ul className="admin-drawer-list">
          {menuItems.map((item) => (
            <li key={item.path} className="admin-drawer-item">
              <Link
                to={item.path}
                className={`admin-drawer-link ${
                  location.pathname === item.path ? 'active' : ''
                }`}
                onClick={() => {
                  setMobileOpen(false);
                  setSidebarCollapsed(true);
                }}
              >
                <span className="admin-drawer-icon">{item.icon}</span>
                <span className="admin-drawer-text">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <main className={`admin-main ${sidebarCollapsed ? 'expanded' : ''}`}>
        <Routes>
          <Route path="create-policy" element={<CreatePolicy />} />
          <Route path="manage-claims" element={<ManageClaims />} />
          <Route path="user-queries" element={<AdminQueries />} />
          <Route path="view-policies" element={<ViewPolicies />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="*" element={<CreatePolicy />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
