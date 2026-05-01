import { useState } from "react";
import { loginUser } from "../api/client";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      onLogin(res.data);
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <div style={s.nuCircle}>
          <span style={s.nuText}>NU</span>
        </div>
        <div style={s.divider} />
        <span style={s.fastText}>I-FAST</span>
        <span style={s.portalLabel}>Lost & Found Portal — Peshawar Campus</span>
      </div>

      <div style={s.main}>
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.nuCircleLg}>
              <span style={s.nuTextLg}>NU</span>
            </div>
            <h2 style={s.title}>Welcome back</h2>
            <p style={s.subtitle}>FAST Peshawar Lost & Found System</p>
          </div>

          <label style={s.label}>EMAIL ADDRESS</label>
          <input
            style={s.input}
            type="email"
            placeholder="yourname@nu.edu.pk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label style={s.label}>PASSWORD</label>
          <input
            style={s.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />

          {error && <p style={s.error}>{error}</p>}

          <button style={s.btn} onClick={handleSubmit} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p style={s.footer}>FAST-NUCES Peshawar · Student Affairs Office</p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#eef2f9",
    display: "flex",
    flexDirection: "column",
  },
  topbar: {
    backgroundColor: "#0c2d6b",
    padding: "10px 24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  nuCircle: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    backgroundColor: "#0c2d6b",
    border: "2px solid #1a9e75",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  nuText: { fontSize: 11, fontWeight: "500", color: "#fff" },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.25)",
    margin: "0 4px",
  },
  fastText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 1,
  },
  portalLabel: { color: "rgba(255,255,255,0.55)", fontSize: 12, marginLeft: 4 },
  main: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    border: "0.5px solid #c8d8f0",
    padding: "36px 32px",
    width: "100%",
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  cardHeader: {
    textAlign: "center",
    marginBottom: 28,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  nuCircleLg: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    backgroundColor: "#0c2d6b",
    border: "2px solid #1a9e75",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  nuTextLg: { fontSize: 14, fontWeight: "500", color: "#fff" },
  title: { fontSize: 20, fontWeight: "500", color: "#0c2d6b", margin: 0 },
  subtitle: { fontSize: 13, color: "#6b7a99", margin: 0 },
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: "600",
    color: "#4a5878",
    marginBottom: 6,
    marginTop: 14,
    letterSpacing: "0.4px",
  },
  input: {
    width: "100%",
    padding: "10px 13px",
    borderRadius: 8,
    border: "0.5px solid #c8d8f0",
    fontSize: 14,
    color: "#1a1a2e",
    backgroundColor: "#f8faff",
    outline: "none",
  },
  error: {
    color: "#a32d2d",
    fontSize: 13,
    marginTop: 8,
    backgroundColor: "#fcebeb",
    padding: "8px 12px",
    borderRadius: 6,
  },
  btn: {
    width: "100%",
    padding: 11,
    backgroundColor: "#0c2d6b",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: "500",
    cursor: "pointer",
    marginTop: 20,
  },
  footer: {
    textAlign: "center",
    fontSize: 11,
    color: "#9aa5be",
    marginTop: 20,
  },
};
