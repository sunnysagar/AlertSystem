import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css"; // Reusing the same CSS file
import RegisterImage from "../assets/forgot-pass_img.jpg"; // Image for forgot password

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Enter OTP, Step 3: Enter Password
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    setError(null);
    setMessage("OTP has been sent to your email.");
    setStep(2); // Move to OTP verification step
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP sent to your email.");
      return;
    }
    setError(null);
    setMessage("OTP Verified! Enter your new password.");
    setStep(3); // Move to password reset step
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError("Please enter a new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setMessage("Password reset successful! Redirecting to login...");
    
    setTimeout(() => {
      navigate("/login"); // Redirect to login page after successful password reset
    }, 2000);
  };

  return (
    <div className="register-container">
      {/* Left Side: Forgot Password Form */}
      <div className="register-form">
        <h2>Reset Your Password</h2>
        <p>{step === 1 ? "Enter your email to receive an OTP" :
            step === 2 ? "Enter the OTP sent to your email" :
            "Enter your new password"}</p>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <label>Email *</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="register-btn" type="submit">
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <label>Enter OTP *</label>
            <input
              type="text"
              placeholder="Enter OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button className="register-btn" type="submit">
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <label>New Password *</label>
            <input
              type="password"
              placeholder="Enter new password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label>Confirm New Password *</label>
            <input
              type="password"
              placeholder="Confirm new password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className="register-btn" type="submit">
              Submit
            </button>
          </form>
        )}

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
