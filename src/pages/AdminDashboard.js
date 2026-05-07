import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, getSemesters, createSemester, toggleSemester } from "../api/api";

export default function AdminDashboard({ user }) {
  const [users,      setUsers]      = useState([]);
  const [semesters,  setSemesters]  = useState([]);
  const [tab,        setTab]        = useState("users");
  const [msg,        setMsg]        = useState("");

  // New user form
  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [role,       setRole]       = useState("Teacher");

  // Generated password shown once to Admin
  const [generatedPass, setGenPass] = useState("");

  // Edit user
  const [editingUser,  setEditingUser]  = useState(null);
  const [editEmail,    setEditEmail]    = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editMsg,      setEditMsg]      = useState("");

  // New semester form
  const [semName,    setSemName]    = useState("");
  const [semMsg,     setSemMsg]     = useState("");

  useEffect(() => {
    loadUsers();
    loadSemesters();
  }, []);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(Array.isArray(data) ? data : []);
  };

  const loadSemesters = async () => {
    const data = await getSemesters();
    setSemesters(Array.isArray(data) ? data : []);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setGenPass("");
    setMsg("");
    const result = await createUser(name, email, role);
    if (result.password) {
      setGenPass(result.password);
      setMsg(result.message);
      setName(""); setEmail("");
      loadUsers();
    } else {
      setMsg(typeof result === "string" ? result : result.message || "Error.");
    }
  };

  const handleCreateSemester = async (e) => {
    e.preventDefault();
    setSemMsg("");
    const result = await createSemester(semName);
    setSemMsg(result);
    setSemName("");
    loadSemesters();
  };

  const handleToggle = async (id) => {
    await toggleSemester(id);
    loadSemesters();
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
    const text = await updateUser(editingUser.id, editEmail, editPassword);
    setEditMsg(text);
    loadUsers();
  };

  const roleColor = (r) => ({
    Admin: "#7c3aed", Teacher: "#2563a8", Student: "#16a34a"
  }[r] || "#64748b");

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", color: "var(--primary)", marginBottom: "6px" }}>
          Admin Dashboard ⚙️
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
          Manage users, accounts and semesters.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
        {[
          { label: "Total Users",  value: users.length,                                  color: "#1a3c5e", icon: "👥" },
          { label: "Teachers",     value: users.filter(u => u.role === "Teacher").length, color: "#2563a8", icon: "👨‍🏫" },
          { label: "Students",     value: users.filter(u => u.role === "Student").length, color: "#16a34a", icon: "🎓" },
          { label: "Open Semesters", value: semesters.filter(s => s.isOpen).length,      color: "#d97706", icon: "📅" }
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
            <h3 style={{ fontSize: "18px", color: "var(--primary)", marginBottom: "6px" }}>Edit User</h3>
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
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>New Email</label>
              <input
                type="email" value={editEmail}
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
                type="password" value={editPassword}
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
              }}>Save Changes</button>
              <button onClick={closeEdit} style={{
                flex: 1, padding: "12px", background: "var(--surface2)",
                color: "var(--text)", borderRadius: "10px", fontSize: "15px", fontWeight: "500",
                border: "1px solid var(--border)"
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ background: "white", borderRadius: "14px", boxShadow: "var(--shadow)", overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: "2px solid var(--border)" }}>
          {[
            { key: "users",     label: "👥 All Users" },
            { key: "create",    label: "➕ Create Account" },
            { key: "semesters", label: "📅 Semesters" }
          ].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setMsg(""); setGenPass(""); setSemMsg(""); }} style={{
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

              {users.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>👥</div>
                  <p>No users yet. Go to Create Account to add teachers and students.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "10px" }}>
                  {users.map(u => (
                    <div key={u.id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
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
                          padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "500"
                        }}>{u.role}</span>
                        {u.role !== "Admin" && (
                          <button onClick={() => openEdit(u)} style={{
                            padding: "6px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "500",
                            background: "#f1f5f9", color: "#475569", border: "1px solid var(--border)"
                          }}>✏️ Edit</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CREATE USER TAB */}
          {tab === "create" && (
            <div style={{ maxWidth: "480px" }}>
              <h3 style={{ fontSize: "18px", color: "var(--primary)", marginBottom: "8px" }}>
                Create New Account
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
                Enter the name and email. A password will be auto-generated and shown once.
              </p>

              {/* Generated password shown ONCE */}
              {generatedPass && (
                <div style={{
                  background: "#fff8e1", border: "1px solid #f59e0b",
                  borderRadius: "10px", padding: "16px 20px", marginBottom: "20px"
                }}>
                  <p style={{ fontWeight: "600", color: "#92400e", marginBottom: "8px", fontSize: "14px" }}>
                    Generated Password — share this with the user:
                  </p>
                  <div style={{
                    fontFamily: "monospace", fontSize: "22px", fontWeight: "700",
                    letterSpacing: "4px", color: "#1a3c5e",
                    background: "white", border: "2px dashed #1a3c5e",
                    padding: "8px 16px", borderRadius: "6px",
                    display: "inline-block", marginBottom: "8px"
                  }}>{generatedPass}</div>
                  <p style={{ fontSize: "12px", color: "#b45309" }}>⚠ This will NOT be shown again.</p>
                </div>
              )}

              {msg && (
                <div style={{
                  background: "#f0fdf4", border: "1px solid #bbf7d0",
                  color: "var(--success)", padding: "12px 16px",
                  borderRadius: "8px", marginBottom: "20px", fontSize: "14px"
                }}>{msg}</div>
              )}

              <form onSubmit={handleCreateUser}>
                {[
                  { label: "Full Name", value: name,  setter: setName,  type: "text",  placeholder: "Dr. John Smith" },
                  { label: "Email",     value: email, setter: setEmail, type: "email", placeholder: "john@university.edu" }
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
                    {["Teacher", "Student"].map(r => (
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

          {/* SEMESTERS TAB */}
          {tab === "semesters" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>

                {/* Create Semester */}
                <div>
                  <h3 style={{ fontSize: "18px", color: "var(--primary)", marginBottom: "8px" }}>
                    Create New Semester
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
                    e.g. Spring 2026, Fall 2026
                  </p>

                  {semMsg && (
                    <div style={{
                      background: "#f0fdf4", border: "1px solid #bbf7d0",
                      color: "#16a34a", padding: "12px 16px",
                      borderRadius: "8px", marginBottom: "16px", fontSize: "14px"
                    }}>{semMsg}</div>
                  )}

                  <form onSubmit={handleCreateSemester}>
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>
                        Semester Name
                      </label>
                      <input
                        type="text" placeholder="e.g. Spring 2026"
                        value={semName} onChange={e => setSemName(e.target.value)} required
                        style={{
                          width: "100%", padding: "12px 16px",
                          border: "2px solid var(--border)", borderRadius: "10px",
                          fontSize: "15px", outline: "none", boxSizing: "border-box"
                        }}
                        onFocus={e => e.target.style.borderColor = "var(--primary-light)"}
                        onBlur={e => e.target.style.borderColor = "var(--border)"}
                      />
                    </div>
                    <button type="submit" style={{
                      width: "100%", padding: "13px", background: "var(--primary)",
                      color: "white", borderRadius: "10px", fontSize: "15px", fontWeight: "500"
                    }}
                      onMouseOver={e => e.target.style.background = "var(--primary-light)"}
                      onMouseOut={e => e.target.style.background = "var(--primary)"}>
                      Create Semester
                    </button>
                  </form>
                </div>

                {/* All Semesters */}
                <div>
                  <h3 style={{ fontSize: "18px", color: "var(--primary)", marginBottom: "20px" }}>
                    All Semesters
                  </h3>

                  {semesters.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)" }}>
                      <div style={{ fontSize: "40px", marginBottom: "12px" }}>📅</div>
                      <p>No semesters yet. Create one to allow enrollment.</p>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gap: "10px" }}>
                      {semesters.map(s => (
                        <div key={s.id} style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "14px 20px", background: "var(--surface2)",
                          borderRadius: "10px", border: "1px solid var(--border)"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{
                              width: "38px", height: "38px",
                              background: s.isOpen ? "#16a34a18" : "#94a3b818",
                              borderRadius: "50%", display: "flex", alignItems: "center",
                              justifyContent: "center", fontSize: "18px"
                            }}>{s.isOpen ? "🟢" : "🔴"}</div>
                            <div>
                              <p style={{ fontWeight: "500", fontSize: "15px", color: "var(--text)" }}>{s.name}</p>
                              <p style={{ fontSize: "13px", color: s.isOpen ? "#16a34a" : "var(--text-muted)" }}>
                                {s.isOpen ? "Open for enrollment" : "Closed"}
                              </p>
                            </div>
                          </div>
                          <button onClick={() => handleToggle(s.id)} style={{
                            padding: "8px 16px", borderRadius: "8px",
                            fontSize: "13px", fontWeight: "500",
                            background: s.isOpen ? "#fef2f2" : "#f0fdf4",
                            color: s.isOpen ? "#dc2626" : "#16a34a",
                            border: `1px solid ${s.isOpen ? "#fecaca" : "#bbf7d0"}`
                          }}>
                            {s.isOpen ? "Close" : "Open"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}