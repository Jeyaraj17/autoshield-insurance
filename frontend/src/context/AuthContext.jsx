import React, { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";
import { Navigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await client.get("/api/auth/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only load user info on initial app load, not after login
    if (user === null) {
      load();
    } else {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      await client.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      if (typeof window !== "undefined") {
        window.location.replace("/");
      }
    }
  };

  const value = { user, setUser, reload: load, logout };
  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role)
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/user"} replace />;
  return children;
};
