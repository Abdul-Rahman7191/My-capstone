import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your corporate email.');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulate API request to send reset email
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-hidden bg-white font-mono px-4 py-4">
      
      {/* Header */}
      <div className="text-center mb-3">
        <img src="/logo.jpeg" alt="Ichiban Logo" className="w-[140px] h-auto block mx-auto mb-1.5" />
        <h2 className="text-[#333333] font-bold text-xl leading-tight">repAIr by Ichiban</h2>
        <p className="text-[#333333] font-semibold text-[14px] tracking-[1px] mt-0.5">RESET PASSWORD</p>
      </div>

      {/* Box Container */}
      <div className="w-full max-w-[420px] bg-[#f4f4f7] p-5 rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        
        {/* Accent line */}
        <div className="h-[3px] bg-[#e04a4a] mb-3"></div>

        {!submitted ? (
          <form onSubmit={handleSubmit} noValidate>
            <p className="text-xs text-gray-600 mb-4 text-left">
              Enter your corporate email address and we'll send you instructions to reset your password.
            </p>

            {/* Email Input */}
            <div className="mb-3">
              <label className="block text-[0.75rem] text-[#e04a4a] font-bold text-left mb-0.5">
                CORPORATE EMAIL
              </label>
              <input 
                type="email" 
                name="email"
                disabled={isLoading}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="user@ichiban.corp" 
                className={`w-full bg-transparent border-t-0 border-x-0 border-b ${
                  error ? 'border-[#e04a4a]' : 'border-[#ccc]'
                } py-1 text-xs text-[#333] placeholder-gray-400 focus:outline-none focus:border-black transition-colors disabled:opacity-50`}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-[#fce8e8] border border-[#e04a4a] text-[#e04a4a] text-[0.7rem] font-bold p-2 rounded mb-3 text-left">
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#007bff] text-white py-2 text-xs font-bold rounded-[4px] cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-75"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  SENDING LINK...
                </span>
              ) : (
                'SEND RESET LINK'
              )}
            </button>
          </form>
        ) : (
          /* Confirmation Message */
          <div className="text-center py-2">
            <div className="text-2xl mb-2">✉️</div>
            <h3 className="font-bold text-sm text-[#333] mb-1">Check Your Inbox</h3>
            <p className="text-xs text-gray-600 mb-4">
              We have sent password recovery instructions to <br/>
              <span className="font-bold text-black">{email}</span>
            </p>
          </div>
        )}

        {/* Back to Login Link */}
        <p className="text-center text-[0.75rem] mt-3 border-t border-gray-200 pt-3">
          <Link to="/" className="no-underline text-black hover:underline font-bold">
            ← BACK TO LOGIN
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;