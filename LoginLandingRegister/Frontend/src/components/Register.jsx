import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    employeeId: '',
    userRole: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // Helper: Password strength score (0 to 3)
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass) && pass.length >= 8) score++;
    return score;
  };

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Check for empty fields
    const { fullName, email, employeeId, userRole, password, confirmPassword } = formData;
    if (!fullName || !email || !employeeId || !userRole || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    // 2. Validate Corporate Email Domain
    if (!email.toLowerCase().endsWith('@ichiban.corp')) {
      setError('Must use an official @ichiban.corp corporate email.');
      return;
    }

    // 3. Password Checks
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // 4. Trigger loading & redirect
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-white font-mono px-4 py-4 flex flex-col items-center justify-center">
      
      {/* Compact Logo & Header */}
      <div className="text-center mb-2.5 flex-shrink-0">
        <img src="/logo.jpeg" alt="Ichiban Logo" className="w-[105px] h-auto block mx-auto mb-1" />
        <h2 className="text-[#333333] font-bold text-lg leading-tight">repAIr by Ichiban</h2>
        <p className="text-[#333333] font-semibold text-[11px] tracking-[1.2px]">ACCOUNT CREATION</p>
      </div>

      {/* Register Box Container */}
      <div className="w-full max-w-[420px] bg-[#f4f4f7] p-5 rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex flex-col justify-between">
        
        {/* Top Accent Line */}
        <div className="h-[3px] bg-[#e04a4a] mb-3 flex-shrink-0"></div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2">
          
          {/* Full Name Input */}
          <div>
            <label className="block text-[0.7rem] text-[#e04a4a] font-bold text-left mb-0.5">
              FULL NAME
            </label>
            <input 
              type="text" 
              name="fullName"
              disabled={isLoading}
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name" 
              className="w-full bg-transparent border-t-0 border-x-0 border-b border-[#ccc] py-1 text-xs text-[#333] placeholder-gray-400 focus:outline-none focus:border-black transition-colors disabled:opacity-50"
            />
          </div>

          {/* Corporate Email Input */}
          <div>
            <label className="block text-[0.7rem] text-[#e04a4a] font-bold text-left mb-0.5">
              CORPORATE EMAIL
            </label>
            <input 
              type="email" 
              name="email"
              disabled={isLoading}
              value={formData.email}
              onChange={handleChange}
              placeholder="user@ichiban.corp" 
              className="w-full bg-transparent border-t-0 border-x-0 border-b border-[#ccc] py-1 text-xs text-[#333] placeholder-gray-400 focus:outline-none focus:border-black transition-colors disabled:opacity-50"
            />
          </div>

          {/* Employee ID Input */}
          <div>
            <label className="block text-[0.7rem] text-[#e04a4a] font-bold text-left mb-0.5">
              EMPLOYEE ID
            </label>
            <input 
              type="text" 
              name="employeeId"
              disabled={isLoading}
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="XXX0000" 
              className="w-full bg-transparent border-t-0 border-x-0 border-b border-[#ccc] py-1 text-xs text-[#333] placeholder-gray-400 focus:outline-none focus:border-black transition-colors disabled:opacity-50"
            />
          </div>

          {/* User Roles Dropdown */}
          <div className="relative">
            <label className="block text-[0.7rem] text-[#e04a4a] font-bold text-left mb-0.5">
              USER ROLES
            </label>
            <div className="relative flex items-center">
              <select
                name="userRole"
                disabled={isLoading}
                value={formData.userRole}
                onChange={handleChange}
                className={`w-full bg-transparent border-t-0 border-x-0 border-b border-[#ccc] py-1 pr-8 text-xs appearance-none focus:outline-none focus:border-black transition-colors disabled:opacity-50 cursor-pointer ${
                  formData.userRole === '' ? 'text-gray-400' : 'text-[#333]'
                }`}
              >
                <option value="" disabled hidden>Select an option</option>
                <option value="admin" className="text-black">Admin</option>
                <option value="technician" className="text-black">Technician</option>
              </select>
              <div className="absolute right-0 pointer-events-none text-gray-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="block text-[0.7rem] text-[#e04a4a] font-bold text-left mb-0.5">
              PASSWORD
            </label>
            <div className="relative flex items-center">
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="password"
                disabled={isLoading}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password" 
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-[#ccc] py-1 pr-8 text-xs text-[#333] placeholder-gray-400 focus:outline-none focus:border-black transition-colors disabled:opacity-50"
              />
              {/* Modern Eye Icon Button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 text-gray-400 hover:text-black focus:outline-none cursor-pointer transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  /* Eye Off SVG */
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-10-7-10-7a19.16 19.16 0 013.31-4.22m3.11-2.11C9.44 5.23 10.7 5 12 5c7 0 10 7 10 7a19.1 19.1 0 01-2.15 3.07m-3.32 3.32a3 3 0 01-4.24-4.24M1 1l22 22" />
                  </svg>
                ) : (
                  /* Eye On SVG */
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Password Strength Meter */}
            {formData.password && (
              <div className="flex gap-1 mt-1">
                <div className={`h-0.5 flex-1 rounded ${strength >= 1 ? (strength === 1 ? 'bg-red-500' : strength === 2 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-gray-300'}`} />
                <div className={`h-0.5 flex-1 rounded ${strength >= 2 ? (strength === 2 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-gray-300'}`} />
                <div className={`h-0.5 flex-1 rounded ${strength === 3 ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <div className="flex justify-between items-center mb-0.5">
              <label className="block text-[0.7rem] text-[#e04a4a] font-bold text-left">
                CONFIRM PASSWORD
              </label>
              {formData.confirmPassword && (
                <span className={`text-[9px] font-bold ${formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                  {formData.password === formData.confirmPassword ? '✓ Match' : '✕ Difference'}
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                name="confirmPassword"
                disabled={isLoading}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password" 
                className={`w-full bg-transparent border-t-0 border-x-0 border-b ${
                  formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'border-red-500'
                    : 'border-[#ccc]'
                } py-1 pr-8 text-xs text-[#333] placeholder-gray-400 focus:outline-none focus:border-black transition-colors disabled:opacity-50`}
              />
              {/* Modern Eye Icon Button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 text-gray-400 hover:text-black focus:outline-none cursor-pointer transition-colors"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? (
                  /* Eye Off SVG */
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-10-7-10-7a19.16 19.16 0 013.31-4.22m3.11-2.11C9.44 5.23 10.7 5 12 5c7 0 10 7 10 7a19.1 19.1 0 01-2.15 3.07m-3.32 3.32a3 3 0 01-4.24-4.24M1 1l22 22" />
                  </svg>
                ) : (
                  /* Eye On SVG */
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-[#fce8e8] border border-[#e04a4a] text-[#e04a4a] text-[0.65rem] font-bold p-1.5 rounded mt-1 text-left flex items-center justify-between">
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

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#007bff] text-white py-2 text-xs mt-2 font-bold rounded cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-75"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                CREATING ACCOUNT...
              </span>
            ) : (
              'CREATE NEW ACCOUNT'
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <p className="text-center text-[0.7rem] mt-3 flex-shrink-0">
          <Link to="/login" className="no-underline text-black hover:underline font-bold">
            ← BACK TO LOGIN
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;