import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Component Imports
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';

function App() {
  return (
    <Router>
      {/* 
        Tailwind Wrapper replacing global layout rules:
        - min-h-screen & w-full: Full height/width coverage
        - font-mono: Matches your corporate monospaced theme
        - bg-white & text-gray-800: Base clean background & text contrast
      */}
      <div className="min-h-screen w-full bg-white font-mono text-gray-800 antialiased selection:bg-[#e04a4a] selection:text-white">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Catch-all Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;