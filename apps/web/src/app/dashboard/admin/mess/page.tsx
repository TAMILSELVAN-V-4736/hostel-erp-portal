"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AdminMessPage() {
  const [menu, setMenu] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [activeTab, setActiveTab] = useState<"menu" | "feedback">("menu");
  
  // Edit Menu State
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [formData, setFormData] = useState({ breakfast: "", lunch: "", snacks: "", dinner: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMenu();
    fetchFeedback();
  }, []);

  const fetchMenu = async () => {
    try {
      const data = await fetchWithAuth("/mess/menu");
      // The API returns only existing days. Let's merge it into a full week array
      const fullWeek = Array.from({ length: 7 }).map((_, i) => {
        const existing = data.find((d: any) => d.dayOfWeek === i);
        return existing || { dayOfWeek: i, breakfast: "", lunch: "", snacks: "", dinner: "" };
      });
      setMenu(fullWeek);
    } catch (err: any) {
      toast.error(err.message || "Failed to load mess menu");
    } finally {
      setLoadingMenu(false);
    }
  };

  const fetchFeedback = async () => {
    try {
      const data = await fetchWithAuth("/mess/feedback");
      setFeedback(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load feedback");
    } finally {
      setLoadingFeedback(false);
    }
  };

  const handleEditClick = (dayIndex: number) => {
    const dayMenu = menu.find(m => m.dayOfWeek === dayIndex);
    setFormData({
      breakfast: dayMenu?.breakfast || "",
      lunch: dayMenu?.lunch || "",
      snacks: dayMenu?.snacks || "",
      dinner: dayMenu?.dinner || ""
    });
    setEditingDay(dayIndex);
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDay === null) return;
    
    setSubmitting(true);
    try {
      await fetchWithAuth("/mess/menu", {
        method: "POST",
        body: JSON.stringify({
          dayOfWeek: editingDay,
          ...formData
        })
      });
      
      toast.success(`${DAYS[editingDay]} menu updated!`);
      setEditingDay(null);
      fetchMenu();
    } catch (err: any) {
      toast.error(err.message || "Failed to update menu");
    } finally {
      setSubmitting(false);
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
            Manage Mess
          </h2>
          <p className="text-slate-400 text-sm">
            Update weekly menu and review student feedback.
          </p>
        </motion.div>
        
        <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "menu" ? "bg-indigo-500 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Weekly Menu
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "feedback" ? "bg-indigo-500 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Feedback
          </button>
        </div>
      </div>

      {activeTab === "menu" && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {loadingMenu ? (
            Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="glass-card p-5 rounded-2xl">
                <Skeleton width="100px" height="24px" className="mb-4" />
                <div className="space-y-3">
                  <Skeleton width="100%" height="40px" />
                  <Skeleton width="100%" height="40px" />
                  <Skeleton width="100%" height="40px" />
                  <Skeleton width="100%" height="40px" />
                </div>
              </div>
            ))
          ) : (
            menu.map((day) => (
              <div key={day.dayOfWeek} className="glass-card rounded-2xl border border-slate-700/50 flex flex-col h-full">
                <div className="p-4 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/30">
                  <h3 className="font-semibold text-white">{DAYS[day.dayOfWeek]}</h3>
                  <button 
                    onClick={() => handleEditClick(day.dayOfWeek)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 bg-indigo-500/10 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                </div>
                <div className="p-4 flex-1 space-y-3 text-sm">
                  <div>
                    <span className="text-slate-500 text-xs block mb-0.5">Breakfast</span>
                    <p className="text-slate-300 font-medium">{day.breakfast || <span className="text-slate-600 italic">Not set</span>}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block mb-0.5">Lunch</span>
                    <p className="text-slate-300 font-medium">{day.lunch || <span className="text-slate-600 italic">Not set</span>}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block mb-0.5">Snacks</span>
                    <p className="text-slate-300 font-medium">{day.snacks || <span className="text-slate-600 italic">Not set</span>}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block mb-0.5">Dinner</span>
                    <p className="text-slate-300 font-medium">{day.dinner || <span className="text-slate-600 italic">Not set</span>}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      {activeTab === "feedback" && (
        <motion.div 
          className="glass-card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="p-6 border-b border-slate-800/50">
            <h3 className="text-lg font-semibold text-white">Recent Feedback</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 font-semibold">Student</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Rating</th>
                  <th className="px-6 py-4 font-semibold">Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <AnimatePresence>
                  {loadingFeedback ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <motion.tr key={`skeleton-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <td className="px-6 py-4"><Skeleton width="120px" height="16px" /></td>
                        <td className="px-6 py-4"><Skeleton width="100px" height="16px" /></td>
                        <td className="px-6 py-4"><Skeleton width="60px" height="16px" /></td>
                        <td className="px-6 py-4"><Skeleton width="200px" height="16px" /></td>
                      </motion.tr>
                    ))
                  ) : feedback.length === 0 ? (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                        <p>No feedback received yet</p>
                      </td>
                    </motion.tr>
                  ) : (
                    feedback.map((item, index) => (
                      <motion.tr 
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-slate-800/20 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-slate-200">
                          {item.student?.name || item.studentId}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg 
                                key={i}
                                className={`w-4 h-4 ${i < item.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {item.comment}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Edit Menu Modal */}
      {editingDay !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">Edit {DAYS[editingDay]} Menu</h3>
            </div>
            
            <form onSubmit={handleSaveMenu} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Breakfast</label>
                <input 
                  type="text" 
                  value={formData.breakfast}
                  onChange={e => setFormData({...formData, breakfast: e.target.value})}
                  className="input-glass w-full"
                  placeholder="E.g., Poha, Tea"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Lunch</label>
                <input 
                  type="text" 
                  value={formData.lunch}
                  onChange={e => setFormData({...formData, lunch: e.target.value})}
                  className="input-glass w-full"
                  placeholder="E.g., Rice, Dal, Roti"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Snacks</label>
                <input 
                  type="text" 
                  value={formData.snacks}
                  onChange={e => setFormData({...formData, snacks: e.target.value})}
                  className="input-glass w-full"
                  placeholder="E.g., Samosa, Coffee"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Dinner</label>
                <input 
                  type="text" 
                  value={formData.dinner}
                  onChange={e => setFormData({...formData, dinner: e.target.value})}
                  className="input-glass w-full"
                  placeholder="E.g., Roti, Paneer"
                />
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button 
                  type="button"
                  onClick={() => setEditingDay(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-primary"
                >
                  {submitting ? 'Saving...' : 'Save Menu'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
