import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css"; // Import CSS file for styling
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup({ name, department, email, password });
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Here, send data to backend (API request for user registration)
    console.log("User Registered:", { name, department, email, password });

    // Redirect to login after successful registration
    navigate("/login");
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Sign Up</h2>
        <p>Create a new account</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Name *</label>
          <input type="text" placeholder="Enter your full name" required value={name} onChange={(e) => setName(e.target.value)} />

          <label>Department *</label>
          <input type="text" placeholder="Enter your department" required value={department} onChange={(e) => setDepartment(e.target.value)} />

          <label>Email *</label>
          <input type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Password *</label>
          <input type="password" placeholder="Enter password" required value={password} onChange={(e) => setPassword(e.target.value)} />

          <label>Confirm Password *</label>
          <input type="password" placeholder="Confirm password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

          <button className="register-btn" type="submit">Register</button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
