"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";

export default function MaintenancePage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("OTHER");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth('/maintenance/my-requests');
      setRequests(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load maintenance requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category) {
      setError('Please fill all fields');
      return;
    }
    try {
      setSubmitting(true);
      setError('');
      await fetchWithAuth('/maintenance', {
        method: 'POST',
        body: JSON.stringify({ title, description, category }),
      });
      setTitle('');
      setDescription('');
      setCategory('OTHER');
      await loadRequests();
    } catch (err: any) {
      setError(err.message || 'Failed to submit maintenance request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'APPROVED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'REJECTED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'COMPLETED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">Maintenance Request</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Form */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 rounded-2xl relative overflow-hidden stat-card orange border border-slate-700/50">
            <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
              Report an Issue
            </h2>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-400 ml-1">Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-glass w-full"
                  placeholder="e.g. Fan not working"
                  required
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-400 ml-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-glass w-full appearance-none"
                  required
                >
                  <option value="PLUMBING" className="bg-slate-900 text-slate-100">Plumbing</option>
                  <option value="ELECTRICAL" className="bg-slate-900 text-slate-100">Electrical</option>
                  <option value="FURNITURE" className="bg-slate-900 text-slate-100">Furniture</option>
                  <option value="OTHER" className="bg-slate-900 text-slate-100">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-400 ml-1">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-glass w-full min-h-[100px] resize-y"
                  placeholder="Describe the issue in detail..."
                  required
                />
              </div>
              
              <button 
                type="submit" 
                disabled={submitting}
                className="btn-primary w-full mt-4 flex items-center justify-center bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-[0_0_20px_rgba(234,88,12,0.2)] hover:shadow-[0_0_25px_rgba(234,88,12,0.4)]"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>

        {/* Previous Requests */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6 rounded-2xl min-h-[400px] border border-slate-700/50">
            <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              My Maintenance History
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-t-2 border-r-2 border-orange-500 rounded-full animate-spin"></div>
              </div>
            ) : requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                <svg className="w-12 h-12 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
                <p>No maintenance requests found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div key={req.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors duration-300">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-slate-100 font-medium">
                            {req.title}
                          </span>
                          <span className="text-slate-400 text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                            {req.category}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mt-2">{req.description}</p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                        <span className="text-slate-500 text-xs">
                          Reported {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
