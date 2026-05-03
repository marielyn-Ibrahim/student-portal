const BASE = "http://localhost:5238/api";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const login = (email, password) =>
  fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  }).then(r => r.json());

export const register = (name, email, password) =>
  fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  }).then(r => r.text());

export const getCourses = () =>
  fetch(`${BASE}/courses`, authHeader()).then(r => r.json());

export const getMyGrades = () =>
  fetch(`${BASE}/grades/my-grades`, authHeader()).then(r => r.json());

export const getGpa = () =>
  fetch(`${BASE}/grades/gpa`, authHeader()).then(r => r.json());

export const postGrade = (enrollmentId, score) =>
  fetch(`${BASE}/grades`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader().headers },
    body: JSON.stringify({ enrollmentId, score })
  }).then(r => r.text());

export const getOpenSemesters = () =>
  fetch(`${BASE}/enrollments/semesters`, authHeader()).then(r => r.json());

export const getAvailableCourses = () =>
  fetch(`${BASE}/enrollments/available-courses`, authHeader()).then(r => r.json());

export const enrollInCourse = (courseId, semesterId) =>
  fetch(`${BASE}/enrollments/enroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader().headers },
    body: JSON.stringify({ courseId, semesterId })
  }).then(r => r.text());