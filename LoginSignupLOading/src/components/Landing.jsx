import React from 'react';

function Landing({ setView }) {
  return (
    <div style={styles.container}>
      {/* Top Logo */}
      <div style={styles.logoContainer}>
        <div style={styles.logoCircle}>
          <span style={styles.logoText}>&lt;/&gt;</span>
        </div>
        <div style={styles.logoSubtext}>ICHIBAN</div>
      </div>

      {/* Main Card Container */}
      <div style={styles.authCard}>
        <h1 style={styles.mainTitle}>SYSTEM ACCESS</h1>
        <p style={styles.subTitle}>SELECT INITIALIZATION GATEWAY</p>

        <div style={styles.buttonGroup}>
          <button 
            onClick={() => setView('login')} 
            style={styles.submitBtn}
          >
            EXISTING OPERATOR LOGIN ➔
          </button>

          <button 
            onClick={() => setView('register')} 
            style={styles.secondaryBtn}
          >
            REGISTER NEW ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
}

// Matching dark terminal UI styling
const styles = {
  container: {
    backgroundColor: '#0f0f12',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Courier New", Courier, monospace, sans-serif',
    color: '#ffffff',
    margin: 0,
    padding: '20px',
    userSelect: 'none',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '25px',
  },
  logoCircle: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#000000',
    border: '2px solid #8b0000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 10px rgba(139, 0, 0, 0.5)',
  },
  logoText: {
    color: '#ff2a2a',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  logoSubtext: {
    fontSize: '10px',
    letterSpacing: '3px',
    marginTop: '8px',
    color: '#888888',
  },
  authCard: {
    backgroundColor: '#141417',
    border: '1px solid #222226',
    borderTop: '3px solid #ff2a2a',
    padding: '40px 30px',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
  },
  mainTitle: {
    fontSize: '24px',
    letterSpacing: '2px',
    margin: '0 0 5px 0',
    fontWeight: '500',
  },
  subTitle: {
    fontSize: '11px',
    color: '#888888',
    letterSpacing: '2px',
    margin: '0 0 30px 0',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '10px',
  },
  submitBtn: {
    backgroundColor: '#ffffff',
    color: '#000000',
    border: 'none',
    padding: '14px',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    cursor: 'pointer',
    borderRadius: '2px',
    textTransform: 'uppercase',
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '1px solid #2d2d35',
    padding: '14px',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    cursor: 'pointer',
    borderRadius: '2px',
    textTransform: 'uppercase',
    transition: 'background-color 0.2s ease',
  },
};

export default Landing;