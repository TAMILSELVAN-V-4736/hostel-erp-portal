"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function GrievancesPage() {
  const [grievances, setGrievances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const data = await fetchWithAuth("/grievances/my-requests");
      setGrievances(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load grievances");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('Please fill all fields');
      return;
    }
    setSubmitting(true);

    try {
      await fetchWithAuth("/grievances", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });
      
      toast.success("Grievance submitted successfully!");
      setTitle("");
      setDescription("");
      fetchGrievances();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit grievance");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'APPROVED':
      case 'RESOLVED':
      case 'COMPLETED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'REJECTED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
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
            Grievances
          </h2>
          <p className="text-slate-400 text-sm">
            Report and track your complaints securely.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Form */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 rounded-2xl relative overflow-hidden stat-card red border border-slate-700/50">
            <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Submit Grievance
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-400 ml-1">Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-glass w-full"
                  placeholder="Brief description of the issue"
                  required
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-400 ml-1">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-glass w-full min-h-[120px] resize-y"
                  placeholder="Provide detailed information about your grievance..."
                  required
                />
              </div>
              
              <button 
                type="submit" 
                disabled={submitting}
                className="btn-primary w-full mt-4 flex items-center justify-center bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.2)] hover:shadow-[0_0_25px_rgba(225,29,72,0.4)]"
              >
                {submitting ? 'Submitting...' : 'Submit Grievance'}
              </button>
            </form>
          </div>
        </div>

        {/* Previous Grievances */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6 rounded-2xl min-h-[400px] border border-slate-700/50">
            <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              My Grievances
            </h2>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className="flex justify-between mb-3">
                      <Skeleton width="40%" height="20px" />
                      <Skeleton width="80px" height="24px" borderRadius="12px" />
                    </div>
                    <Skeleton width="80%" height="16px" />
                  </div>
                ))}
              </div>
            ) : grievances.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-500 border border-dashed border-slate-700/50 rounded-xl bg-slate-800/20">
                <svg className="w-12 h-12 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="m9 12 2 2 4-4" />
                </svg>
                <p>No grievances found</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {grievances.map((req, index) => (
                    <motion.div 
                      key={req.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors duration-300"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        <div>
                          <h3 className="text-slate-100 font-medium mb-1">
                            {req.title}
                          </h3>
                          <p className="text-slate-400 text-sm mt-2">{req.description}</p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(req.status)}`}>
                            {req.status}
                          </span>
                          <span className="text-slate-500 text-xs">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

