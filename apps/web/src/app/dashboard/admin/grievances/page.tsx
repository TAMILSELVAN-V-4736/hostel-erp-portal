"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminGrievancesPage() {
  const [grievances, setGrievances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const data = await fetchWithAuth("/grievances");
      setGrievances(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load grievances");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetchWithAuth(`/grievances/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      
      setGrievances(grievances.map(g => g.id === id ? { ...g, status } : g));
      toast.success(`Grievance marked as ${status}`);
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
            Grievance Approvals
          </h2>
          <p className="text-slate-400 text-sm">
            Review and manage student grievances.
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
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Description</th>
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
                      <td className="px-6 py-4"><Skeleton width="150px" height="16px" /></td>
                      <td className="px-6 py-4"><Skeleton width="200px" height="16px" /></td>
                      <td className="px-6 py-4"><Skeleton width="80px" height="24px" borderRadius="12px" /></td>
                      <td className="px-6 py-4 text-right"><Skeleton width="100px" height="32px" borderRadius="8px" className="ml-auto" /></td>
                    </motion.tr>
                  ))
                ) : grievances.length === 0 ? (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center">
                          <svg className="w-6 h-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p>No grievances found</p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  grievances.map((grievance, index) => (
                    <motion.tr 
                      key={grievance.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-800/20 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-200">
                        {grievance.student?.name || grievance.studentId || "Unknown Student"}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(grievance.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {grievance.title}
                      </td>
                      <td className="px-6 py-4 text-slate-400 max-w-[250px] truncate">
                        {grievance.description}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          grievance.status === 'RESOLVED'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : grievance.status === 'REJECTED'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {grievance.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {grievance.status === "PENDING" && (
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => updateStatus(grievance.id, "RESOLVED")}
                              className="px-3 py-1.5 text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors"
                            >
                              Resolve
                            </button>
                            <button 
                              onClick={() => updateStatus(grievance.id, "REJECTED")}
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
