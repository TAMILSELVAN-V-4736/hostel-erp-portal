'use client';

import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import toast from 'react-hot-toast';

export default function LeavePage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth('/leaves/my-leaves');
      setLeaves(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error('Please provide a complete date for both start and end.');
      return;
    }
    if (!reason) {
      toast.error('Please provide a reason for your leave.');
      return;
    }
    try {
      setSubmitting(true);
      await fetchWithAuth('/leaves', {
        method: 'POST',
        body: JSON.stringify({ startDate, endDate, reason }),
      });
      setStartDate('');
      setEndDate('');
      setReason('');
      toast.success('Leave requested successfully');
      await loadLeaves();
    } catch (err: any) {
      toast.error(err.message || 'Failed to apply for leave');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'APPROVED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'REJECTED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Leave Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Apply Leave Form */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 rounded-2xl relative overflow-hidden stat-card blue border border-slate-700/50">
            <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Apply for Leave
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-400 ml-1">Start Date</label>
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-glass w-full"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-400 ml-1">End Date</label>
                <input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-glass w-full"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-400 ml-1">Reason</label>
                <textarea 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="input-glass w-full min-h-[100px] resize-y"
                  placeholder="Detailed reason for your leave request..."
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

        {/* Previous Leaves */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6 rounded-2xl min-h-[400px] border border-slate-700/50">
            <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              My Leave History
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : leaves.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-white/40">
                <svg className="w-12 h-12 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No leave requests found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leaves.map((leave) => (
                  <div key={leave.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors duration-300">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-white/80 font-medium">
                            {new Date(leave.startDate).toLocaleDateString()}
                          </span>
                          <span className="text-white/40 text-sm">to</span>
                          <span className="text-white/80 font-medium">
                            {new Date(leave.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-white/60 text-sm mt-2">{leave.reason}</p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(leave.status)}`}>
                          {leave.status}
                        </span>
                        <span className="text-white/30 text-xs">
                          Applied {new Date(leave.createdAt).toLocaleDateString()}
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
