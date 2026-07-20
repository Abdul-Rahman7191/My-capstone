import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    employeeId: '',
    role: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration Data:', formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white font-mono px-4 py-4">
      
      {/* Logo Header */}
      <div className="text-center mb-3">
        <img src="/logo.jpeg" alt="Ichiban Logo" className="w-[150px] h-auto mx-auto mb-1" />
        <h2 className="text-[#333333] font-bold text-xl">repAIr by Ichiban</h2>
        <p className="text-[#333333] font-semibold text-[14px] tracking-[1px] mt-0.5">ACCOUNT CREATION</p>
      </div>

      {/* Register Box */}
      <div className="w-full max-w-[380px] bg-white border border-[#dcdcdc] px-6 py-5">
        {/* Accent line */}
        <div className="h-[2px] bg-[#e04a4a] mb-4"></div>
        
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mt-2.5">
            <label className="block text-[0.75rem] text-[#e04a4a] font-bold text-left font-mono">
              FULL NAME
            </label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name as per IC" 
              className="w-full bg-[#f7f7f7] border-t-0 border-x-0 border-b border-[#ccc] py-1 px-2.5 mt-1 text-sm text-[#333] placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Corporate Email */}
          <div className="mt-2.5">
            <label className="block text-[0.75rem] text-[#e04a4a] font-bold text-left font-mono">
              CORPORATE EMAIL
            </label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@ichiban.corp" 
              className="w-full bg-[#f7f7f7] border-t-0 border-x-0 border-b border-[#ccc] py-1 px-2.5 mt-1 text-sm text-[#333] placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Employee ID */}
          <div className="mt-2.5">
            <label className="block text-[0.75rem] text-[#e04a4a] font-bold text-left font-mono">
              EMPLOYEE ID
            </label>
            <input 
              type="text" 
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="XXX0000" 
              className="w-full bg-[#f7f7f7] border-t-0 border-x-0 border-b border-[#ccc] py-1 px-2.5 mt-1 text-sm text-[#333] placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* User Roles Dropdown */}
          <div className="mt-2.5">
            <label className="block text-[0.75rem] text-[#e04a4a] font-bold text-left font-mono">
              USER ROLES
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full bg-[#f7f7f7] border-t-0 border-x-0 border-b border-[#ccc] py-1 px-2.5 mt-1 text-sm focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer ${
                formData.role === '' ? 'text-gray-400' : 'text-[#333]'
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%22%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.7rem top 50%',
                backgroundSize: '0.65rem auto',
              }}
            >
              <option value="" disabled hidden>
                Select an option
              </option>
              <option value="Admin" className="text-[#333]">Admin</option>
              <option value="Technician" className="text-[#333]">Technician</option>
            </select>
          </div>

          {/* Password */}
          <div className="mt-2.5">
            <label className="block text-[0.75rem] text-[#e04a4a] font-bold text-left font-mono">
              PASSWORD
            </label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter a strong password" 
              className="w-full bg-[#f7f7f7] border-t-0 border-x-0 border-b border-[#ccc] py-1 px-2.5 mt-1 text-sm text-[#333] placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Confirm Password */}
          <div className="mt-2.5">
            <label className="block text-[0.75rem] text-[#e04a4a] font-bold text-left font-mono">
              CONFIRM PASSWORD
            </label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password" 
              className="w-full bg-[#f7f7f7] border-t-0 border-x-0 border-b border-[#ccc] py-1 px-2.5 mt-1 text-sm text-[#333] placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#007bff] text-white py-2.5 mt-5 text-sm font-bold cursor-pointer hover:opacity-90 transition-opacity"
          >
            CREATE NEW ACCOUNT
          </button>
        </form>

        <p className="text-center text-[0.7rem] mt-3.5">
          <Link to="/login" className="no-underline text-[#333] hover:underline">
            → ALREADY REGISTERED? LOGIN
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;