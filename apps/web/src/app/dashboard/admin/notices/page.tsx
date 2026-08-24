"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await fetchWithAuth("/notices", {
        method: "POST",
        body: JSON.stringify({ title, content })
      });
      
      toast.success("Notice published successfully!");
      setShowAddModal(false);
      setTitle("");
      setContent("");
      fetchNotices();
    } catch (err: any) {
      toast.error(err.message || "Failed to publish notice");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white mb-1">
            Manage Notices
          </h2>
          <p className="text-slate-400 text-sm">
            Publish announcements for all students.
          </p>
        </motion.div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Publish Notice
        </button>
      </div>

      <motion.div 
        className="glass-card p-6 md:p-8 rounded-2xl border border-slate-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          Recent Notices
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
            <div className="text-xl font-medium text-slate-400 mb-2">No Notices Published</div>
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

      {/* Add Notice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">Publish New Notice</h3>
            </div>
            
            <form onSubmit={handleAddNotice} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Notice Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="input-glass w-full"
                  placeholder="E.g., Upcoming Maintenance"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Content</label>
                <textarea 
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="input-glass w-full min-h-[150px] resize-y"
                  placeholder="Notice details..."
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
                  {submitting ? 'Publishing...' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
