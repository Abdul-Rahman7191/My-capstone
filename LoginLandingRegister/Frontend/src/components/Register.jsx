import React from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  return (
    <div className="register-container">
      <div className="logo-header">
        <img src="/logo.jpg" alt="Ichiban Logo" className="small-logo" />
        <h2>repAIr by Ichiban</h2>
        <p className="auth-label">ACCOUNT CREATION</p>
      </div>
      <div className="register-box">
        <div className="red-line"></div>
        <form>
          <label>FULL NAME</label>
          <input type="text" placeholder="Enter full name as per IC" />
          <label>CORPORATE EMAIL</label>
          <input type="email" placeholder="user@ichiban.corp" />
          <label>EMPLOYEE ID</label>
          <input type="text" placeholder="XXX0008" />
          <label>PASSWORD</label>
          <input type="password" placeholder="Enter a strong password" />
          <label>CONFIRM PASSWORD</label>
          <input type="password" placeholder="Confirm password" />
          <button type="submit" className="register-btn">CREATE NEW ACCOUNT</button>
        </form>
        <p className="login-link">
          <Link to="/login">→ ALREADY REGISTERED? LOGIN</Link>
        </p>
      </div>
    </div>
  );
};
export default Register;