import React from 'react';

function Login({ setView }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Your login session initialization logic goes here
    alert("INITIALIZING SESSION...");
  };

  return (
    <div style={styles.container}>
      {/* Top Logo Container */}
      <div style={styles.logoContainer}>
        <div style={styles.logoCircle}>
          <span style={styles.logoText}>&lt;/&gt;</span>
        </div>
        <div style={styles.logoSubtext}>ICHIBAN</div>
      </div>

      {/* Main Authentication Card */}
      <div style={styles.authCard}>
        <h1 style={styles.mainTitle}>AUTHENTICATION</h1>
        <p style={styles.subTitle}>SYSTEM ACCESS REQUIRED</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Operator ID Field */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>OPERATOR ID</label>
            <div style={styles.inputWrapper}>
              <span style={styles.icon}>🪪</span>
              <input 
                type="text" 
                placeholder="OP-XXXX" 
                style={styles.input} 
                required 
              />
            </div>
          </div>

          {/* Access Key Field */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>ACCESS KEY</label>
            <div style={styles.inputWrapper}>
              <span style={styles.icon}>🔑</span>
              <input 
                type="password" 
                placeholder="••••••••" 
                style={styles.input} 
                required 
              />
            </div>
          </div>

          {/* Action Submission Button */}
          <button type="submit" style={styles.submitBtn}>
            INITIALIZE SESSION ➔
          </button>

          {/* Dynamic Link back to Register component state */}
          <div style={styles.toggleText} onClick={() => setView('register')}>
            CREATE NEW ACCOUNT
          </div>
        </form>
      </div>
    </div>
  );
}

// Exactly matching dark sci-fi terminal styles
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
    borderTop: '3px solid #ff2a2a', // Crimson glow indicator strip
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    letterSpacing: '1px',
    color: '#aaaaaa',
    marginBottom: '8px',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1a1a1f',
    border: '1px solid #2d2d35',
    padding: '8px 12px',
    borderRadius: '2px',
  },
  icon: {
    marginRight: '10px',
    opacity: 0.4,
    fontSize: '14px',
  },
  input: {
    background: 'transparent',
    border: 'none',
    color: '#ffffff',
    width: '100%',
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: '14px',
    letterSpacing: '1px',
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
    marginTop: '15px',
    borderRadius: '2px',
    textTransform: 'uppercase',
  },
  toggleText: {
    textAlign: 'center',
    fontSize: '11px',
    color: '#66666d',
    letterSpacing: '1px',
    marginTop: '25px',
    cursor: 'pointer',
  },
};

export default Login;