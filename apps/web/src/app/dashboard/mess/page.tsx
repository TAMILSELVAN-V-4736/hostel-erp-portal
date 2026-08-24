"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function MessPage() {
  const [menu, setMenu] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth('/mess/menu/today');
      setMenu(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load today\'s menu');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await fetchWithAuth('/mess/feedback', {
        method: 'POST',
        body: JSON.stringify({ rating, comment }),
      });
      setRating(5);
      setComment('');
      toast.success('Feedback submitted successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = dayNames[new Date().getDay()];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Mess Management
          </h1>
          <p className="text-slate-400 text-sm">
            View today's menu and provide your feedback.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Menu */}
        <div className="lg:col-span-2">
          <motion.div 
            className="glass-card p-6 rounded-2xl min-h-[400px] border border-slate-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Today's Menu
              </div>
              <span className="text-sm font-medium px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                {todayName}
              </span>
            </h2>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <Skeleton width="40%" height="24px" />
                      <Skeleton width="60px" height="20px" borderRadius="6px" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton width="80%" height="16px" />
                      <Skeleton width="60%" height="16px" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !menu ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-500 bg-slate-800/20 rounded-xl border border-slate-700/30 border-dashed">
                <svg className="w-12 h-12 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p>Menu not available for today</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence>
                  <MenuCard title="Breakfast" items={menu.breakfast} icon="🌅" time="07:30 AM - 09:00 AM" index={0} />
                  <MenuCard title="Lunch" items={menu.lunch} icon="☀️" time="12:30 PM - 02:00 PM" index={1} />
                  <MenuCard title="Snacks" items={menu.snacks} icon="☕" time="05:00 PM - 06:00 PM" index={2} />
                  <MenuCard title="Dinner" items={menu.dinner} icon="🌙" time="07:30 PM - 09:00 PM" index={3} />
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>

        {/* Feedback Form */}
        <div className="lg:col-span-1">
          <motion.div 
            className="glass-card p-6 rounded-2xl relative overflow-hidden stat-card amber border border-slate-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Food Feedback
            </h2>
            
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-400 ml-1">Rating</label>
                <div className="flex gap-2 p-2 bg-slate-900/50 rounded-xl justify-between border border-white/5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-lg transition-colors ${rating >= star ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-400 ml-1">Comments (Optional)</label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="input-glass w-full min-h-[120px] resize-y"
                  placeholder="Tell us what you liked or what could be improved..."
                />
              </div>
              
              <button 
                type="submit" 
                disabled={submitting}
                className="btn-primary w-full mt-4 flex items-center justify-center bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-[0_0_20px_rgba(217,119,6,0.2)] hover:shadow-[0_0_25px_rgba(217,119,6,0.4)]"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function MenuCard({ title, items, icon, time, index }: { title: string, items: string, icon: string, time: string, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/60 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <span>{icon}</span> {title}
        </h3>
        <span className="text-xs text-slate-400 bg-slate-900/50 px-2 py-1 rounded-md border border-slate-700">
          {time}
        </span>
      </div>
      <div className="text-slate-300 text-sm leading-relaxed pl-7">
        {items ? (
          <ul className="list-disc space-y-1 marker:text-amber-500">
            {items.split(',').map((item, i) => (
              <li key={i}>{item.trim()}</li>
            ))}
          </ul>
        ) : (
          <span className="text-slate-500 italic">Not available</span>
        )}
      </div>
    </motion.div>
  );
}
