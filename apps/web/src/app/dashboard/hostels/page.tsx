"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function HostelsPage() {
  const [hostels, setHostels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const data = await fetchWithAuth("/hostels");
      setHostels(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load hostels");
    } finally {
      setLoading(false);
    }
  };

  const handleAddHostel = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetchWithAuth("/hostels", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      toast.success("Hostel added successfully");
      setShowAddModal(false);
      setFormData({ name: "" });
      fetchHostels();
    } catch (err: any) {
      toast.error(err.message || "Failed to add hostel");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white mb-1">
            Hostel Management
          </h2>
          <p className="text-slate-400 text-sm">
            Manage infrastructure, blocks, and rooms
          </p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="btn-primary flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Hostel
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card w-full max-w-md rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/50">
                <h3 className="text-xl font-semibold text-white">Add New Hostel</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <form onSubmit={handleAddHostel} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Hostel Name</label>
                  <input required type="text" className="input-glass w-full" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Boys Hostel A" />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn-primary">
                    {submitting ? 'Saving...' : 'Save Hostel'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 border border-slate-700/30">
              <Skeleton width="60%" height="24px" className="mb-4" />
              <Skeleton width="100%" height="100px" className="rounded-xl mb-4" />
              <Skeleton width="40%" height="36px" className="rounded-lg" />
            </div>
          ))
        ) : hostels.length === 0 ? (
          <div className="col-span-full p-10 text-center glass-card rounded-2xl border border-slate-700/50">
            <svg className="w-12 h-12 mx-auto mb-3 text-slate-500 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <h3 className="text-lg font-medium text-slate-300 mb-1">No Hostels Found</h3>
            <p className="text-slate-500 mb-4 text-sm">Get started by creating your first hostel building.</p>
            <button onClick={() => setShowAddModal(true)} className="btn-primary mx-auto text-sm px-4 py-2">
              Add Hostel
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {hostels.map((hostel, i) => (
              <motion.div
                key={hostel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 border border-slate-700/50 hover:border-indigo-500/50 transition-colors flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{hostel.name}</h3>
                  <div className="bg-indigo-500/20 text-indigo-300 p-2 rounded-lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                </div>
                
                <p className="text-slate-400 text-sm mb-6 flex-grow">
                  Manage the blocks, floors, and rooms inside {hostel.name}.
                </p>
                
                <Link href={`/dashboard/admin/hostels/${hostel.id}`} className="w-full inline-flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-2 px-4 transition-colors font-medium border border-slate-600">
                  Manage Structure
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
