"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminFeesPage() {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    amount: "",
    type: "Tuition",
    dueDate: ""
  });

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const data = await fetchWithAuth("/fees");
      setFees(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load fee records");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await fetchWithAuth("/fees", {
        method: "POST",
        body: JSON.stringify({
          studentId: formData.studentId,
          amount: parseFloat(formData.amount),
          type: formData.type,
          dueDate: formData.dueDate
        })
      });
      
      toast.success("Fee invoice generated successfully!");
      setShowAddModal(false);
      setFormData({ studentId: "", amount: "", type: "Tuition", dueDate: "" });
      fetchFees();
    } catch (err: any) {
      toast.error(err.message || "Failed to generate fee invoice");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white mb-1">
            Manage Fees
          </h2>
          <p className="text-slate-400 text-sm">
            Generate and track student fee invoices.
          </p>
        </motion.div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Generate Invoice
        </button>
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
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Due Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
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
                ) : fees.length === 0 ? (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center">
                          <svg className="w-6 h-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p>No fee records found</p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  fees.map((fee, index) => (
                    <motion.tr 
                      key={fee.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-800/20 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-200">
                        {fee.student?.name || fee.studentId || "Unknown Student"}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {fee.type}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-200">
                        ${fee.amount}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(fee.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          fee.status === 'PAID'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : fee.status === 'OVERDUE'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {fee.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
      {/* Add Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">Generate Fee Invoice</h3>
            </div>
            
            <form onSubmit={handleGenerateFee} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Student ID</label>
                <input 
                  type="text" 
                  value={formData.studentId}
                  onChange={e => setFormData({...formData, studentId: e.target.value})}
                  className="input-glass w-full"
                  placeholder="Target Student UUID"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Amount ($)</label>
                  <input 
                    type="number" 
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    className="input-glass w-full"
                    placeholder="100.00"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Fee Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="input-glass w-full"
                    required
                  >
                    <option value="Tuition">Tuition</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Mess">Mess</option>
                    <option value="Library">Library</option>
                    <option value="Penalty">Penalty</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Due Date</label>
                <input 
                  type="date" 
                  value={formData.dueDate}
                  onChange={e => setFormData({...formData, dueDate: e.target.value})}
                  className="input-glass w-full"
                  required
                />
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-primary"
                >
                  {submitting ? 'Generating...' : 'Generate Invoice'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
