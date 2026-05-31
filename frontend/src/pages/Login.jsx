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

  const submit = async () => {
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

  const inp = (focused) => ({
    width: "100%",
    padding: "12px 16px",
    background: focused ? "#fff" : c.surface2,
    border: `1.5px solid ${focused ? c.blue : c.border}`,
    borderRadius: 9,
    fontSize: 14,
    color: c.text,
    transition: tr,
    boxSizing: "border-box",
    boxShadow: focused ? "0 0 0 3px rgba(17,120,194,0.12)" : "none",
  });

  return (
    <>
      {/* Responsive CSS injected once */}
      <style>{`
        .login-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f0f8fe;
          position: relative;
          overflow-x: hidden;
        }
        .login-topbar {
          padding: 14px 28px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1.5px solid #d8eaf6;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 10;
        }
        .login-topbar-right {
          font-size: 11px;
          color: #8a97aa;
          text-align: right;
        }
        .login-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 20px 40px;
          position: relative;
          z-index: 1;
        }
        .login-card {
          width: 100%;
          max-width: 960px;
          display: flex;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 16px 60px rgba(17,120,194,0.16), 0 2px 12px rgba(17,120,194,0.08);
        }
        .login-left {
          flex: 0 0 42%;
          background: linear-gradient(160deg, #1178c2 0%, #0d5f9e 55%, #1e2530 100%);
          padding: 44px 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .login-right {
          flex: 1;
          background: #ffffff;
          padding: 48px 44px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .demo-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .demo-btn {
          padding: 10px 14px;
          background: #f0f8fe;
          border: 1.5px solid #d8eaf6;
          border-radius: 8px;
          color: #4a5568;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .demo-btn:hover {
          background: #e8f4fd;
          border-color: #b8d8f0;
        }

        /* ── Tablet ── */
        @media (max-width: 768px) {
          .login-card {
            flex-direction: column;
            max-width: 480px;
            border-radius: 16px;
          }
          .login-left {
            flex: none;
            padding: 32px 28px;
          }
          .login-right {
            padding: 32px 28px;
          }
          .login-left-bottom {
            display: none;
          }
        }

        /* ── Mobile ── */
        @media (max-width: 480px) {
          .login-topbar {
            padding: 12px 16px;
          }
          .login-topbar-right {
            display: none;
          }
          .login-main {
            padding: 20px 12px 32px;
            align-items: flex-start;
          }
          .login-card {
            border-radius: 14px;
            max-width: 100%;
          }
          .login-left {
            padding: 24px 20px;
          }
          .login-right {
            padding: 24px 20px;
          }
          .demo-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="login-root">
        {/* Ambient blobs */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, #bde3f7 0%, transparent 70%)",
            opacity: 0.5,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, #e8f4fd 0%, transparent 70%)",
            opacity: 0.8,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Topbar */}
        <header className="login-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src="/fast-logo.png"
              alt="FAST-NUCES"
              style={{ height: 36, width: "auto", objectFit: "contain" }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
          <div className="login-topbar-right">
            <div>Database Systems Lab · Spring 2026</div>
            <div style={{ fontWeight: 600, color: "#4a5568" }}>
              FAST-NUCES Peshawar
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="login-main">
          <div className="login-card">
            {/* ── Left panel ── */}
            <div className="login-left">
              {/* Decorative circles */}
              <div
                style={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  border: "1.5px solid rgba(255,255,255,0.08)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 80,
                  left: -30,
                  width: 140,
                  height: 140,
                  borderRadius: "50%",
                  background: "rgba(189,227,247,0.07)",
                  pointerEvents: "none",
                }}
              />

              {/* Top */}
              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Logo badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 28,
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.12)",
                      border: "1.5px solid rgba(255,255,255,0.22)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 800,
                      color: "#fff",
                      fontFamily: "'Syne',sans-serif",
                      flexShrink: 0,
                    }}
                  >
                    LF
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "rgba(255,255,255,0.5)",
                        letterSpacing: "0.8px",
                        marginBottom: 3,
                      }}
                    >
                      FAST-NUCES PESHAWAR
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#fff",
                        fontFamily: "'Syne',sans-serif",
                      }}
                    >
                      Student Affairs Office
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h1
                  style={{
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 800,
                    fontSize: 24,
                    color: "#fff",
                    lineHeight: 1.25,
                    marginBottom: 14,
                    letterSpacing: "-0.3px",
                  }}
                >
                  Lost & Found
                  <br />
                  <span style={{ color: "#bde3f7" }}>Intelligence</span>
                  <br />
                  System
                </h1>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.7,
                    marginBottom: 0,
                  }}
                >
                  Digitizing the lost item workflow at FAST Peshawar — from
                  registration to claim, verification, and digital receipt.
                </p>
              </div>

              {/* Bottom credits */}
              <div
                className="login-left-bottom"
                style={{
                  position: "relative",
                  zIndex: 1,
                  paddingTop: 20,
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  marginTop: 24,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.35)",
                    marginBottom: 6,
                    letterSpacing: "0.5px",
                  }}
                >
                  DEVELOPED BY
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.9,
                  }}
                >
                  Muhammad Musawar Ali Shah (24P-0619)
                  <br />
                  Muhammad Ahmed Asim (24P-0740)
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.35)",
                    marginTop: 6,
                  }}
                >
                  Database Systems Lab · Spring 2026
                </div>
              </div>
            </div>

            {/* ── Right panel (form) ── */}
            <div className="login-right">
              <h2
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: 26,
                  fontWeight: 800,
                  color: c.dark,
                  marginBottom: 6,
                  letterSpacing: "-0.3px",
                }}
              >
                Welcome back
              </h2>
              <p style={{ fontSize: 13, color: c.text3, marginBottom: 30 }}>
                Sign in to access the portal
              </p>

              {/* Email */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 600,
                    color: c.text2,
                    letterSpacing: "0.7px",
                    textTransform: "uppercase",
                    marginBottom: 7,
                  }}
                >
                  Email Address
                </label>
                <input
                  style={inp(focusE)}
                  type="email"
                  placeholder="yourname@nu.edu.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusE(true)}
                  onBlur={() => setFocusE(false)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 22 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 600,
                    color: c.text2,
                    letterSpacing: "0.7px",
                    textTransform: "uppercase",
                    marginBottom: 7,
                  }}
                >
                  Password
                </label>
                <input
                  style={inp(focusP)}
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusP(true)}
                  onBlur={() => setFocusP(false)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    padding: "11px 16px",
                    marginBottom: 18,
                    background: c.redBg,
                    border: "1.5px solid #f5b8b4",
                    borderRadius: 8,
                    fontSize: 13,
                    color: c.red,
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  ⚠ {error}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={submit}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: loading
                    ? c.blueMid
                    : `linear-gradient(135deg, ${c.blue}, ${c.blueDark})`,
                  color: "#fff",
                  border: "none",
                  borderRadius: 9,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading ? "wait" : "pointer",
                  fontFamily: "'Syne',sans-serif",
                  letterSpacing: "0.3px",
                  transition: tr,
                  boxShadow: loading
                    ? "none"
                    : "0 4px 20px rgba(17,120,194,0.35)",
                }}
              >
                {loading ? "Signing in…" : "Sign In →"}
              </button>

              {/* Divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  margin: "20px 0",
                }}
              >
                <div style={{ flex: 1, height: 1, background: c.border }} />
                <span style={{ fontSize: 11, color: c.text3 }}>
                  demo accounts
                </span>
                <div style={{ flex: 1, height: 1, background: c.border }} />
              </div>

              {/* Demo chips */}
              <div className="demo-grid">
                {[
                  {
                    label: "🛡 Admin",
                    sub: "admin@fast.edu.pk",
                    email: "admin@fast.edu.pk",
                    pw: "admin123",
                  },
                  {
                    label: "🎓 Student",
                    sub: "ali@fast.edu.pk",
                    email: "ali@fast.edu.pk",
                    pw: "student123",
                  },
                ].map((d) => (
                  <button
                    key={d.label}
                    className="demo-btn"
                    onClick={() => {
                      setEmail(d.email);
                      setPassword(d.pw);
                    }}
                  >
                    <div style={{ fontSize: 13, marginBottom: 2 }}>
                      {d.label}
                    </div>
                    <div
                      style={{ fontSize: 10, color: c.text3, fontWeight: 400 }}
                    >
                      {d.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            padding: "14px 16px 20px",
            fontSize: 11,
            color: c.text3,
            position: "relative",
            zIndex: 1,
          }}
        >
          FAST Peshawar Lost & Found Intelligence System · Developed by Muhammad
          Musawar Ali Shah & Muhammad Ahmed Asim · Spring 2026
        </footer>
      </div>
    </>
  );
}
