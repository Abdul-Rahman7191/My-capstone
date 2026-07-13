import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  return (
    <div className="login-container">
      <div className="logo-header">
        {/* Logo with small-logo class applied */}
        <img src="/logo.jpg" alt="Ichiban Logo" className="small-logo" />
        <h2>repAIr by Ichiban</h2>
        <p className="auth-label">AUTHENTICATION</p>
      </div>
      <div className="login-box">
        <div className="red-line"></div>
        <form>
          <label>CORPORATE EMAIL</label>
          <input type="email" placeholder="user@ichiban.corp" />
          <label>PASSWORD</label>
          <input type="password" placeholder="Enter your password" />
          <button type="submit" className="login-btn">LOGIN</button>
        </form>
        <p className="register-link">
          <Link to="/register">→ CREATE NEW ACCOUNT</Link>
        </p>
      </div>
    </div>
  );
};
export default Login;