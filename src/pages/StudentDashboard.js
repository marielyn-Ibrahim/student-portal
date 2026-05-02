import { useEffect, useState } from "react";
import { getCourses, getMyGrades, getGpa } from "../api/api";

const StatCard = ({ label, value, color, icon }) => (
  <div style={{
    background: "white", borderRadius: "14px",
    padding: "24px", boxShadow: "var(--shadow)",
    borderLeft: `4px solid ${color}`,
    display: "flex", alignItems: "center", gap: "16px"
  }}>
    <div style={{
      width: "48px", height: "48px", borderRadius: "12px",
      background: `${color}18`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "22px"
    }}>{icon}</div>
    <div>
      <p style={{ fontSize: "13px", color: "var(--text-muted)",
        fontWeight: "500", marginBottom: "4px" }}>{label}</p>
      <p style={{ fontSize: "26px", fontWeight: "600",
        color: color, lineHeight: 1 }}>{value}</p>
    </div>
  </div>
);

export default function StudentDashboard({ user }) {
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [gpa, setGpa] = useState(null);
  const [tab, setTab] = useState("courses");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      getCourses().then(setCourses),
      getMyGrades().then(setGrades),
      getGpa().then(d => setGpa(d.gpa))
    ]).finally(() => setLoading(false));
  }, []);
// Session 7 — LINQ-style filtering in React
const filteredCourses = courses.filter(c =>
  c.name.toLowerCase().includes(search.toLowerCase()) ||
  c.code.toLowerCase().includes(search.toLowerCase())
);
  const gradeColor = (letter) => ({
    A: "#16a34a", B: "#2563a8", C: "#d97706",
    D: "#ea580c", F: "#dc2626"
  }[letter] || "#64748b");

  if (loading) return (
    <div style={{ textAlign: "center", padding: "80px",
      color: "var(--text-muted)" }}>
      <div style={{ fontSize: "32px", marginBottom: "16px" }}>⏳</div>
      <p>Loading your data...</p>
    </div>
  );

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", color: "var(--primary)",
          marginBottom: "6px" }}>
          Good day, {user?.name?.split(" ")[0]} 👋
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
          Here's your academic overview for this semester.
        </p>
      </div>

      {/* Stats Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px", marginBottom: "32px"
      }}>
        <StatCard
          label="Enrolled Courses"
          value={courses.length}
          color="#1a3c5e"
          icon="📚"
        />
        <StatCard
          label="Grades Received"
          value={grades.filter(g => g.score !== null).length}
          color="#2563a8"
          icon="📝"
        />
        <StatCard
          label="Current GPA"
          value={gpa > 0 ? gpa.toFixed(2) : "N/A"}
          color={gpa >= 3 ? "#16a34a" : gpa >= 2 ? "#d97706" : "#dc2626"}
          icon="🎓"
        />
      </div>

      {/* Tab Navigation */}
      <div style={{
        background: "white", borderRadius: "14px",
        boxShadow: "var(--shadow)", overflow: "hidden"
      }}>
        <div style={{
          display: "flex", borderBottom: "2px solid var(--border)"
        }}>
          {["courses", "grades"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "16px 28px", fontSize: "14px", fontWeight: "500",
              background: "none",
              color: tab === t ? "var(--primary)" : "var(--text-muted)",
              borderBottom: tab === t
                ? "2px solid var(--primary)" : "2px solid transparent",
              marginBottom: "-2px",
              textTransform: "capitalize"
            }}>
              {t === "courses" ? "📚 My Courses" : "📊 Grades & GPA"}
            </button>
          ))}
        </div>

        <div style={{ padding: "28px" }}>

          {/* COURSES TAB */}
          {tab === "courses" && (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between",
      alignItems: "center", marginBottom: "20px" }}>
      <h3 style={{ fontSize: "18px", color: "var(--primary)" }}>
        Available Courses
      </h3>
      <span style={{
        background: "var(--bg)", padding: "4px 12px",
        borderRadius: "20px", fontSize: "13px",
        color: "var(--text-muted)"
      }}>{courses.length} courses</span>
    </div>

    {/* Search Box — Session 7 LINQ filtering */}
    <div style={{ marginBottom: "20px", position: "relative" }}>
      <input
        type="text"
        placeholder="Search courses by name or code..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%", padding: "12px 16px 12px 42px",
          border: "2px solid var(--border)", borderRadius: "10px",
          fontSize: "14px", outline: "none",
          background: "var(--surface2)"
        }}
        onFocus={e => e.target.style.borderColor = "var(--primary-light)"}
        onBlur={e => e.target.style.borderColor = "var(--border)"}
      />
      <span style={{
        position: "absolute", left: "14px", top: "50%",
        transform: "translateY(-50%)", fontSize: "16px"
      }}>🔍</span>
    </div>

    {filteredCourses.length === 0 ? (
      <div style={{
        textAlign: "center", padding: "48px",
        color: "var(--text-muted)"
      }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
        <p>{search ? `No courses found for "${search}"` : "No courses available yet."}</p>
      </div>
    ) : (
      <div style={{ display: "grid", gap: "12px" }}>
        {filteredCourses.map(c => (
          <div key={c.id} style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            background: "var(--surface2)",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            transition: "box-shadow 0.2s"
          }}
          onMouseOver={e => e.currentTarget.style.boxShadow = "var(--shadow)"}
          onMouseOut={e => e.currentTarget.style.boxShadow = "none"}>
            <div style={{ display: "flex",
              alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "42px", height: "42px",
                background: "var(--primary)",
                borderRadius: "10px",
                display: "flex", alignItems: "center",
                justifyContent: "center",
                color: "white", fontSize: "13px", fontWeight: "600"
              }}>{c.code?.slice(0, 3)}</div>
              <div>
                <p style={{ fontWeight: "500", fontSize: "15px",
                  color: "var(--text)" }}>{c.name}</p>
                <p style={{ fontSize: "13px",
                  color: "var(--text-muted)" }}>
                  {c.code} · {c.teacher?.name || "TBA"}
                </p>
              </div>
            </div>
            <div style={{
              background: "var(--primary)15",
              color: "var(--primary)",
              padding: "4px 12px", borderRadius: "20px",
              fontSize: "13px", fontWeight: "500"
            }}>{c.credits} credits</div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

          {/* GRADES TAB */}
          {tab === "grades" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "18px", color: "var(--primary)" }}>
                  Academic Performance
                </h3>
                <div style={{
                  background: gpa >= 3 ? "#f0fdf4" : "#fef9f0",
                  border: `1px solid ${gpa >= 3 ? "#bbf7d0" : "#fed7aa"}`,
                  color: gpa >= 3 ? "var(--success)" : "#d97706",
                  padding: "6px 16px", borderRadius: "20px",
                  fontSize: "14px", fontWeight: "600"
                }}>
                  GPA: {gpa > 0 ? gpa.toFixed(2) : "N/A"} / 4.00
                </div>
              </div>

              {grades.length === 0 ? (
                <div style={{
                  textAlign: "center", padding: "48px",
                  color: "var(--text-muted)"
                }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
                  <p>No grades posted yet.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "12px" }}>
                  {grades.map((g, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 20px",
                      background: "var(--surface2)",
                      borderRadius: "10px",
                      border: "1px solid var(--border)"
                    }}>
                      <div>
                        <p style={{ fontWeight: "500", fontSize: "15px",
                          color: "var(--text)" }}>{g.courseName}</p>
                        <p style={{ fontSize: "13px",
                          color: "var(--text-muted)" }}>
                          {g.courseCode} · {g.semester}
                        </p>
                      </div>
                      <div style={{ display: "flex",
                        alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "14px",
                          color: "var(--text-muted)" }}>
                          {g.score !== null ? `${g.score}/100` : "Pending"}
                        </span>
                        <div style={{
                          width: "38px", height: "38px",
                          borderRadius: "50%",
                          background: gradeColor(g.letter) + "18",
                          border: `2px solid ${gradeColor(g.letter)}`,
                          display: "flex", alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700", fontSize: "15px",
                          color: gradeColor(g.letter)
                        }}>{g.letter}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}