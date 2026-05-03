import { useEffect, useState } from "react";

const BASE = "http://localhost:5238/api";
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export default function AdminDashboard({ user }) {
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("users");
  const [msg, setMsg] = useState("");

  // New user form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Teacher");

  // Edit user
  const [editingUser, setEditingUser] = useState(null);
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editMsg, setEditMsg] = useState("");

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    const res = await fetch(`${BASE}/admin/users`, authHeader());
    const data = await res.json();
    setUsers(data);
  };

  const createUser = async (e) => {
    e.preventDefault();
    const res = await fetch(`${BASE}/admin/create-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader().headers },
      body: JSON.stringify({ name, email, password, role })
    });
    const text = await res.text();
    setMsg(text);
    setName(""); setEmail(""); setPassword("");
    loadUsers();
  };

  const openEdit = (u) => {
    setEditingUser(u);
    setEditEmail(u.email);
    setEditPassword("");
    setEditMsg("");
  };

  const closeEdit = () => {
    setEditingUser(null);
    setEditEmail("");
    setEditPassword("");
    setEditMsg("");
  };

  const saveEdit = async () => {
    const res = await fetch(`${BASE}/admin/update-user`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeader().headers },
      body: JSON.stringify({
        id: editingUser.id,
        email: editEmail,
        password: editPassword
      })
    });
    const text = await res.text();
    setEditMsg(text);
    loadUsers();
  };

  const roleColor = (r) => ({
    Admin: "#7c3aed",
    Teacher: "#2563a8",
    Student: "#16a34a"
  }[r] || "#64748b");

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", color: "var(--primary)", marginBottom: "6px" }}>
          Admin Dashboard ⚙️
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
          Manage users and create teacher accounts.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
        {[
          { label: "Total Users", value: users.length, color: "#1a3c5e", icon: "👥" },
          { label: "Teachers", value: users.filter(u => u.role === "Teacher").length, color: "#2563a8", icon: "👨‍🏫" },
          { label: "Students", value: users.filter(u => u.role === "Student").length, color: "#16a34a", icon: "🎓" }
        ].map(s => (
          <div key={s.label} style={{
            background: "white", borderRadius: "14px", padding: "24px",
            boxShadow: "var(--shadow)", borderLeft: `4px solid ${s.color}`,
            display: "flex", alignItems: "center", gap: "16px"
          }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "12px",
              background: s.color + "18", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: "22px"
            }}>{s.icon}</div>
            <div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "500", marginBottom: "4px" }}>{s.label}</p>
              <p style={{ fontSize: "26px", fontWeight: "600", color: s.color, lineHeight: 1 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "#00000055", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
            background: "white", borderRadius: "16px",
            padding: "32px", width: "420px", boxShadow: "0 20px 60px #0003"
          }}>
            <h3 style={{ fontSize: "18px", color: "var(--primary)", marginBottom: "6px" }}>
              Edit User
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
              {editingUser.name} — {editingUser.role}
            </p>

            {editMsg && (
              <div style={{
                background: "#f0fdf4", border: "1px solid #bbf7d0",
                color: "#16a34a", padding: "12px 16px",
                borderRadius: "8px", marginBottom: "16px", fontSize: "14px"
              }}>{editMsg}</div>
            )}

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>
                New Email
              </label>
              <input
                type="email"
                value={editEmail}
                onChange={e => setEditEmail(e.target.value)}
                style={{
                  width: "100%", padding: "12px 16px",
                  border: "2px solid var(--border)", borderRadius: "10px",
                  fontSize: "15px", outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>
                New Password <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(leave blank to keep current)</span>
              </label>
              <input
                type="password"
                value={editPassword}
                onChange={e => setEditPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                style={{
                  width: "100%", padding: "12px 16px",
                  border: "2px solid var(--border)", borderRadius: "10px",
                  fontSize: "15px", outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={saveEdit} style={{
                flex: 1, padding: "12px", background: "var(--primary)",
                color: "white", borderRadius: "10px", fontSize: "15px", fontWeight: "500"
              }}>
                Save Changes
              </button>
              <button onClick={closeEdit} style={{
                flex: 1, padding: "12px", background: "var(--surface2)",
                color: "var(--text)", borderRadius: "10px", fontSize: "15px", fontWeight: "500",
                border: "1px solid var(--border)"
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ background: "white", borderRadius: "14px", boxShadow: "var(--shadow)", overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: "2px solid var(--border)" }}>
          {[
            { key: "users", label: "👥 All Users" },
            { key: "create", label: "➕ Create Account" }
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "16px 28px", fontSize: "14px", fontWeight: "500",
              background: "none",
              color: tab === t.key ? "var(--primary)" : "var(--text-muted)",
              borderBottom: tab === t.key ? "2px solid var(--primary)" : "2px solid transparent",
              marginBottom: "-2px"
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ padding: "28px" }}>

          {/* ALL USERS TAB */}
          {tab === "users" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "18px", color: "var(--primary)" }}>All Users</h3>
                <span style={{
                  background: "var(--bg)", padding: "4px 12px",
                  borderRadius: "20px", fontSize: "13px", color: "var(--text-muted)"
                }}>{users.length} total</span>
              </div>

              <div style={{ display: "grid", gap: "10px" }}>
                {users.map(u => (
                  <div key={u.id} style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 20px", background: "var(--surface2)",
                    borderRadius: "10px", border: "1px solid var(--border)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "38px", height: "38px", background: roleColor(u.role),
                        borderRadius: "50%", display: "flex", alignItems: "center",
                        justifyContent: "center", color: "white", fontSize: "14px", fontWeight: "600"
                      }}>{u.name?.charAt(0)}</div>
                      <div>
                        <p style={{ fontWeight: "500", fontSize: "15px", color: "var(--text)" }}>{u.name}</p>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{u.email}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{
                        background: roleColor(u.role) + "18", color: roleColor(u.role),
                        padding: "4px 12px", borderRadius: "20px",
                        fontSize: "13px", fontWeight: "500"
                      }}>{u.role}</span>
                      <button onClick={() => openEdit(u)} style={{
                        padding: "6px 14px", borderRadius: "8px",
                        fontSize: "13px", fontWeight: "500",
                        background: "#f1f5f9", color: "#475569",
                        border: "1px solid var(--border)"
                      }}>✏️ Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CREATE USER TAB */}
          {tab === "create" && (
            <div style={{ maxWidth: "480px" }}>
              <h3 style={{ fontSize: "18px", color: "var(--primary)", marginBottom: "24px" }}>
                Create New Account
              </h3>

              {msg && (
                <div style={{
                  background: "#f0fdf4", border: "1px solid #bbf7d0",
                  color: "var(--success)", padding: "12px 16px",
                  borderRadius: "8px", marginBottom: "20px", fontSize: "14px"
                }}>{msg}</div>
              )}

              <form onSubmit={createUser}>
                {[
                  { label: "Full Name", value: name, setter: setName, type: "text", placeholder: "Dr. John Smith" },
                  { label: "Email", value: email, setter: setEmail, type: "email", placeholder: "john@gmail.com" },
                  { label: "Password", value: password, setter: setPassword, type: "password", placeholder: "Set a password" }
                ].map(({ label, value, setter, type, placeholder }) => (
                  <div key={label} style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text)", marginBottom: "6px" }}>{label}</label>
                    <input
                      type={type} placeholder={placeholder} value={value}
                      onChange={e => setter(e.target.value)} required
                      style={{
                        width: "100%", padding: "12px 16px",
                        border: "2px solid var(--border)", borderRadius: "10px",
                        fontSize: "15px", outline: "none", boxSizing: "border-box"
                      }}
                      onFocus={e => e.target.style.borderColor = "var(--primary-light)"}
                      onBlur={e => e.target.style.borderColor = "var(--border)"}
                    />
                  </div>
                ))}

                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text)", marginBottom: "10px" }}>Role</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {["Teacher", "Student", "Admin"].map(r => (
                      <button key={r} type="button" onClick={() => setRole(r)} style={{
                        padding: "10px 20px", borderRadius: "10px",
                        fontSize: "14px", fontWeight: "500",
                        background: role === r ? roleColor(r) : "var(--surface2)",
                        color: role === r ? "white" : "var(--text-muted)",
                        border: `2px solid ${role === r ? roleColor(r) : "var(--border)"}`,
                        transition: "all 0.2s"
                      }}>{r}</button>
                    ))}
                  </div>
                </div>

                <button type="submit" style={{
                  width: "100%", padding: "13px", background: "var(--primary)",
                  color: "white", borderRadius: "10px", fontSize: "15px", fontWeight: "500"
                }}
                  onMouseOver={e => e.target.style.background = "var(--primary-light)"}
                  onMouseOut={e => e.target.style.background = "var(--primary)"}>
                  Create Account
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}