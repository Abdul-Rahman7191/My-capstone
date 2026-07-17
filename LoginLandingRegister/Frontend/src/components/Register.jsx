import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white font-mono px-4 py-4">
      
      {/* Logo Header - Tightened margins */}
      <div className="text-center mb-3">
        <img src="/logo.jpg" alt="Ichiban Logo" className="w-[50px] h-auto mx-auto mb-1" />
        <h2 className="text-[#333333] font-bold text-xl">repAIr by Ichiban</h2>
        <p className="text-[#333333] font-semibold text-[14px] tracking-[1px] mt-0.5">ACCOUNT CREATION</p>
      </div>

      {/* Register Box - Reduced padding and internal gaps */}
      <div className="w-full max-w-[380px] bg-white border border-[#dcdcdc] px-6 py-5">
        {/* Accent line */}
        <div className="h-[2px] bg-[#e04a4a] mb-4"></div>
        
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mt-2.5">
            <label className="block text-[0.75rem] text-[#e04a4a] font-bold text-left font-mono">
              FULL NAME
            </label>
            <input 
              type="text" 
              placeholder="Enter full name as per IC" 
              className="w-full bg-[#f7f7f7] border-t-0 border-x-0 border-b border-[#ccc] py-1 px-2.5 mt-1 text-sm text-[#333] placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="mt-2.5">
            <label className="block text-[0.75rem] text-[#e04a4a] font-bold text-left font-mono">
              CORPORATE EMAIL
            </label>
            <input 
              type="email" 
              placeholder="user@ichiban.corp" 
              className="w-full bg-[#f7f7f7] border-t-0 border-x-0 border-b border-[#ccc] py-1 px-2.5 mt-1 text-sm text-[#333] placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="mt-2.5">
            <label className="block text-[0.75rem] text-[#e04a4a] font-bold text-left font-mono">
              EMPLOYEE ID
            </label>
            <input 
              type="text" 
              placeholder="XXX0008" 
              className="w-full bg-[#f7f7f7] border-t-0 border-x-0 border-b border-[#ccc] py-1 px-2.5 mt-1 text-sm text-[#333] placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="mt-2.5">
            <label className="block text-[0.75rem] text-[#e04a4a] font-bold text-left font-mono">
              PASSWORD
            </label>
            <input 
              type="password" 
              placeholder="Enter a strong password" 
              className="w-full bg-[#f7f7f7] border-t-0 border-x-0 border-b border-[#ccc] py-1 px-2.5 mt-1 text-sm text-[#333] placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="mt-2.5">
            <label className="block text-[0.75rem] text-[#e04a4a] font-bold text-left font-mono">
              CONFIRM PASSWORD
            </label>
            <input 
              type="password" 
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