import { useEffect, useState } from "react";
import { getCourses, getEnrollments, postGrade, createMyCourse } from "../api/api";

export default function TeacherDashboard({ user }) {
  const [courses,        setCourses]      = useState([]);
  const [enrollments,    setEnrollments]  = useState([]);
  const [selectedCourse, setSelected]     = useState(null);
  const [gradeInputs,    setGradeInputs]  = useState({});
  const [msg,            setMsg]          = useState("");
  const [loading,        setLoading]      = useState(true);
  const [tab,            setTab]          = useState("courses");

  // Add course form
  const [newName,    setNewName]    = useState("");
  const [newCode,    setNewCode]    = useState("");
  const [newCredits, setNewCredits] = useState(3);
  const [addMsg,     setAddMsg]     = useState("");

  useEffect(() => { loadCourses(); }, []);

  const loadCourses = async () => {
    // user.id and user.role passed so backend returns only this teacher's courses
    const data = await getCourses(user.id, user.role);
    setCourses(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const loadEnrollments = async (courseId) => {
    setSelected(courseId);
    setMsg("");
    const data = await getEnrollments(courseId);
    setEnrollments(Array.isArray(data) ? data : []);
  };

  const handlePostGrade = async (enrollmentId) => {
    const score = gradeInputs[enrollmentId];
    if (!score) return;
    const text = await postGrade(enrollmentId, parseFloat(score));
    setMsg(text);
    loadEnrollments(selectedCourse);
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    // user.id passed as teacherId — no JWT needed
    const text = await createMyCourse(newName, newCode, newCredits, user.id);
    setAddMsg(text);
    setNewName(""); setNewCode(""); setNewCredits(3);
    loadCourses();
  };

  if (loading) return (
    <div style={{ textAlign: "center", padding: "80px", color: "var(--text-muted)" }}>
      <div style={{ fontSize: "32px", marginBottom: "16px" }}>⏳</div>
      <p>Loading...</p>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", color: "var(--primary)", marginBottom: "6px" }}>
          Teacher Dashboard 👨‍🏫
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
          Manage your courses and post grades.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ background: "white", borderRadius: "14px", boxShadow: "var(--shadow)", overflow: "hidden", marginBottom: "24px" }}>
        <div style={{ display: "flex", borderBottom: "2px solid var(--border)" }}>
          {[
            { key: "courses", label: "📚 My Courses" },
            { key: "add",     label: "➕ Add Course" }
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

          {/* ADD COURSE TAB */}
          {tab === "add" && (
            <div style={{ maxWidth: "480px" }}>
              <h3 style={{ fontSize: "18px", color: "var(--primary)", marginBottom: "24px" }}>
                Add a New Course
              </h3>

              {addMsg && (
                <div style={{
                  background: "#f0fdf4", border: "1px solid #bbf7d0",
                  color: "#16a34a", padding: "12px 16px",
                  borderRadius: "8px", marginBottom: "20px", fontSize: "14px"
                }}>{addMsg}</div>
              )}

              <form onSubmit={handleAddCourse}>
                {[
                  { label: "Course Name", value: newName, setter: setNewName, placeholder: "e.g. Data Structures" },
                  { label: "Course Code", value: newCode, setter: setNewCode, placeholder: "e.g. I2201" },
                ].map(({ label, value, setter, placeholder }) => (
                  <div key={label} style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>{label}</label>
                    <input
                      type="text" placeholder={placeholder} value={value}
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
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>Credits</label>
                  <select value={newCredits} onChange={e => setNewCredits(parseInt(e.target.value))}
                    style={{ width: "100%", padding: "12px 16px", border: "2px solid var(--border)", borderRadius: "10px", fontSize: "15px", outline: "none", boxSizing: "border-box" }}>
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Credits</option>)}
                  </select>
                </div>

                <button type="submit" style={{
                  width: "100%", padding: "13px", background: "var(--primary)",
                  color: "white", borderRadius: "10px", fontSize: "15px", fontWeight: "500"
                }}>Add Course</button>
              </form>
            </div>
          )}

          {/* MY COURSES TAB */}
          {tab === "courses" && (
            <div>
              {courses.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
                  <p>You have no courses yet. Go to Add Course to create one!</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px" }}>

                  {/* Course List */}
                  <div>
                    <h3 style={{ fontSize: "16px", color: "var(--primary)", marginBottom: "16px" }}>My Courses</h3>
                    <div style={{ display: "grid", gap: "8px" }}>
                      {courses.map(c => (
                        <button key={c.id} onClick={() => loadEnrollments(c.id)} style={{
                          padding: "12px 16px", borderRadius: "10px", textAlign: "left", fontSize: "14px",
                          background: selectedCourse === c.id ? "var(--primary)" : "var(--surface2)",
                          color: selectedCourse === c.id ? "white" : "var(--text)",
                          border: `1px solid ${selectedCourse === c.id ? "var(--primary)" : "var(--border)"}`,
                          transition: "all 0.2s"
                        }}>
                          <div style={{ fontWeight: "500" }}>{c.name}</div>
                          <div style={{ fontSize: "12px", marginTop: "2px", opacity: 0.7 }}>{c.code}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Students & Grades */}
                  <div style={{ background: "var(--surface2)", borderRadius: "12px", padding: "24px" }}>
                    {msg && (
                      <div style={{
                        background: "#f0fdf4", border: "1px solid #bbf7d0",
                        color: "#16a34a", padding: "12px 16px",
                        borderRadius: "8px", marginBottom: "16px", fontSize: "14px"
                      }}>{msg}</div>
                    )}

                    {!selectedCourse ? (
                      <div style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)" }}>
                        <div style={{ fontSize: "40px", marginBottom: "12px" }}>👈</div>
                        <p>Select a course to see enrolled students.</p>
                      </div>
                    ) : enrollments.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)" }}>
                        <div style={{ fontSize: "40px", marginBottom: "12px" }}>👥</div>
                        <p>No students enrolled in this course yet.</p>
                      </div>
                    ) : (
                      <div>
                        <h3 style={{ fontSize: "18px", color: "var(--primary)", marginBottom: "20px" }}>
                          Enrolled Students ({enrollments.length})
                        </h3>
                        <div style={{ display: "grid", gap: "12px" }}>
                          {enrollments.map(e => (
                            <div key={e.enrollmentId} style={{
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              padding: "16px 20px", background: "white",
                              borderRadius: "10px", border: "1px solid var(--border)"
                            }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{
                                  width: "38px", height: "38px", background: "var(--primary)",
                                  borderRadius: "50%", display: "flex", alignItems: "center",
                                  justifyContent: "center", color: "white", fontSize: "14px", fontWeight: "600"
                                }}>{e.studentName?.charAt(0)}</div>
                                <div>
                                  <p style={{ fontWeight: "500", fontSize: "15px" }}>{e.studentName}</p>
                                  <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                                    {e.currentGrade ? `Current: ${e.currentGrade}/100` : "No grade yet"}
                                  </p>
                                </div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <input
                                  type="number" min="0" max="100" placeholder="Score"
                                  value={gradeInputs[e.enrollmentId] || ""}
                                  onChange={ev => setGradeInputs({ ...gradeInputs, [e.enrollmentId]: ev.target.value })}
                                  style={{
                                    width: "80px", padding: "8px 12px",
                                    border: "2px solid var(--border)", borderRadius: "8px",
                                    fontSize: "14px", outline: "none"
                                  }}
                                />
                                <button onClick={() => handlePostGrade(e.enrollmentId)} style={{
                                  padding: "8px 16px", background: "var(--primary)",
                                  color: "white", borderRadius: "8px", fontSize: "14px", fontWeight: "500"
                                }}>Post Grade</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}