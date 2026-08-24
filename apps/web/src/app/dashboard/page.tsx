"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import { fetchWithAuth } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
  blue: { bg: "rgba(59, 130, 246, 0.08)", text: "#60a5fa", iconBg: "rgba(59, 130, 246, 0.15)" },
  purple: { bg: "rgba(139, 92, 246, 0.08)", text: "#a78bfa", iconBg: "rgba(139, 92, 246, 0.15)" },
  green: { bg: "rgba(16, 185, 129, 0.08)", text: "#34d399", iconBg: "rgba(16, 185, 129, 0.15)" },
  orange: { bg: "rgba(245, 158, 11, 0.08)", text: "#fbbf24", iconBg: "rgba(245, 158, 11, 0.15)" },
};

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    
    if (currentUser && currentUser.role !== "STUDENT") {
      fetchAdminStats();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAdminStats = async () => {
    try {
      const data = await fetchWithAuth("/analytics/dashboard");
      setAdminData(data);
    } catch (e) {
      console.error("Failed to fetch admin stats", e);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) return <div>Loading dashboard...</div>;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const isAdmin = user.role !== "STUDENT";

  const renderStudentDashboard = () => (
    <div className="glass-card animate-slide-up stagger-1" style={{ borderRadius: "16px", padding: "32px", opacity: 0 }}>
      <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#f1f5f9", marginBottom: "16px" }}>
        Your Quick Access
      </h3>
      <p style={{ color: "#94a3b8", lineHeight: 1.6 }}>
        Use the sidebar to navigate to your profile, apply for leaves, raise maintenance requests, or check your hostel fees.
      </p>
    </div>
  );

  const renderAdminDashboard = () => {
    if (!adminData) return <div>Failed to load stats.</div>;

    const stats = [
      {
        label: "Total Students",
        value: adminData.stats.totalStudents,
        change: "Active",
        trend: "up",
        color: "blue",
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
      {
        label: "Occupancy Rate",
        value: `${adminData.stats.occupancyRate}%`,
        change: `${adminData.stats.occupiedBeds} / ${adminData.stats.totalBeds} beds`,
        trend: "up",
        color: "purple",
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
          </svg>
        ),
      },
      {
        label: "Pending Leaves",
        value: adminData.stats.pendingLeaves,
        change: "Requires Action",
        trend: "up",
        color: "orange",
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        ),
      },
      {
        label: "Active Grievances",
        value: adminData.stats.activeGrievances,
        change: "Unresolved",
        trend: "down",
        color: "green",
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
          </svg>
        ),
      },
    ];

    return (
      <div className="space-y-6">
        {/* Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          {stats.map((stat, i) => {
            const c = colorMap[stat.color];
            return (
              <div
                key={stat.label}
                className={`glass-card stat-card ${stat.color} animate-slide-up stagger-${i + 1}`}
                style={{ borderRadius: "16px", padding: "24px", opacity: 0 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: "8px", fontWeight: 500 }}>
                      {stat.label}
                    </p>
                    <p style={{ fontSize: "1.8rem", fontWeight: 700, color: "#f1f5f9", lineHeight: 1 }}>
                      {stat.value}
                    </p>
                    <p style={{ fontSize: "0.78rem", color: c.text, marginTop: "8px", fontWeight: 500 }}>
                      {stat.change}
                    </p>
                  </div>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      background: c.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: c.text,
                    }}
                  >
                    {stat.icon}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        {adminData.chartData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up stagger-5" style={{ opacity: 0 }}>
            {/* Revenue Chart */}
            <div className="glass-card p-6" style={{ borderRadius: "16px" }}>
              <h3 className="text-[0.95rem] font-semibold text-[#f1f5f9] mb-4">Revenue Trend (Last 6 Months)</h3>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <BarChart data={adminData.chartData.revenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                    <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Occupancy and Requests */}
            <div className="space-y-6">
              {/* Requests Breakdown */}
              <div className="glass-card p-6" style={{ borderRadius: "16px" }}>
                <h3 className="text-[0.95rem] font-semibold text-[#f1f5f9] mb-4">Pending Requests Breakdown</h3>
                <div className="flex justify-center" style={{ width: '100%', height: 200 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={adminData.chartData.requests}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {adminData.chartData.requests.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div
          className="glass-card animate-slide-up stagger-6"
          style={{ borderRadius: "16px", padding: "24px", opacity: 0 }}
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "#f1f5f9",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Recent System Activity
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {adminData.recentActivity.map((item: any, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  transition: "background 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: item.color,
                      boxShadow: `0 0 8px ${item.color}40`,
                    }}
                  />
                  <div>
                    <p style={{ fontSize: "0.88rem", fontWeight: 500, color: "#e2e8f0" }}>
                      {item.action}
                    </p>
                    <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>
                      {item.detail}
                    </p>
                  </div>
                </div>
                <span style={{ fontSize: "0.75rem", color: "#475569", whiteSpace: "nowrap" }}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="animate-slide-up" style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "#f1f5f9",
            marginBottom: "6px",
          }}
        >
          {greeting()},{" "}
          <span className="gradient-text">{user.email?.split("@")[0]}</span> 👋
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.92rem" }}>
          {isAdmin ? "Here's what's happening in your hostel today" : "Welcome to the Hostel ERP Portal"}
        </p>
      </div>

      {isAdmin ? renderAdminDashboard() : renderStudentDashboard()}
    </div>
  );
}
