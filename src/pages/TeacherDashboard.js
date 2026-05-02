import { useEffect, useState } from "react";
import { getCourses } from "../api/api";

const BASE = "http://localhost:5238/api";
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export default function TeacherDashboard({ user }) {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [gradeInputs, setGradeInputs] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses().then(data => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  const loadEnrollments = async (courseId) => {
    setSelectedCourse(courseId);
    setMsg("");
    const res = await fetch(
      `${BASE}/grades/enrollments/${courseId}`, authHeader());
    const data = await res.json();
    setEnrollments(data);
  };

  const postGrade = async (enrollmentId) => {
    const score = gradeInputs[enrollmentId];
    if (!score) return;
    const res = await fetch(`${BASE}/grades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader().headers
      },
      body: JSON.stringify({ enrollmentId, score: parseFloat(score) })
    });
    const text = await res.text();
    setMsg(text);
    loadEnrollments(selectedCourse);
  };

  if (loading) return (
    <div style={{ textAlign: "center", padding: "80px",
      color: "var(--text-muted)" }}>
      <div style={{ fontSize: "32px", marginBottom: "16px" }}>⏳</div>
      <p>Loading...</p>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", color: "var(--primary)",
          marginBottom: "6px" }}>
          Teacher Dashboard 👨‍🏫
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
          Select a course to manage grades.
        </p>
      </div>

      {msg && (
        <div style={{
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          color: "var(--success)", padding: "12px 16px",
          borderRadius: "8px", marginBottom: "20px", fontSize: "14px"
        }}>{msg}</div>
      )}

      <div style={{ display: "grid",
        gridTemplateColumns: "280px 1fr", gap: "24px" }}>

        {/* Course List */}
        <div style={{
          background: "white", borderRadius: "14px",
          boxShadow: "var(--shadow)", padding: "20px"
        }}>
          <h3 style={{ fontSize: "16px", color: "var(--primary)",
            marginBottom: "16px" }}>My Courses</h3>
          <div style={{ display: "grid", gap: "8px" }}>
            {courses.map(c => (
              <button key={c.id} onClick={() => loadEnrollments(c.id)}
                style={{
                  padding: "12px 16px", borderRadius: "10px",
                  textAlign: "left", fontSize: "14px",
                  background: selectedCourse === c.id
                    ? "var(--primary)" : "var(--surface2)",
                  color: selectedCourse === c.id
                    ? "white" : "var(--text)",
                  border: `1px solid ${selectedCourse === c.id
                    ? "var(--primary)" : "var(--border)"}`,
                  transition: "all 0.2s"
                }}>
                <div style={{ fontWeight: "500" }}>{c.name}</div>
                <div style={{
                  fontSize: "12px", marginTop: "2px",
                  opacity: 0.7
                }}>{c.code}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Students & Grades */}
        <div style={{
          background: "white", borderRadius: "14px",
          boxShadow: "var(--shadow)", padding: "24px"
        }}>
          {!selectedCourse ? (
            <div style={{ textAlign: "center", padding: "48px",
              color: "var(--text-muted)" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>👈</div>
              <p>Select a course to see enrolled students.</p>
            </div>
          ) : enrollments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px",
              color: "var(--text-muted)" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>👥</div>
              <p>No students enrolled in this course yet.</p>
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: "18px", color: "var(--primary)",
                marginBottom: "20px" }}>
                Enrolled Students ({enrollments.length})
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {enrollments.map(e => (
                  <div key={e.enrollmentId} style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    background: "var(--surface2)",
                    borderRadius: "10px",
                    border: "1px solid var(--border)"
                  }}>
                    <div style={{ display: "flex",
                      alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "38px", height: "38px",
                        background: "var(--primary)",
                        borderRadius: "50%",
                        display: "flex", alignItems: "center",
                        justifyContent: "center",
                        color: "white", fontSize: "14px", fontWeight: "600"
                      }}>{e.studentName?.charAt(0)}</div>
                      <div>
                        <p style={{ fontWeight: "500",
                          fontSize: "15px" }}>{e.studentName}</p>
                        <p style={{ fontSize: "13px",
                          color: "var(--text-muted)" }}>
                          {e.currentGrade
                            ? `Current: ${e.currentGrade}/100`
                            : "No grade yet"}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex",
                      alignItems: "center", gap: "8px" }}>
                      <input
                        type="number" min="0" max="100"
                        placeholder="Score"
                        value={gradeInputs[e.enrollmentId] || ""}
                        onChange={ev => setGradeInputs({
                          ...gradeInputs,
                          [e.enrollmentId]: ev.target.value
                        })}
                        style={{
                          width: "80px", padding: "8px 12px",
                          border: "2px solid var(--border)",
                          borderRadius: "8px", fontSize: "14px",
                          outline: "none"
                        }}
                        onFocus={e => e.target.style.borderColor
                          = "var(--primary-light)"}
                        onBlur={e => e.target.style.borderColor
                          = "var(--border)"}
                      />
                      <button onClick={() => postGrade(e.enrollmentId)}
                        style={{
                          padding: "8px 16px",
                          background: "var(--primary)",
                          color: "white", borderRadius: "8px",
                          fontSize: "14px", fontWeight: "500"
                        }}
                        onMouseOver={e => e.target.style.background
                          = "var(--primary-light)"}
                        onMouseOut={e => e.target.style.background
                          = "var(--primary)"}>
                        Post Grade
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}