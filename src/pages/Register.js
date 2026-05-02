import { useState } from "react";
import { register } from "../api/api";

export default function Register({ onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(name, email, password);
    setMsg(result);
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px",
    border: "2px solid var(--border)", borderRadius: "10px",
    fontSize: "15px", outline: "none"
  };

  return (
    <div style={{
      background: "white", borderRadius: "20px",
      padding: "48px 40px", width: "100%", maxWidth: "420px",
      boxShadow: "0 24px 64px rgba(0,0,0,0.25)"
    }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{
          width: "56px", height: "56px",
          background: "var(--primary)", borderRadius: "14px",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
          fontSize: "24px", fontWeight: "700", color: "white"
        }}>S</div>
        <h1 style={{ fontSize: "26px", color: "var(--primary)", marginBottom: "6px" }}>
          Create Account
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Join the Student Portal
        </p>
      </div>

      {msg && (
        <div style={{
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          color: "var(--success)", padding: "12px 16px",
          borderRadius: "8px", marginBottom: "20px", fontSize: "14px"
        }}>{msg} — <button onClick={onSwitch} style={{
          background: "none", color: "var(--success)",
          fontWeight: "600", textDecoration: "underline", fontSize: "14px"
        }}>Login now</button></div>
      )}

      <form onSubmit={handleSubmit}>
        {[
          { label: "Full Name", value: name, setter: setName,
            type: "text", placeholder: "John Doe" },
          { label: "Email Address", value: email, setter: setEmail,
            type: "email", placeholder: "you@university.edu" },
          { label: "Password", value: password, setter: setPassword,
            type: "password", placeholder: "Choose a password" }
        ].map(({ label, value, setter, type, placeholder }) => (
          <div key={label} style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block", fontSize: "13px", fontWeight: "500",
              color: "var(--text)", marginBottom: "6px"
            }}>{label}</label>
            <input
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={e => setter(e.target.value)}
              required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "var(--primary-light)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>
        ))}

        <div style={{ marginTop: "8px" }}>
          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "13px",
            background: loading ? "var(--text-muted)" : "var(--primary)",
            color: "white", borderRadius: "10px",
            fontSize: "15px", fontWeight: "500"
          }}
          onMouseOver={e => { if(!loading) e.target.style.background = "var(--primary-light)" }}
          onMouseOut={e => { if(!loading) e.target.style.background = "var(--primary)" }}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </div>
      </form>

      <p style={{
        textAlign: "center", marginTop: "24px",
        fontSize: "14px", color: "var(--text-muted)"
      }}>
        Already have an account?{" "}
        <button onClick={onSwitch} style={{
          background: "none", color: "var(--primary-light)",
          fontWeight: "600", fontSize: "14px", textDecoration: "underline"
        }}>Sign in</button>
      </p>
    </div>
  );
}