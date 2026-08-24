"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPassApprovalsPage() {
  const [passes, setPasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPasses();
  }, []);

  const fetchPasses = async () => {
    try {
      const data = await fetchWithAuth("/passes");
      setPasses(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load pass requests");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetchWithAuth(`/passes/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      
      setPasses(passes.map(p => p.id === id ? { ...p, status } : p));
      toast.success(`Pass marked as ${status}`);
    } catch (err: any) {
      toast.error(err.message || "Error updating status");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white mb-1">
            Gate Pass Approvals
          </h2>
          <p className="text-slate-400 text-sm">
            Review and manage student gate passes.
          </p>
        </motion.div>
      </div>

      <motion.div 
        className="glass-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="p-6 border-b border-slate-800/50">
          <h3 className="text-lg font-semibold text-white">All Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 font-semibold">Student</th>
                <th className="px-6 py-4 font-semibold">Date/Time</th>
                <th className="px-6 py-4 font-semibold">Reason</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              <AnimatePresence>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <motion.tr key={`skeleton-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <td className="px-6 py-4"><Skeleton width="120px" height="16px" /></td>
                      <td className="px-6 py-4"><Skeleton width="150px" height="16px" /><Skeleton width="100px" height="12px" className="mt-1" /></td>
                      <td className="px-6 py-4"><Skeleton width="200px" height="16px" /></td>
                      <td className="px-6 py-4"><Skeleton width="80px" height="24px" borderRadius="12px" /></td>
                      <td className="px-6 py-4 text-right"><Skeleton width="100px" height="32px" borderRadius="8px" className="ml-auto" /></td>
                    </motion.tr>
                  ))
                ) : passes.length === 0 ? (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center">
                          <svg className="w-6 h-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                        </div>
                        <p>No gate passes found</p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  passes.map((pass, index) => (
                    <motion.tr 
                      key={pass.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-800/20 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-200">
                        {pass.student?.name || pass.studentId || "Unknown Student"}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        <div className="text-slate-300">{new Date(pass.departureTime).toLocaleDateString()}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {new Date(pass.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                          {new Date(pass.expectedReturnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 max-w-[250px] truncate">
                        {pass.reason}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          pass.status === 'APPROVED'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : pass.status === 'REJECTED'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {pass.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {pass.status === "PENDING" && (
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => updateStatus(pass.id, "APPROVED")}
                              className="px-3 py-1.5 text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => updateStatus(pass.id, "REJECTED")}
                              className="px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
