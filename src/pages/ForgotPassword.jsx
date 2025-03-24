import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Register.css"; // Reusing the same CSS file
import RegisterImage from "../assets/forgot-pass_img.jpg"; // Use the same image as Register page

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setMessage("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // Simulating password reset request
    setTimeout(() => {
      setMessage("A password reset link has been sent to your email.");
    }, 1000);
  };

  return (
    <div className="register-container">
      {/* Left Side: Forgot Password Form */}
      <div className="register-form">
        <h2>Reset Your Password</h2>
        <p>Enter your email to reset your password</p>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <label>Email *</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="register-btn" type="submit">
            Reset Password
          </button>
        </form>

        <p className="login-link">
          Remembered your password? <Link to="/login">Login here</Link>
        </p>
      </div>

      {/* Right Side: Image */}
      <div className="register-image">
        <img src={RegisterImage} alt="Forgot Password" />
      </div>
    </div>
  );
};

export default ForgotPassword;
