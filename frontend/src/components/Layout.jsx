import React from "react";
import {
  Link as RouterLink,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile =
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 900px)").matches
      : false;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    // logout performs a hard redirect; avoid double navigation
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: "Home", id: "home" },
    { label: "About Us", id: "about" },
    { label: "Services", id: "services" },
    { label: "Contact", id: "contact" },
  ];

  const drawer = (
    <div className="mobile-drawer open">
      <div className="mobile-header">
        <div style={{ fontWeight: 700, color: "var(--primary)" }}>
          AUTO INSURANCE MANAGEMENT
        </div>
        <button className="btn btn-outline" onClick={handleDrawerToggle}>
          Close
        </button>
      </div>
      <div className="mobile-list">
        {navItems.map((item) => (
          <div
            key={item.id}
            className="mobile-item"
            onClick={() => scrollToSection(item.id)}
          >
            {item.label}
          </div>
        ))}
        <div
          style={{ borderTop: "1px solid var(--border)", margin: "8px 0" }}
        />
        {user ? (
          <div className="mobile-item logout" onClick={handleLogout}>
            Logout
          </div>
        ) : (
          <div className="mobile-item" onClick={() => navigate("/login")}>
            Login
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="layout-root">
      <header className="site-header">
        <div className="header-bar">
          <div className="brand" onClick={() => navigate("/")}>
            AUTO INSURANCE MANAGEMENT
          </div>
          {!isMobile ? (
            <nav className="nav">
              {navItems.map((item) => (
                <a key={item.id} onClick={() => scrollToSection(item.id)}>
                  {item.label}
                </a>
              ))}
              {user ? (
                <a onClick={handleLogout}>Logout</a>
              ) : (
                <RouterLink to="/login">Login</RouterLink>
              )}
            </nav>
          ) : (
            <button className="menu-btn" onClick={handleDrawerToggle}>
              Menu
            </button>
          )}
        </div>
      </header>

      {isMobile && mobileOpen && (
        <div className="mobile-drawer open">
          <div className="mobile-header">
            <div style={{ fontWeight: 700, color: "var(--primary)" }}>
              AUTO INSURANCE MANAGEMENT
            </div>
            <button className="btn btn-outline" onClick={handleDrawerToggle}>
              Close
            </button>
          </div>
          <div className="mobile-list">
            {navItems.map((item) => (
              <div
                key={item.id}
                className="mobile-item"
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </div>
            ))}
            <div
              style={{ borderTop: "1px solid var(--border)", margin: "8px 0" }}
            />
            {user ? (
              <div className="mobile-item logout" onClick={handleLogout}>
                Logout
              </div>
            ) : (
              <div className="mobile-item" onClick={() => navigate("/login")}>
                Login
              </div>
            )}
          </div>
        </div>
      )}

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="col-12 col-md-4">
              <div className="footer-brand">AUTO INSURANCE MANAGEMENT</div>
              <div className="footer-muted mb-3">
                Your trusted partner for comprehensive auto insurance solutions.
                Protecting your journey with reliable coverage and exceptional
                service.
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="h4 mb-2">Quick Links</div>
              <div className="footer-links">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    className="footer-link"
                    onClick={() => scrollToSection(item.id)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="h4 mb-2">Contact Info</div>
              <div className="footer-muted">
                📍 123, Insurance Ave, Chennai, Tamil Nadu
              </div>
              <div className="footer-muted">📞 +91 98765 43210</div>
              <div className="footer-muted">📧 support@autoshield.example</div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-muted">
              © {new Date().getFullYear()} AUTO INSURANCE MANAGEMENT. All rights
              reserved.
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <a className="policy">Privacy Policy</a>
              <a className="policy">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
