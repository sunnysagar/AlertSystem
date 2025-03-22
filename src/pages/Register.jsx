import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css"; // Import CSS file for styling
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState({
    name: '', 
    department:'',
    email:'',
    password:''
  })
  const [error, setError] = useState(null);
  const { signup } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (user.password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      signup(user);
       // Here, send data to backend (API request for user registration)
    //    console.log("user", user); 
    // console.log("User Registered:", { name, department, email, password });
      alert("Registration successful");
    } catch (error) {
      setError("Registration failed", error);
    }

  };

  const handleChange = (e) =>{
    const {name, value} = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Sign Up</h2>
        <p>Create a new account</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Name *</label>
          <input type="text" 
                 placeholder="Enter your full name" 
                 name="name"
                 required 
                 value={user.name} 
                 onChange={handleChange} />

          <label>Department *</label>
          <input type="text" 
                 placeholder="Enter your department"  
                  name="department"
                 value={user.department} 
                 onChange={handleChange} />

          <label>Email *</label>
          <input type="email" 
                 placeholder="Enter your email" 
                  name="email"
                 required 
                 value={user.email} 
                 onChange={handleChange} />

          <label>Password *</label>
          <input type="password" 
                placeholder="Enter password" 
                name="password"
                required 
                value={user.password} 
                onChange={handleChange} />

          <label>Confirm Password *</label>
          <input type="password" 
                  placeholder="Confirm password" 
                  required 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} />

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
