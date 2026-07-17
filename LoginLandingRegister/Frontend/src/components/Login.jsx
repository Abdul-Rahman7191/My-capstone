import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white font-mono">
      
      {/* Logo Header */}
      <div className="text-center mb-5">
        {/* Logo stays small and centered */}
        <img src="/logo.jpeg" alt="Ichiban Logo" className="w-[180px] h-auto block mx-auto mb-2.5" />
        <h2 className="text-[#333333] font-bold text-2xl">repAIr by Ichiban</h2>
        <p className="text-[#333333] font-semibold text-[18px] tracking-[1px] mt-1">AUTHENTICATION</p>
      </div>

      {/* Login Box */}
      <div className="w-[450px] bg-[#f4f4f7] p-[30px] rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        {/* Accent line */}
        <div className="h-[3px] bg-[#e04a4a] mb-5"></div>
        
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mt-[15px] mb-1.5">
            {/* Added text-left here */}
            <label className="block text-[0.85rem] text-[#e04a4a] font-bold text-left mb-1">
              CORPORATE EMAIL
            </label>
            <input 
              type="email" 
              placeholder="user@ichiban.corp" 
              className="w-full bg-transparent border-t-0 border-x-0 border-b border-[#ccc] py-2 text-[#333] placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="mt-[15px] mb-1.5">
            {/* Added text-left here */}
            <label className="block text-[0.85rem] text-[#e04a4a] font-bold text-left mb-1">
              PASSWORD
            </label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              className="w-full bg-transparent border-t-0 border-x-0 border-b border-[#ccc] py-2 text-[#333] placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#007bff] text-white py-3 mt-5 font-bold rounded-[4px] cursor-pointer hover:opacity-90 transition-opacity"
          >
            LOGIN
          </button>
        </form>

        <p className="text-left text-[0.8rem] mt-5">
          <Link to="/register" className="no-underline text-black hover:underline">
            → CREATE NEW ACCOUNT
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;