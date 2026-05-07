const BASE = "http://localhost:5238/api";

// ── AUTH ──────────────────────────────────────────────────────────────────────

export const login = (email, password) =>
  fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  }).then(r => r.json());

// ── COURSES ───────────────────────────────────────────────────────────────────

// userId and role sent as query params so backend can filter by teacher
export const getCourses = (userId, role) =>
  fetch(`${BASE}/courses?userId=${userId}&role=${role}`).then(r => r.json());

export const createCourse = (name, code, credits, teacherId) =>
  fetch(`${BASE}/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, code, credits, teacherId })
  }).then(r => r.text());

// Teacher creates their own course — teacherId sent as query param
export const createMyCourse = (name, code, credits, teacherId) =>
  fetch(`${BASE}/courses/my-course?teacherId=${teacherId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, code, credits })
  }).then(r => r.text());

// ── GRADES ────────────────────────────────────────────────────────────────────

// studentId sent as query param (stored in React state after login)
export const getMyGrades = (studentId) =>
  fetch(`${BASE}/grades/my-grades?studentId=${studentId}`).then(r => r.json());

export const getGpa = (studentId) =>
  fetch(`${BASE}/grades/gpa?studentId=${studentId}`).then(r => r.json());

export const getEnrollments = (courseId) =>
  fetch(`${BASE}/grades/enrollments/${courseId}`).then(r => r.json());

export const postGrade = (enrollmentId, score) =>
  fetch(`${BASE}/grades`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enrollmentId, score })
  }).then(r => r.text());

// ── ENROLLMENTS ───────────────────────────────────────────────────────────────

export const getOpenSemesters = () =>
  fetch(`${BASE}/enrollments/semesters`).then(r => r.json());

// studentId sent as query param
export const getAvailableCourses = (studentId) =>
  fetch(`${BASE}/enrollments/available-courses?studentId=${studentId}`).then(r => r.json());

// studentId now included in the request body (EnrollDto)
export const enrollInCourse = (studentId, courseId, semesterId) =>
  fetch(`${BASE}/enrollments/enroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, courseId, semesterId })
  }).then(r => r.text());

// ── ADMIN ─────────────────────────────────────────────────────────────────────

export const getUsers = () =>
  fetch(`${BASE}/admin/users`).then(r => r.json());

// Admin provides Name + Email + Role only — backend auto-generates password
export const createUser = (name, email, role) =>
  fetch(`${BASE}/admin/create-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, role })
  }).then(r => r.json());

export const updateUser = (id, email, password) =>
  fetch(`${BASE}/admin/update-user`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, email, password })
  }).then(r => r.text());

export const getSemesters = () =>
  fetch(`${BASE}/admin/semesters`).then(r => r.json());

export const createSemester = (name) =>
  fetch(`${BASE}/admin/semesters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  }).then(r => r.text());

export const toggleSemester = (id) =>
  fetch(`${BASE}/admin/semesters/${id}`, {
    method: "PUT"
  }).then(r => r.text());