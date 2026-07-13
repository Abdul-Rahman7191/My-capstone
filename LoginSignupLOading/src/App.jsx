import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Landing from './components/Landing';

function App() {
  // Views can be: 'landing', 'login', or 'register'
  const [view, setView] = useState('landing');

  return (
    <div style={{ backgroundColor: '#0f0f12', minHeight: '100vh', color: '#fff' }}>
      {view === 'landing' && <Landing setView={setView} />}
      {view === 'login' && <Login setView={setView} />}
      {view === 'register' && <Register setView={setView} />}
    </div>
  );
}

export default App;