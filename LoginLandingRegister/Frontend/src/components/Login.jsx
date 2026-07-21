import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Dummy Credentials
  const DUMMY_EMAIL = 'xyz@gmail.com';
  const DUMMY_PASSWORD = '1234';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Check for empty fields
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in both email and password fields.');
      return;
    }

    // 2. Check credentials
    if (formData.email !== DUMMY_EMAIL || formData.password !== DUMMY_PASSWORD) {
      setError('Invalid email or password. Please try again.');
      return;
    }

    // 3. Trigger loading animation & redirect
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      navigate('/dashboard'); 
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-hidden bg-white font-mono px-4 py-4">
      
      {/* Logo Header */}
      <div className="text-center mb-3">
        <img src="/logo.jpeg" alt="Ichiban Logo" className="w-[140px] h-auto block mx-auto mb-1.5" />
        <h2 className="text-[#333333] font-bold text-xl leading-tight">repAIr by Ichiban</h2>
        <p className="text-[#333333] font-semibold text-[14px] tracking-[1px] mt-0.5">AUTHENTICATION</p>
      </div>

      {/* Login Box */}
      <div className="w-full max-w-[420px] bg-[#f4f4f7] p-5 rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        
        {/* Accent line */}
        <div className="h-[3px] bg-[#e04a4a] mb-3"></div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email Input */}
          <div className="mb-2">
            <label className="block text-[0.75rem] text-[#e04a4a] font-bold text-left mb-0.5">
              CORPORATE EMAIL
            </label>
            <input 
              type="email" 
              name="email"
              disabled={isLoading}
              value={formData.email}
              onChange={handleChange}
              placeholder="user@ichiban.corp" 
              className={`w-full bg-transparent border-t-0 border-x-0 border-b ${
                error && !formData.email.trim() ? 'border-[#e04a4a]' : 'border-[#ccc]'
              } py-1 text-xs text-[#333] placeholder-gray-400 focus:outline-none focus:border-black transition-colors disabled:opacity-50`}
            />
          </div>

          {/* Password Input */}
          <div className="mb-2 relative">
            <label className="block text-[0.75rem] text-[#e04a4a] font-bold text-left mb-0.5">
              PASSWORD
            </label>
            <div className="relative flex items-center">
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="password"
                disabled={isLoading}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password" 
                className={`w-full bg-transparent border-t-0 border-x-0 border-b ${
                  error && !formData.password.trim() ? 'border-[#e04a4a]' : 'border-[#ccc]'
                } py-1 pr-8 text-xs text-[#333] placeholder-gray-400 focus:outline-none focus:border-black transition-colors disabled:opacity-50`}
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-0 text-gray-500 hover:text-black focus:outline-none cursor-pointer disabled:opacity-50"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error Notification Banner */}
          {error && (
            <div className="bg-[#fce8e8] border border-[#e04a4a] text-[#e04a4a] text-[0.7rem] font-bold p-2 rounded mt-3 text-left flex items-center justify-between">
              <span>⚠️ {error}</span>
              <button 
                type="button" 
                onClick={() => setError('')} 
                className="ml-2 font-bold hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Submit Button with Spinner */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full bg-[#007bff] text-white py-2 text-xs ${error ? 'mt-2' : 'mt-4'} font-bold rounded-[4px] cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-75`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                AUTHENTICATING...
              </span>
            ) : (
              'LOGIN'
            )}
          </button>
        </form>

        {/* Centered Create New Account Link */}
        <p className="text-center text-[0.75rem] mt-3">
          <Link to="/register" className="no-underline text-black hover:underline">
            → CREATE NEW ACCOUNT
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;