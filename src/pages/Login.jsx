import React from "react";
import "../styles/Login.css"; // Import CSS file

const Login = () => {
  return (
    <div className="login-container">
      {/* Left Section: Login Form */}
      <div className="login-form">
        <div className="logo">🔷</div>
        <h2>Welcome back !</h2>
        <p>Enter to get unlimited access to data & information.</p>

        <form>
          <label>Email *</label>
          <input type="email" placeholder="Enter your mail address" required />

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

        <div className="or-divider">Or, Login with</div>

        <button className="google-btn">
          <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" />
          Sign up with Google
        </button>

        <p className="register-link">
          Don't have an account? <a href="#">Register here</a>
        </p>
      </div>

      {/* Right Section: Decorative Panel */}
      <div className="login-decor">
        {/* This div will be used for background design */}
      </div>
    </div>
  );
};

export default Login;
