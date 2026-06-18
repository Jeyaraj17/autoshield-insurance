import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

const LoginPage = () => {
  const [tab, setTab] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const validateEmail = (email) => {
    const allowedDomains = ['@gmail.com', '@outlook.com', '@cognizant.com'];
    const validTlds = ['.com', '.in', '.org', '.net', '.edu'];
    
    if (!email.includes('@')) return false;
    
    const hasAllowedDomain = allowedDomains.some(domain => email.endsWith(domain));
    if (!hasAllowedDomain) return false;
    
    const parts = email.split('.');
    const tld = '.' + parts[parts.length - 1];
    return validTlds.includes(tld);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateEmail(email)) {
      setError("Enter your email (only @gmail.com, @outlook.com, or @cognizant.com with valid domains like .com, .in are allowed)");
      return;
    }
    
    try {
      const res = await client.post("/api/auth/login", { email, password });
      const userRole = res.data.role;
      const expectedRole = tab === "admin" ? "ADMIN" : "USER";
      
      if (userRole !== expectedRole) {
        setError("Invalid credentials for selected role");
        return;
      }

      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      navigate(userRole === "ADMIN" ? "/admin" : "/user");
    } catch (err) {
      setError(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-paper">
        <h2 className="login-title">Login</h2>
        <div className="login-tabs">
          <button
            className={`login-tab ${tab === "user" ? "active" : ""}`}
            onClick={() => setTab("user")}
          >
            User
          </button>
          <button
            className={`login-tab ${tab === "admin" ? "active" : ""}`}
            onClick={() => setTab("admin")}
          >
            Admin
          </button>
        </div>
        {error && (
          <div className="login-alert error">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label">Email</label>
            <input
              className={`login-input${error ? " error" : ""}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              className={`login-input${error ? " error" : ""}`}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
