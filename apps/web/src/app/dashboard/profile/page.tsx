"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await fetchWithAuth("/users/profile");
      setUser(data);
      if (data.student?.contactNumber) {
        setContactNumber(data.student.contactNumber);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const payload: any = {};
      if (password) payload.password = password;
      if (contactNumber && user.role === 'STUDENT') payload.contactNumber = contactNumber;
      
      await fetchWithAuth("/users/profile", {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
      
      toast.success("Profile updated successfully!");
      setPassword(""); // Clear password field after save
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Skeleton width="64px" height="64px" className="rounded-2xl" />
        <div>
          <Skeleton width="150px" height="32px" className="mb-2" />
          <Skeleton width="250px" height="16px" />
        </div>
      </div>
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-700/50 p-8">
        <Skeleton width="180px" height="24px" className="mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2"><Skeleton width="100px" height="16px" /><Skeleton width="100%" height="40px" className="rounded-lg" /></div>
          <div className="space-y-2"><Skeleton width="100px" height="16px" /><Skeleton width="100%" height="40px" className="rounded-lg" /></div>
          <div className="space-y-2"><Skeleton width="100px" height="16px" /><Skeleton width="100%" height="40px" className="rounded-lg" /></div>
          <div className="space-y-2"><Skeleton width="100px" height="16px" /><Skeleton width="100%" height="40px" className="rounded-lg" /></div>
        </div>
      </div>
    </div>
  );

  if (!user) return <div className="text-center p-10 text-slate-400">Profile data not found. Please log in again.</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <motion.div 
        className="flex items-center gap-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-500/30">
          {user.email?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-100">My Profile</h2>
          <p className="text-slate-400 mt-1">Manage your account details and preferences.</p>
        </div>
      </motion.div>
      
      <motion.div 
        className="glass-card rounded-2xl overflow-hidden stat-card blue border border-slate-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="p-8 border-b border-slate-700/50">
          <h3 className="text-xl font-semibold text-slate-100 mb-6">Account Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 ml-1">Email Address</label>
              <input 
                className="input-glass w-full" 
                value={user.email} 
                disabled 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 ml-1">Account Role</label>
              <div className="relative">
                <input 
                  className="input-glass w-full font-semibold text-indigo-400" 
                  value={user.role} 
                  disabled 
                />
              </div>
            </div>
            
            {user.role === 'STUDENT' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Student ID / Enrollment</label>
                  <input 
                    className="input-glass w-full" 
                    value={user.student?.enrollmentNumber || "Not linked"} 
                    disabled 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Contact Number</label>
                  <input 
                    className="input-glass w-full" 
                    placeholder="Add your contact number" 
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 ml-1">Update Password</label>
              <input 
                type="password"
                className="input-glass w-full" 
                placeholder="Enter new password (optional)" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-slate-900/40 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={submitting}
            className="btn-primary flex items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
