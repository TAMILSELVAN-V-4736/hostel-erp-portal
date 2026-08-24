"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function FeesPage() {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const data = await fetchWithAuth("/fees/my-fees");
      setFees(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load fee records");
    } finally {
      setLoading(false);
    }
  };

  const pendingFees = fees.filter(f => f.status !== "PAID");
  const paidFees = fees.filter(f => f.status === "PAID");

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white mb-1">
            Fees & Payments
          </h2>
          <p className="text-slate-400 text-sm">
            Manage your hostel fees and view payment history.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Fees */}
        <motion.div 
          className="glass-card p-6 rounded-2xl border border-slate-700/50 stat-card red"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pending Dues
          </h2>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <Skeleton width="120px" height="24px" className="mb-2" />
                      <Skeleton width="150px" height="16px" />
                    </div>
                    <div className="flex flex-col items-end">
                      <Skeleton width="80px" height="28px" className="mb-1" />
                      <Skeleton width="60px" height="14px" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : pendingFees.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-slate-500 border border-dashed border-slate-700/50 rounded-xl bg-slate-800/20">
               <svg className="w-12 h-12 mb-3 text-green-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-lg font-medium text-slate-400 mb-1">All clear!</div>
              <div className="text-sm">You have no pending dues.</div>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {pendingFees.map((fee, index) => (
                  <motion.div
                    key={fee.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/40 border border-red-500/20 border-l-4 border-l-red-500 rounded-xl p-5 flex flex-col gap-4 hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-100">
                          {fee.type} Fee
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">
                          Due: <span className={fee.status === "OVERDUE" ? "text-red-400 font-medium" : "text-slate-300"}>{new Date(fee.dueDate).toLocaleDateString()}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-100">
                          ${fee.amount.toFixed(2)}
                        </div>
                        <span className={`text-xs font-semibold uppercase ${fee.status === "OVERDUE" ? "text-red-400" : "text-yellow-400"}`}>
                          {fee.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Paid Fees History */}
        <motion.div 
          className="glass-card p-6 rounded-2xl border border-slate-700/50 stat-card green"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Payment History
          </h2>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <Skeleton width="100px" height="20px" className="mb-2" />
                    <Skeleton width="130px" height="14px" />
                  </div>
                  <div className="flex flex-col items-end">
                    <Skeleton width="60px" height="22px" className="mb-1" />
                    <Skeleton width="50px" height="14px" />
                  </div>
                </div>
              ))}
            </div>
          ) : paidFees.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-slate-500 border border-dashed border-slate-700/50 rounded-xl bg-slate-800/20">
              <div className="text-sm">No previous payments.</div>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {paidFees.map((fee, index) => (
                  <motion.div
                    key={fee.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex justify-between items-center hover:bg-slate-800/60 transition-colors"
                  >
                    <div>
                      <h3 className="text-base font-medium text-slate-200">
                        {fee.type} Fee
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Paid on: {new Date(fee.paidDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-400">
                        ${fee.amount.toFixed(2)}
                      </div>
                      <span className="text-xs text-slate-400 flex items-center justify-end gap-1 mt-1">
                        <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Success
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
