import React from "react";
import loginImage from "../assets/login_img.jpg";
import companyLogo from "../assets/company_logo.png"; // Import Company Logo
import google_logo from "../assets/google_logo.png";
import { FaGoogle } from "react-icons/fa"; // Import Google Icon
import "../styles/Login.css"; // Import CSS file

const Login = () => {
  return (
    <div className="login-container">
      { /* Left Section: Login Form  */}
        <div className="login-form">
          <div className="logo">
            <img src={companyLogo} alt="Company Logo" />
          </div>
          <h2>Welcome back !</h2>
          <p>Enter to get unlimited access to data & information.</p>

          <form>
            <label>Email *</label>
            <input type="email" placeholder="Enter your e-mail " required />

            <label>Password *</label>
            <div className="password-field">
          <input type="password" placeholder="Enter password" required />
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
