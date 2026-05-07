import { useState, useEffect } from "react";
import './App.css';
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const id   = localStorage.getItem("id");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    if (role) setUser({ id: parseInt(id), role, name });
  }, []);

  const handleLogin = (data) => {
    // Store user info in localStorage so refresh doesn't log out
    localStorage.setItem("id",   data.id);
    localStorage.setItem("role", data.role);
    localStorage.setItem("name", data.name);
    setUser(data);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  // ── Logged in — show dashboard based on role ─────────────────────────────
  if (user) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

        {/* Top Navigation Bar */}
        <nav style={{
          background: "var(--primary)",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "36px", height: "36px",
              background: "var(--accent)",
              borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", fontWeight: "700", color: "white"
            }}>S</div>
            <span style={{
              color: "white", fontSize: "18px",
              fontFamily: "'DM Serif Display', serif"
            }}>Student Portal</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.1)",
              padding: "6px 14px", borderRadius: "20px"
            }}>
              <div style={{
                width: "28px", height: "28px",
                background: "var(--accent)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", fontWeight: "600", color: "white"
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: "white", fontSize: "14px" }}>{user.name}</span>
              <span style={{
                background: "var(--accent)", color: "white",
                fontSize: "11px", padding: "2px 8px",
                borderRadius: "10px", fontWeight: "500"
              }}>{user.role}</span>
            </div>

            <button
              onClick={handleLogout}
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "white", padding: "8px 16px",
                borderRadius: "8px", fontSize: "14px",
                border: "1px solid rgba(255,255,255,0.2)"
              }}
              onMouseOver={e => e.target.style.background = "rgba(255,255,255,0.25)"}
              onMouseOut={e =>  e.target.style.background = "rgba(255,255,255,0.15)"}
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Dashboard content */}
        <div style={{ padding: "32px", maxWidth: "1100px", margin: "0 auto" }}>
          {user.role === "Student" && <StudentDashboard user={user} />}
          {user.role === "Teacher" && <TeacherDashboard user={user} />}
          {user.role === "Admin"   && <AdminDashboard   user={user} />}
        </div>

      </div>
    );
  }

  // ── Not logged in — show Login ────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, var(--primary) 0%, #2563a8 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px"
    }}>
      <Login onLogin={handleLogin} />
    </div>
  );
}