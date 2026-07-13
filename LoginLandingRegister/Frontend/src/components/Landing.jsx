import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="logo-placeholder">
        <img src="/logo.jpg" alt="Ichiban Logo" />
      </div>
      <h1>repAIr by Ichiban</h1>
      <div className="divider"><span>AI-POWERED PREDICTIVE MAINTENANCE</span></div>
      <div className="button-group">
        <Link to="/register"><button className="btn-signup">Sign Up</button></Link>
        <Link to="/login"><button className="btn-login">Log In</button></Link>
      </div>
    </div>
  );
};
export default Landing;