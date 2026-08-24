"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AllocationsPage() {
  const [allocations, setAllocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    bedId: ""
  });

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth("/allocations");
      setAllocations(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch allocations");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetchWithAuth("/allocations", {
        method: "POST",
        body: JSON.stringify({
          studentId: formData.studentId,
          bedId: formData.bedId
        })
      });
      toast.success("Allocation created successfully");
      setShowAddModal(false);
      setFormData({ studentId: "", bedId: "" });
      fetchAllocations();
    } catch (err: any) {
      toast.error(err.message || "Failed to create allocation");
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
            Room Allocations
          </h2>
          <p className="text-slate-400 text-sm">
            Manage student room assignments
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
          New Allocation
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
              className="glass-card w-full max-w-lg rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/50">
                <h3 className="text-xl font-semibold text-white">Create Allocation</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <form onSubmit={handleAddAllocation} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Student Roll Number (ID)</label>
                  <input required type="text" className="input-glass w-full" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} placeholder="e.g. CS2024001" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Bed ID (UUID)</label>
                  <input required type="text" className="input-glass w-full" value={formData.bedId} onChange={e => setFormData({...formData, bedId: e.target.value})} placeholder="Enter Bed UUID" />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn-primary">
                    {submitting ? 'Allocating...' : 'Allocate Room'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="glass-card rounded-2xl overflow-hidden border border-slate-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-900/50">
                <th className="p-4 text-sm font-semibold text-slate-300">Student</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Room & Bed</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Allocated At</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Status</th>
                <th className="p-4 text-sm font-semibold text-slate-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-700/30">
                    <td className="p-4"><Skeleton width="150px" height="20px" /></td>
                    <td className="p-4"><Skeleton width="100px" height="20px" /></td>
                    <td className="p-4"><Skeleton width="100px" height="20px" /></td>
                    <td className="p-4"><Skeleton width="80px" height="20px" /></td>
                    <td className="p-4 flex justify-end"><Skeleton width="70px" height="32px" borderRadius="8px" /></td>
                  </tr>
                ))
              ) : allocations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    No room allocations found
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {allocations.map((alloc, i) => (
                    <motion.tr
                      key={alloc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-4 text-slate-200 font-medium">
                        {alloc.student?.name || alloc.studentId}
                      </td>
                      <td className="p-4 text-slate-400">
                        {alloc.bed?.room?.number ? `Room ${alloc.bed.room.number}` : "Unknown Room"} - Bed {alloc.bed?.number || alloc.bedId}
                      </td>
                      <td className="p-4 text-slate-400">
                        {new Date(alloc.allocatedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          alloc.status === 'ACTIVE' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                        }`}>
                          {alloc.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors">
                          Manage
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
