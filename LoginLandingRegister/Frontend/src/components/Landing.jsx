import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white font-sans">
      <div className="mb-5">
        <img src="/logo.jpeg" alt="Ichiban Logo" className="w-[180px] h-auto block" />
      </div>
      
      <h1 className="text-[3rem] font-extrabold m-0 text-black">
        repAIr by Ichiban
      </h1>
      
    {/* Divider with horizontal lines using flex layout */}
<div className="flex items-center text-[0.8rem] tracking-[2px] text-slate-900 font-semibold mt-[30px] mb-[30px]">
  <div className="h-[1px] bg-[#e04a4a] w-[50px] mr-[15px]"></div>
  <span>AI-POWERED PREDICTIVE MAINTENANCE</span>
  <div className="h-[1px] bg-[#e04a4a] w-[50px] ml-[15px]"></div>
</div>
      
      <div className="flex gap-2.5">
        <Link to="/register">
          <button className="px-10 py-3 font-bold cursor-pointer transition-all duration-300 bg-white border border-[#ddd] text-black hover:opacity-80">
            Sign Up
          </button>
        </Link>
        <Link to="/login">
          <button className="px-10 py-3 font-bold cursor-pointer transition-all duration-300 bg-[#007bff] text-white hover:opacity-80">
            Log In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Landing;