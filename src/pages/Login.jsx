import React, { useState } from "react";
import loginImage from "../assets/login_img.jpg";
import companyLogo from "../assets/company_logo.png"; // Import Company Logo
import google_logo from "../assets/google_logo.png";
import "../styles/Login.css"; // Import CSS file
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const[error, setError] = useState(null);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      setError("Invalid email or password");
    }
  };

   
  return (
    <div className="login-container">
      { /* Left Section: Login Form  */}
        <div className="login-form">
          <div className="logo">
            <img src={companyLogo} alt="Company Logo" />
          </div>
        <h2>Welcome back !</h2>
        <p>Enter to get unlimited access to data & information.</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label for="email">Email *</label>
          <input type="email" 
                  placeholder="Enter your mail address" 
                  id="email"
                  required
                  onChange={(e) => setEmail(e.target.value)} />

          <label for="password">Password *</label>
          <div className="password-field">
            <input 
                  type="password" 
                  placeholder="Enter password" 
                  id="password"
                  required
                  onChange={(e) => setPassword(e.target.value)} />
            <span className="eye-icon">👁️</span>
          </div>

           <div className="remember-forgot">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#">Forgot your password?</a>
            </div>

            <button className="login-btn">Log In</button>
          </form>

          <div className="or-divider">Or Login with</div>

          <button className="google-btn">
          <img src={google_logo} alt="Google Logo" /> Sign in with Google
          </button>

          <p className="register-link">
            Don't have an account? <a href="#">Register here</a>
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
