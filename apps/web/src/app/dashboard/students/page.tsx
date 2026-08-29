"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rollNumber: "",
    department: "",
    contactNo: "",
    bloodGroup: ""
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await fetchWithAuth("/students");
      setStudents(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // 1. Create the User account
      const userResult = await fetchWithAuth("/users", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: "STUDENT"
        })
      });
      
      // 2. Create the Student profile
      await fetchWithAuth("/students", {
        method: "POST",
        body: JSON.stringify({
          userId: userResult.id,
          rollNumber: formData.rollNumber,
          department: formData.department,
        })
      });
      
      // fetchWithAuth automatically throws on error, no need to check res.ok
      
      toast.success("Student added successfully");
      setShowAddModal(false);
      setFormData({ name: "", email: "", password: "", rollNumber: "", department: "", contactNo: "", bloodGroup: "" });
      fetchStudents();
    } catch (err: any) {
      toast.error(err.message || "Failed to add student");
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
            Student Management
          </h2>
          <p className="text-slate-400 text-sm">
            View and manage all registered students
          </p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="btn-primary flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Student
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card w-full max-w-lg rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/50">
                <h3 className="text-xl font-semibold text-white">Add New Student</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <form onSubmit={handleAddStudent} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Full Name</label>
                  <input required type="text" className="input-glass w-full" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Email (Used for Login)</label>
                  <input required type="email" className="input-glass w-full" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Roll Number</label>
                    <input required type="text" className="input-glass w-full" value={formData.rollNumber} onChange={e => setFormData({...formData, rollNumber: e.target.value})} placeholder="CS2023001" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Department</label>
                    <input required type="text" className="input-glass w-full" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} placeholder="Computer Science" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Contact Number</label>
                  <input type="text" className="input-glass w-full" value={formData.contactNo} onChange={e => setFormData({...formData, contactNo: e.target.value})} placeholder="+1 234 567 8900" />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn-primary">
                    {submitting ? 'Saving...' : 'Save Student'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="glass-card rounded-2xl overflow-hidden border border-slate-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-900/50">
                <th className="p-4 text-sm font-semibold text-slate-300">Name</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Roll Number</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Department</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Contact</th>
                <th className="p-4 text-sm font-semibold text-slate-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-700/30">
                    <td className="p-4"><Skeleton width="120px" height="20px" /></td>
                    <td className="p-4"><Skeleton width="90px" height="20px" /></td>
                    <td className="p-4"><Skeleton width="110px" height="20px" /></td>
                    <td className="p-4"><Skeleton width="100px" height="20px" /></td>
                    <td className="p-4 flex justify-end"><Skeleton width="60px" height="32px" borderRadius="8px" /></td>
                  </tr>
                ))
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <line x1="19" x2="19" y1="8" y2="14"></line>
                      <line x1="22" x2="16" y1="11" y2="11"></line>
                    </svg>
                    No students found. Add a new student to get started.
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {students.map((student, i) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-4 text-slate-200 font-medium">
                        {student.name || student.user?.name || "N/A"}
                      </td>
                      <td className="p-4 text-slate-400">
                        {student.rollNumber || "N/A"}
                      </td>
                      <td className="p-4 text-slate-400">
                        {student.department || "N/A"}
                      </td>
                      <td className="p-4 text-slate-400">
                        {student.contactNo || "N/A"}
                      </td>
                      <td className="p-4 text-right">
                        <button className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors">
                          Manage
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
