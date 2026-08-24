"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function NoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const data = await fetchWithAuth("/notices");
      setNotices(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <motion.div 
        className="glass-card p-6 md:p-8 rounded-2xl border border-slate-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          Important Notices
        </h2>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                <div className="flex justify-between mb-3">
                  <Skeleton width="60%" height="24px" />
                  <Skeleton width="80px" height="24px" borderRadius="12px" />
                </div>
                <Skeleton width="100%" height="16px" className="mb-2" />
                <Skeleton width="80%" height="16px" />
              </div>
            ))}
          </div>
        ) : notices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-slate-500 border border-dashed border-slate-700/50 rounded-xl bg-slate-800/20">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <div className="text-xl font-medium text-slate-400 mb-2">No Active Notices</div>
            <div className="text-sm">You are all caught up on the latest updates.</div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {notices.map((notice, index) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/40 border-l-4 border-l-indigo-500 border-t border-r border-b border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/60 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-slate-100">
                      {notice.title}
                    </h3>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 shrink-0">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {notice.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
