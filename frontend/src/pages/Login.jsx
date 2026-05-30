import { useState } from "react";
import { loginUser } from "../api/client";
import { c, tr } from "../theme";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusE, setFocusE] = useState(false);
  const [focusP, setFocusP] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(email, password);
      onLogin(res.data);
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (focused) => ({
    width: "100%",
    padding: "13px 16px",
    background: focused ? "rgba(0,229,176,0.05)" : "rgba(255,255,255,0.04)",
    border: focused
      ? "1px solid rgba(0,229,176,0.45)"
      : "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    fontSize: 14,
    color: c.text,
    transition: tr,
    boxSizing: "border-box",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: c.bg,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glows */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          top: -200,
          left: -200,
          background:
            "radial-gradient(circle, rgba(0,229,176,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          bottom: -150,
          right: -150,
          background:
            "radial-gradient(circle, rgba(77,159,255,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Topbar */}
      <header
        style={{
          padding: "18px 32px",
          borderBottom: `1px solid ${c.border}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${c.teal}, #0099ff)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 800,
            color: c.bg,
            fontFamily: c.fh,
            boxShadow: `0 0 16px rgba(0,229,176,0.3)`,
          }}
        >
          NU
        </div>
        <span
          style={{
            fontFamily: c.fh,
            fontSize: 18,
            fontWeight: 800,
            color: c.text,
          }}
        >
          I-FAST
        </span>
        <span
          style={{
            fontSize: 12,
            color: c.text3,
            paddingLeft: 12,
            borderLeft: `1px solid ${c.border2}`,
          }}
        >
          Lost & Found Portal · Peshawar Campus
        </span>
      </header>

      {/* Main */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ width: "100%", maxWidth: 440 }} className="fade-up">
          {/* Hero text */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: `rgba(0,229,176,0.10)`,
                border: `1.5px solid rgba(0,229,176,0.3)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: 26,
                animation: "glow 3s ease infinite",
              }}
            >
              🔍
            </div>
            <h1
              style={{
                fontFamily: c.fh,
                fontSize: 30,
                fontWeight: 800,
                color: c.text,
                letterSpacing: "-0.5px",
                marginBottom: 8,
              }}
            >
              Welcome back
            </h1>
            <p style={{ fontSize: 14, color: c.text2 }}>
              Sign in to access the I-FAST portal
            </p>
          </div>

          {/* Card */}
          <div
            style={{
              background: c.surface,
              border: `1px solid ${c.border2}`,
              borderRadius: 20,
              padding: "32px 32px 28px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
            }}
          >
            {/* Institute tag */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: c.bg3,
                borderRadius: 10,
                border: `1px solid ${c.border}`,
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: `rgba(0,229,176,0.12)`,
                  border: `1.5px solid rgba(0,229,176,0.3)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: c.teal,
                  fontFamily: c.fh,
                }}
              >
                NU
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: c.text }}>
                  FAST-NUCES Peshawar
                </div>
                <div style={{ fontSize: 11, color: c.text3 }}>
                  Student Affairs Office
                </div>
              </div>
            </div>

            {/* Fields */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 600,
                  color: c.text3,
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  marginBottom: 7,
                }}
              >
                Email Address
              </label>
              <input
                style={inputStyle(focusE)}
                type="email"
                placeholder="yourname@nu.edu.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusE(true)}
                onBlur={() => setFocusE(false)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 600,
                  color: c.text3,
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  marginBottom: 7,
                }}
              >
                Password
              </label>
              <input
                style={inputStyle(focusP)}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusP(true)}
                onBlur={() => setFocusP(false)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            {error && (
              <div
                style={{
                  padding: "12px 16px",
                  marginBottom: 18,
                  background: "rgba(255,77,77,0.10)",
                  border: "1px solid rgba(255,77,77,0.25)",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#ff6b6b",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                ⚠ {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading ? "rgba(0,229,176,0.5)" : c.teal,
                color: c.bg,
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                fontFamily: c.fh,
                letterSpacing: "0.3px",
                transition: tr,
                boxShadow: loading ? "none" : `0 0 24px rgba(0,229,176,0.25)`,
              }}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>

            {/* Demo chips */}
            <div
              style={{
                marginTop: 22,
                paddingTop: 18,
                borderTop: `1px solid ${c.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 11, color: c.text3 }}>
                Demo accounts
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  {
                    label: "Admin",
                    email: "admin@fast.edu.pk",
                    pw: "admin123",
                  },
                  {
                    label: "Student",
                    email: "ali@fast.edu.pk",
                    pw: "student123",
                  },
                ].map((d) => (
                  <button
                    key={d.label}
                    onClick={() => {
                      setEmail(d.email);
                      setPassword(d.pw);
                    }}
                    style={{
                      padding: "5px 14px",
                      borderRadius: 99,
                      border: `1px solid ${c.border2}`,
                      background: "transparent",
                      color: c.text2,
                      fontSize: 11,
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: tr,
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: 11,
              color: c.text3,
              marginTop: 20,
            }}
          >
            FAST-NUCES Peshawar · Database Systems Lab · Spring 2026
          </p>
        </div>
      </main>
    </div>
  );
}
