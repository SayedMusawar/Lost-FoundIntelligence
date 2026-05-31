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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: c.skyLight,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorations */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${c.sky} 0%, transparent 70%)`,
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${c.blueLight} 0%, transparent 70%)`,
          opacity: 0.8,
          pointerEvents: "none",
        }}
      />
      {/* Blue stripe at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${c.blue}, ${c.blueMid}, ${c.sky})`,
        }}
      />

      {/* ── Topbar ── */}
      <header
        style={{
          padding: "16px 36px",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: `1.5px solid ${c.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 9,
              background: `linear-gradient(135deg, ${c.blue}, ${c.blueMid})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 800,
              color: "#fff",
              fontFamily: c.fh,
              boxShadow: `0 3px 12px rgba(17,120,194,0.35)`,
            }}
          >
            LF
          </div>
          <div>
            <div
              style={{
                fontFamily: c.fh,
                fontWeight: 800,
                fontSize: 15,
                color: c.dark,
                letterSpacing: "-0.2px",
              }}
            >
              FAST Peshawar
            </div>
            <div style={{ fontSize: 10, color: c.text3 }}>
              Lost & Found Intelligence System
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: c.text3, textAlign: "right" }}>
          <div>Database Systems Lab · Spring 2026</div>
          <div style={{ fontWeight: 600, color: c.text2 }}>
            FAST-NUCES Peshawar
          </div>
        </div>
      </header>

      {/* ── Main ── */}
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
        <div
          style={{
            width: "100%",
            maxWidth: 980,
            display: "flex",
            gap: 0,
            alignItems: "stretch",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow:
              "0 16px 60px rgba(17,120,194,0.16), 0 2px 12px rgba(17,120,194,0.08)",
          }}
        >
          {/* ── Left panel (hero) ── */}
          <div
            style={{
              flex: "0 0 44%",
              background: `linear-gradient(160deg, ${c.blue} 0%, ${c.blueDark} 60%, ${c.dark} 100%)`,
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative circles */}
            <div
              style={{
                position: "absolute",
                top: -60,
                right: -60,
                width: 220,
                height: 220,
                borderRadius: "50%",
                border: "1.5px solid rgba(255,255,255,0.08)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 140,
                height: 140,
                borderRadius: "50%",
                border: "1.5px solid rgba(255,255,255,0.05)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 60,
                left: -40,
                width: 180,
                height: 180,
                borderRadius: "50%",
                background: "rgba(189,227,247,0.06)",
                pointerEvents: "none",
              }}
            />

            {/* Top content */}
            <div>
              {/* Logo badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 36,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.12)",
                    border: "1.5px solid rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#fff",
                    fontFamily: c.fh,
                  }}
                >
                  LF
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.5)",
                      letterSpacing: "1px",
                    }}
                  >
                    FAST-NUCES PESHAWAR
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                    Student Affairs Office
                  </div>
                </div>
              </div>

              {/* Headline */}
              <h1
                style={{
                  fontFamily: c.fh,
                  fontWeight: 800,
                  fontSize: 26,
                  color: "#fff",
                  lineHeight: 1.25,
                  marginBottom: 16,
                  letterSpacing: "-0.3px",
                }}
              >
                Lost & Found
                <br />
                <span style={{ color: c.sky }}>Intelligence</span>
                <br />
                System
              </h1>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.7,
                  marginBottom: 32,
                }}
              >
                Digitizing the lost item workflow at FAST Peshawar — from
                registration to claim, verification, and digital receipt.
              </p>

              {/* Feature pills */}
              {[
                { icon: "🔍", text: "Smart item search & filter" },
                { icon: "📋", text: "Claim submission & tracking" },
                { icon: "✅", text: "Admin verification dashboard" },
                { icon: "🔔", text: "Real-time notifications" },
              ].map((f) => (
                <div
                  key={f.text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      background: "rgba(255,255,255,0.10)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      flexShrink: 0,
                    }}
                  >
                    {f.icon}
                  </span>
                  <span
                    style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}
                  >
                    {f.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom credits */}
            <div
              style={{
                paddingTop: 24,
                borderTop: "1px solid rgba(255,255,255,0.1)",
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
                  lineHeight: 1.8,
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
          <div
            style={{
              flex: 1,
              background: "#ffffff",
              padding: "48px 44px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="fade-up">
              <h2
                style={{
                  fontFamily: c.fh,
                  fontSize: 26,
                  fontWeight: 800,
                  color: c.dark,
                  marginBottom: 6,
                  letterSpacing: "-0.3px",
                }}
              >
                Welcome back
              </h2>
              <p style={{ fontSize: 13, color: c.text3, marginBottom: 32 }}>
                Sign in to access the portal
              </p>

              {/* Email */}
              <div style={{ marginBottom: 18 }}>
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
              <div style={{ marginBottom: 24 }}>
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
                    marginBottom: 20,
                    background: c.redBg,
                    border: `1.5px solid #f5b8b4`,
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
                  fontFamily: c.fh,
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
                  margin: "22px 0",
                }}
              >
                <div style={{ flex: 1, height: 1, background: c.border }} />
                <span style={{ fontSize: 11, color: c.text3 }}>
                  demo accounts
                </span>
                <div style={{ flex: 1, height: 1, background: c.border }} />
              </div>

              {/* Demo chips */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  {
                    label: "🛡 Admin",
                    email: "admin@fast.edu.pk",
                    pw: "admin123",
                  },
                  {
                    label: "🎓 Student",
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
                      padding: "10px 14px",
                      background: c.surface2,
                      border: `1.5px solid ${c.border}`,
                      borderRadius: 8,
                      color: c.text2,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: tr,
                      textAlign: "left",
                    }}
                  >
                    <div style={{ fontSize: 13, marginBottom: 2 }}>
                      {d.label}
                    </div>
                    <div
                      style={{ fontSize: 10, color: c.text3, fontWeight: 400 }}
                    >
                      {d.email}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        style={{
          textAlign: "center",
          padding: "16px",
          fontSize: 11,
          color: c.text3,
          position: "relative",
          zIndex: 1,
        }}
      >
        FAST Peshawar Lost & Found Intelligence System · Database Systems Lab ·
        Spring 2026
      </footer>
    </div>
  );
}
