import { useState } from "react";
import { login } from "../api/api";

export default function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login(email, password);
      if (data.token) {
        onLogin(data);
      } else {
        setError("Invalid email or password.");
      }
    } catch {
      setError("Cannot connect to server. Make sure the backend is running.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      background: "white", borderRadius: "20px",
      padding: "48px 40px", width: "100%", maxWidth: "420px",
      boxShadow: "0 24px 64px rgba(0,0,0,0.25)"
    }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{
          width: "56px", height: "56px",
          background: "var(--primary)", borderRadius: "14px",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
          fontSize: "24px", fontWeight: "700", color: "white"
        }}>S</div>
        <h1 style={{ fontSize: "26px", color: "var(--primary)", marginBottom: "6px" }}>
          Welcome Back
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Sign in to your Student Portal
        </p>
      </div>

      {error && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fecaca",
          color: "var(--danger)", padding: "12px 16px",
          borderRadius: "8px", marginBottom: "20px", fontSize: "14px"
        }}>{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{
            display: "block", fontSize: "13px", fontWeight: "500",
            color: "var(--text)", marginBottom: "6px"
          }}>Email Address</label>
          <input
            type="email"
            placeholder="you@university.edu"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: "100%", padding: "12px 16px",
              border: "2px solid var(--border)", borderRadius: "10px",
              fontSize: "15px", outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={e => e.target.style.borderColor = "var(--primary-light)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{
            display: "block", fontSize: "13px", fontWeight: "500",
            color: "var(--text)", marginBottom: "6px"
          }}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: "100%", padding: "12px 16px",
              border: "2px solid var(--border)", borderRadius: "10px",
              fontSize: "15px", outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={e => e.target.style.borderColor = "var(--primary-light)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        <button type="submit" disabled={loading} style={{
          width: "100%", padding: "13px",
          background: loading ? "var(--text-muted)" : "var(--primary)",
          color: "white", borderRadius: "10px",
          fontSize: "15px", fontWeight: "500",
          letterSpacing: "0.3px"
        }}
        onMouseOver={e => { if(!loading) e.target.style.background = "var(--primary-light)" }}
        onMouseOut={e => { if(!loading) e.target.style.background = "var(--primary)" }}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p style={{
        textAlign: "center", marginTop: "24px",
        fontSize: "14px", color: "var(--text-muted)"
      }}>
        Don't have an account?{" "}
        <button onClick={onSwitch} style={{
          background: "none", color: "var(--primary-light)",
          fontWeight: "600", fontSize: "14px",
          textDecoration: "underline"
        }}>Register here</button>
      </p>
    </div>
  );
}