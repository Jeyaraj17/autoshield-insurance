import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import "./SignupPage.css";

const SignupPage = () => {
  const [role, setRole] = useState("USER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    return {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      noSpaces: !/\s/.test(pwd)
    };
  };

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Name is required";
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else {
      const allowedDomains = ['@gmail.com', '@outlook.com', '@cognizant.com'];
      const validTlds = ['.com', '.in', '.org', '.net', '.edu'];
      
      const hasAllowedDomain = allowedDomains.some(domain => email.endsWith(domain));
      if (!hasAllowedDomain) {
        errors.email = "Only @gmail.com, @outlook.com, or @cognizant.com emails are allowed";
      } else {
        const parts = email.split('.');
        const tld = '.' + parts[parts.length - 1];
        if (!validTlds.includes(tld)) {
          errors.email = "Invalid domain. Use .com, .in, .org, .net, or .edu";
        }
      }
    }

    if (!password) {
      errors.password = "Password is required";
    } else {
      const validation = validatePassword(password);
      if (!Object.values(validation).every(Boolean)) {
        errors.password = "Password does not meet requirements";
      }
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await client.post("/api/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      setSnack({
        open: true,
        message: "Account created successfully! Please login to continue.",
        severity: "success",
      });

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Signup error:", err);

      let errorMessage = "Signup failed. Please try again.";

      if (err.response?.status === 409) {
        errorMessage =
          "Email already exists. Please use a different email or try logging in.";
      } else if (err.response?.status === 400) {
        errorMessage =
          err.response?.data?.message ||
          "Invalid data provided. Please check your inputs.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setSnack({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-paper">
        <div className="signup-header">
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">Join AUTO INSURANCE MANAGEMENT today</p>
        </div>

        {error && (
          <div className="signup-alert error">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="signup-form">
          <div className="signup-field">
            <label className="signup-label">Full Name</label>
            <input
              className={`signup-input${validationErrors.name ? " error" : ""}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {validationErrors.name && (
              <span className="signup-error-text">{validationErrors.name}</span>
            )}
          </div>

          <div className="signup-field">
            <label className="signup-label">Email Address</label>
            <input
              className={`signup-input${validationErrors.email ? " error" : ""}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {validationErrors.email ? (
              <span className="signup-error-text">{validationErrors.email}</span>
            ) : (
              <span className="signup-helper-text">We'll never share your email</span>
            )}
          </div>

          <div className="signup-field">
            <label className="signup-label">Password</label>
            <div className="signup-input-group">
              <input
                className={`signup-input${validationErrors.password ? " error" : ""}`}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="signup-input-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>
            {validationErrors.password && (
              <span className="signup-error-text">{validationErrors.password}</span>
            )}
            <div className="password-requirements">
              <div className="requirements-title">Password Requirements:</div>
              {password && (
                <div className="requirements-list">
                  <div className={`requirement ${validatePassword(password).length ? 'valid' : 'invalid'}`}>
                    {validatePassword(password).length ? '✅' : '❌'} At least 8 characters
                  </div>
                  <div className={`requirement ${validatePassword(password).uppercase ? 'valid' : 'invalid'}`}>
                    {validatePassword(password).uppercase ? '✅' : '❌'} One uppercase letter (A-Z)
                  </div>
                  <div className={`requirement ${validatePassword(password).lowercase ? 'valid' : 'invalid'}`}>
                    {validatePassword(password).lowercase ? '✅' : '❌'} One lowercase letter (a-z)
                  </div>
                  <div className={`requirement ${validatePassword(password).number ? 'valid' : 'invalid'}`}>
                    {validatePassword(password).number ? '✅' : '❌'} One number (0-9)
                  </div>
                  <div className={`requirement ${validatePassword(password).special ? 'valid' : 'invalid'}`}>
                    {validatePassword(password).special ? '✅' : '❌'} One special character (!@#$%^&*)
                  </div>
                  <div className={`requirement ${validatePassword(password).noSpaces ? 'valid' : 'invalid'}`}>
                    {validatePassword(password).noSpaces ? '✅' : '❌'} No spaces
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="signup-field">
            <label className="signup-label">Confirm Password</label>
            <div className="signup-input-group">
              <input
                className={`signup-input${validationErrors.confirmPassword ? " error" : ""}`}
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="signup-input-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <span className="signup-error-text">{validationErrors.confirmPassword}</span>
            )}
          </div>

          <div className="signup-role-section">
            <label className="signup-role-label">Account Type</label>
            <div className="signup-toggle-group">
              <button
                type="button"
                className={`signup-toggle-button ${role === "USER" ? "selected" : ""}`}
                onClick={() => setRole("USER")}
              >
                User
              </button>
              <button
                type="button"
                className={`signup-toggle-button ${role === "ADMIN" ? "selected" : ""}`}
                onClick={() => setRole("ADMIN")}
              >
                Admin
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="signup-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="signup-loading"></div>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="signup-link-section">
            <span className="signup-link-text">
              Already have an account?{" "}
              <button
                type="button"
                className="signup-link"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </span>
          </div>
        </form>
      </div>

      {snack.open && (
        <div className="signup-snackbar">
          <div className={`signup-snackbar-content ${snack.severity}`}>
            <span>{snack.message}</span>
            <button
              className="signup-snackbar-close"
              onClick={() => setSnack({ ...snack, open: false })}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
