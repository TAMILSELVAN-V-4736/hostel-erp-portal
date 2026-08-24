"use client";

import { motion } from "framer-motion";

export default function MyRoomPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <motion.div 
        className="flex items-center gap-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-100">My Room</h2>
          <p className="text-slate-400 mt-1">Manage your room allocation and details.</p>
        </div>
      </motion.div>
      
      <motion.div 
        className="glass-card rounded-2xl overflow-hidden stat-card purple border border-slate-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="p-8 border-b border-slate-700/50">
          <h3 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Current Allocation
          </h3>
          
          <div className="p-8 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
            <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path><path d="M2 17h20"></path><path d="M6 8v9"></path>
              </svg>
            </div>
            <p className="text-slate-400 font-medium">You do not have a room allocated yet.</p>
            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
              Please submit a request to the admin to get a room allocated in the hostel.
            </p>
          </div>
        </div>
        
        <div className="p-6 bg-slate-900/40">
          <button className="btn-primary w-full flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Request Room Allocation
          </button>
        </div>
      </motion.div>
    </div>
  );
}
