import React from 'react';

function Register({ setView }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("ACCOUNT CREATION INITIALIZED...");
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <div style={styles.logoCircle}>
          <span style={styles.logoText}>&lt;/&gt;</span>
        </div>
        <div style={styles.logoSubtext}>repAIr by Ichiban</div>
        <div style={styles.systemText}>SYSTEM INITIALIZATION</div>
      </div>

      <div style={styles.authCard}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>FULL NAME</label>
            <input 
              type="text" 
              placeholder="Enter full name as per IC" 
              style={styles.input} 
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>CORPORATE EMAIL</label>
            <input 
              type="email" 
              placeholder="user@ichiban.corp" 
              style={styles.input} 
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>UNIT ID</label>
            <input 
              type="text" 
              placeholder="Format: XXX-0000" 
              style={styles.input} 
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>SECURITY PROTOCOL</label>
            <div style={styles.passwordWrapper}>
              <input 
                type="password" 
                placeholder="Enter access cipher" 
                style={styles.passwordInput} 
                required 
              />
                <span style={styles.eyeIcon}>👁️</span>
            </div>
          </div>

          <button type="submit" style={styles.submitBtn}>
            CREATE NEW ACCOUNT
          </button>

          <div style={styles.toggleText} onClick={() => setView('login')}>
            ➔ ALREADY REGISTERED? LOGIN
          </div>
        </form>
      </div>
      
      <div style={styles.footerText}>SECURE CONNECTION ESTABLISHED</div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#000000',
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
    marginBottom: '20px',
  },
  logoCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#111',
    border: '1px solid #333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#888',
    fontSize: '12px',
  },
  logoSubtext: {
    fontSize: '22px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    marginTop: '15px',
    color: '#ffffff',
  },
  systemText: {
    fontSize: '11px',
    letterSpacing: '2px',
    marginTop: '5px',
    color: '#888888',
  },
  authCard: {
    backgroundColor: '#101010',
    border: '1px solid #222',
    borderTop: '3px solid #ff2a2a',
    padding: '35px 25px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '10px',
    letterSpacing: '1px',
    color: '#ff2a2a',
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#ffffff',
    border: 'none',
    color: '#000000',
    width: '100%',
    padding: '12px',
    fontFamily: 'inherit',
    fontSize: '13px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  passwordWrapper: {
    display: 'flex',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingRight: '10px',
  },
  passwordInput: {
    backgroundColor: '#ffffff',
    border: 'none',
    color: '#000000',
    width: '100%',
    padding: '12px',
    fontFamily: 'inherit',
    fontSize: '13px',
    outline: 'none',
  },
  eyeIcon: {
    color: '#000000',
    cursor: 'pointer',
    fontSize: '14px',
    opacity: 0.7,
  },
  submitBtn: {
    backgroundColor: '#ffffff',
    color: '#000000',
    border: 'none',
    padding: '14px',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    cursor: 'pointer',
    marginTop: '10px',
    textTransform: 'uppercase',
  },
  toggleText: {
    textAlign: 'center',
    fontSize: '10px',
    color: '#888888',
    letterSpacing: '1px',
    marginTop: '20px',
    cursor: 'pointer',
  },
  footerText: {
    fontSize: '9px',
    color: '#444444',
    letterSpacing: '2px',
    marginTop: '30px',
  },
};

export default Register;