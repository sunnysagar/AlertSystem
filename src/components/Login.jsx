import { useState } from "react";
import "../styles/Login.css";

const LoginPage = () => {
  const [userData, setUserData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    console.log("Logging in with:", userData);
    // Add authentication logic here
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>

        <input
          type="text"
          name="username"
          placeholder="Email"
          value={userData.username}
          onChange={handleChange}
          className="input-field"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userData.password}
          onChange={handleChange}
          className="input-field"
        />

        <button onClick={handleLogin} className="login-button">
          Login
        </button>

        <div className="login-links">
          <a href="#">Forgot Password?</a>
          <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
