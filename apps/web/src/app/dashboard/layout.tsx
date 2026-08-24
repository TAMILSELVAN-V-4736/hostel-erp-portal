"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUser, logout } from "@/lib/auth";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "grid", roles: ["all"] },
  { label: "Profile", path: "/dashboard/profile", icon: "user", roles: ["all"] },
  { label: "My Room", path: "/dashboard/room", icon: "bed", roles: ["STUDENT"] },
  { label: "Leave", path: "/dashboard/leave", icon: "calendar", roles: ["STUDENT"] },
  { label: "Gate Pass", path: "/dashboard/pass", icon: "ticket", roles: ["STUDENT"] },
  { label: "Maintenance", path: "/dashboard/maintenance", icon: "tool", roles: ["STUDENT"] },
  { label: "Mess", path: "/dashboard/mess", icon: "coffee", roles: ["STUDENT"] },
  { label: "Grievances", path: "/dashboard/grievances", icon: "alert", roles: ["STUDENT"] },
  { label: "Notices", path: "/dashboard/notices", icon: "bell", roles: ["STUDENT"] },
  { label: "Fees", path: "/dashboard/fees", icon: "dollar", roles: ["STUDENT"] },
  { label: "Students", path: "/dashboard/students", icon: "users", roles: ["SUPER_ADMIN", "HOSTEL_ADMIN"] },
  { label: "Hostels", path: "/dashboard/hostels", icon: "building", roles: ["SUPER_ADMIN", "HOSTEL_ADMIN"] },
  { label: "Rooms", path: "/dashboard/rooms", icon: "door", roles: ["SUPER_ADMIN", "HOSTEL_ADMIN"] },
  { label: "Allocations", path: "/dashboard/allocations", icon: "clipboard", roles: ["SUPER_ADMIN", "HOSTEL_ADMIN"] },
  { label: "Leave Approvals", path: "/dashboard/admin/leave", icon: "check-circle", roles: ["SUPER_ADMIN", "HOSTEL_ADMIN", "WARDEN"] },
  { label: "Pass Approvals", path: "/dashboard/admin/pass", icon: "shield", roles: ["SUPER_ADMIN", "HOSTEL_ADMIN", "WARDEN"] },
  { label: "Maintenance Approvals", path: "/dashboard/admin/maintenance", icon: "tool", roles: ["SUPER_ADMIN", "HOSTEL_ADMIN", "WARDEN"] },
  { label: "Grievance Approvals", path: "/dashboard/admin/grievances", icon: "alert", roles: ["SUPER_ADMIN", "HOSTEL_ADMIN", "WARDEN"] },
  { label: "Manage Notices", path: "/dashboard/admin/notices", icon: "bell", roles: ["SUPER_ADMIN", "HOSTEL_ADMIN", "WARDEN"] },
  { label: "Manage Mess", path: "/dashboard/admin/mess", icon: "coffee", roles: ["SUPER_ADMIN", "HOSTEL_ADMIN"] },
  { label: "Manage Fees", path: "/dashboard/admin/fees", icon: "dollar", roles: ["SUPER_ADMIN", "HOSTEL_ADMIN"] },
];

function NavIcon({ name, size = 18 }: { name: string; size?: number }) {
  const icons: Record<string, React.ReactNode> = {
    grid: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
    user: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
    bed: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" />
      </svg>
    ),
    calendar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    ticket: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
      </svg>
    ),
    users: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    building: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
      </svg>
    ),
    door: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" /><path d="M2 20h20" /><path d="M14 12v.01" />
      </svg>
    ),
    clipboard: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      </svg>
    ),
    "check-circle": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    shield: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    tool: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    coffee: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    alert: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
      </svg>
    ),
    bell: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    dollar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  };
  return <>{icons[name] || icons.grid}</>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/login");
    } else {
      setUser(currentUser);
    }
  }, [router]);

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          color: "#94a3b8",
          fontSize: "0.95rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Loading...
        </div>
        <style jsx>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const filteredNav = navItems.filter(
    (item) => item.roles.includes("all") || item.roles.includes(user.role)
  );

  const currentPageTitle = filteredNav.find((i) => i.path === pathname)?.label || "Dashboard";

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside
        className="glass"
        style={{
          width: sidebarOpen ? "260px" : "72px",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          borderRight: "1px solid rgba(148, 163, 184, 0.08)",
          position: "relative",
          zIndex: 20,
        }}
      >
        {/* Brand */}
        <div
          style={{
            height: "68px",
            display: "flex",
            alignItems: "center",
            padding: sidebarOpen ? "0 20px" : "0 16px",
            gap: "12px",
            borderBottom: "1px solid rgba(148, 163, 184, 0.08)",
            cursor: "pointer",
          }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          {sidebarOpen && (
            <span
              className="gradient-text"
              style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.02em" }}
            >
              Hostel ERP
            </span>
          )}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "12px", overflowY: "auto", overflowX: "hidden" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {filteredNav.map((item) => (
              <div
                key={item.path}
                className={`sidebar-item ${pathname === item.path ? "active" : ""}`}
                onClick={() => router.push(item.path)}
                style={{
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  padding: sidebarOpen ? "10px 16px" : "10px",
                }}
                title={item.label}
              >
                <NavIcon name={item.icon} />
                {sidebarOpen && <span>{item.label}</span>}
              </div>
            ))}
          </div>
        </nav>

        {/* User / Logout */}
        <div
          style={{
            padding: sidebarOpen ? "16px 16px" : "16px 8px",
            borderTop: "1px solid rgba(148, 163, 184, 0.08)",
          }}
        >
          {sidebarOpen && (
            <div style={{ marginBottom: "12px" }}>
              <p style={{ fontSize: "0.82rem", color: "#e2e8f0", fontWeight: 500, marginBottom: "4px" }}>
                {user.email}
              </p>
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  background: "rgba(99, 102, 241, 0.15)",
                  color: "#818cf8",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  border: "1px solid rgba(99, 102, 241, 0.2)",
                }}
              >
                {user.role}
              </span>
            </div>
          )}
          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "10px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#fca5a5",
              fontSize: "0.82rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.25s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <header
          className="glass"
          style={{
            height: "68px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            borderBottom: "1px solid rgba(148, 163, 184, 0.08)",
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#f1f5f9" }}>
              {currentPageTitle}
            </h1>
            <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Notification Bell */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(148, 163, 184, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#ef4444",
                  border: "2px solid #0f172a",
                }}
              />
            </div>
            {/* Avatar */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.85rem",
                color: "white",
              }}
            >
              {user.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ flex: 1, overflow: "auto", padding: "28px", position: "relative" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'rgba(30, 41, 59, 0.9)',
            color: '#f1f5f9',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            borderRadius: '12px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#0f172a' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0f172a' },
          },
        }}
      />
    </div>
  );
}
