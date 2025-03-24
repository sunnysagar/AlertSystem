
/**
 * Login.jsx
 * This file contains the Login component for the CTEL Web App. 
 * The component renders a login form with email and password fields, 
 * a "Remember me" checkbox, and options to log in with Google or register a new account.
 * It also includes error handling for invalid login attempts.
 * 
 */
import { Link } from "react-router-dom";
import React, { useState } from "react";
import loginImage from "../assets/login_img2.jpg";
import companyLogo from "../assets/company_logo.png";
import google_logo from "../assets/google_logo.png";
import "../styles/Login.css"; // Import CSS file for login page
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  const togglePassword = () =>{
    setShowPassword(!showPassword);
  };


  return (
    <div className="login-container">
      { /* Left Section: Login Form  */}
      <div className="login-form">
        <div className="logo">
          <img src={companyLogo} alt="Company Logo" />
        </div>
        <h2>Login</h2>
        <p>Pre-Failure Alarm Generation System.</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
        <label for="email">Email *</label>
          <div className="email-field">
            <input type="email"
              placeholder="Enter your mail address"
              id="email"
              required
              onChange={(e) => setEmail(e.target.value)} />

          </div>
          
          <label for="password">Password *</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              id="password"
              required
              onChange={(e) => setPassword(e.target.value)} />
            <span 
            className="eye-icon"
            onClick={togglePassword}
            >{showPassword ? "🙈" : "👁️"}</span>
          </div>

          <div className="remember-forgot">
            <label >
              <input type="checkbox" />Remember me
            </label>
            <p className="login-link">
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>
          </div>

          <button className="login-btn">Log In</button>
        </form>

        {/* <div className="or-divider">Or Login with</div> */}

        {/* <button className="google-btn">
          <img src={google_logo} alt="Google Logo" /> Sign in with Google
        </button> */}

        <p className="register-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>

      {/* Right Section: Decorative Panel */}
      <div className="login-decor">
        <img src={loginImage} alt="Login Illustration" className="login-image" />
      </div>
    </div>
  );
};

export default Login;
