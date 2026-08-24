'use client';

import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import toast from 'react-hot-toast';

export default function PassPage() {
  const [passes, setPasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [exitTime, setExitTime] = useState('');
  const [expectedReturnTime, setExpectedReturnTime] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadPasses();
  }, []);

  const loadPasses = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth('/passes/my-passes');
      setPasses(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load passes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exitTime || !expectedReturnTime) {
      toast.error('Please provide a complete date and time for exit and return.');
      return;
    }
    if (!reason) {
      toast.error('Please provide a reason for the gate pass.');
      return;
    }
    try {
      setSubmitting(true);
      await fetchWithAuth('/passes', {
        method: 'POST',
        body: JSON.stringify({ exitTime, expectedReturnTime, reason }),
      });
      setExitTime('');
      setExpectedReturnTime('');
      setReason('');
      toast.success('Gate pass requested successfully');
      await loadPasses();
    } catch (err: any) {
      toast.error(err.message || 'Failed to apply for pass');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'APPROVED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'REJECTED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'COMPLETED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Gate Pass Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Apply Pass Form */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 rounded-2xl relative overflow-hidden stat-card purple border border-slate-700/50">
            <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Request Gate Pass
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-400 ml-1">Exit Time</label>
                <input 
                  type="datetime-local"
                  value={exitTime}
                  onChange={(e) => setExitTime(e.target.value)}
                  className="input-glass w-full"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-400 ml-1">Expected Return Time</label>
                <input 
                  type="datetime-local"
                  value={expectedReturnTime}
                  onChange={(e) => setExpectedReturnTime(e.target.value)}
                  className="input-glass w-full"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-400 ml-1">Reason for Exit</label>
                <textarea 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="input-glass w-full min-h-[100px] resize-y"
                  placeholder="Where are you going?"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={submitting}
                className="btn-primary w-full mt-4 flex items-center justify-center"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>

        {/* Previous Passes */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6 rounded-2xl min-h-[400px] border border-slate-700/50">
            <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              My Gate Passes
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-t-2 border-r-2 border-purple-500 rounded-full animate-spin"></div>
              </div>
            ) : passes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-white/40">
                <svg className="w-12 h-12 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <p>No gate passes found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {passes.map((pass) => (
                  <div key={pass.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors duration-300">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-white/80 font-medium">
                            {new Date(pass.exitTime).toLocaleString()}
                          </span>
                          <span className="text-white/40 text-sm">to</span>
                          <span className="text-white/80 font-medium">
                            {new Date(pass.expectedReturnTime).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-white/60 text-sm mt-2">{pass.reason}</p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(pass.status)}`}>
                          {pass.status}
                        </span>
                        <span className="text-white/30 text-xs">
                          Applied {new Date(pass.createdAt).toLocaleDateString()}
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
