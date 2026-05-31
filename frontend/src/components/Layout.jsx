import { useState, useEffect } from "react";
import { getNotifications } from "../api/client";
import { c, tr } from "../theme";

const NAV = {
  admin: [
    { id: "items", icon: "⊞", label: "Browse Items" },
    { id: "register", icon: "＋", label: "Register Item" },
    { id: "admin", icon: "◈", label: "Dashboard" },
    { id: "receipt", icon: "▤", label: "Issue Receipt" },
  ],
  staff: [
    { id: "items", icon: "⊞", label: "Browse Items" },
    { id: "register", icon: "＋", label: "Register Item" },
  ],
  student: [
    { id: "items", icon: "⊞", label: "Browse Items" },
    { id: "myclaims", icon: "◱", label: "My Claims" },
    { id: "notifications", icon: "◉", label: "Notifications" },
  ],
  faculty: [
    { id: "items", icon: "⊞", label: "Browse Items" },
    { id: "myclaims", icon: "◱", label: "My Claims" },
    { id: "notifications", icon: "◉", label: "Notifications" },
  ],
};

export default function Layout({
  user,
  currentPage,
  onNavigate,
  onLogout,
  children,
}) {
  const [open, setOpen] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const check = () => {
      const m = window.innerWidth < 768;
      setMobile(m);
      if (m) setOpen(false);
      else setOpen(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (["student", "faculty"].includes(user.role)) {
      getNotifications(user.user_id)
        .then((r) => setUnread(r.data.filter((n) => !n.is_read).length))
        .catch(() => {});
    }
  }, [user, currentPage]);

  const navItems = NAV[user.role] || NAV.student;
  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: c.skyLight }}>
      {/* ── Topbar ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 300,
          height: 60,
          background: "#ffffff",
          borderBottom: `1.5px solid ${c.border}`,
          boxShadow: "0 2px 12px rgba(17,120,194,0.08)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px 0 0",
        }}
      >
        {/* Hamburger */}
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            width: 60,
            height: 60,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            color: c.text2,
            fontSize: 20,
          }}
        >
          ☰
        </button>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${c.blue}, ${c.blueMid})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 800,
              color: "#fff",
              fontFamily: c.fh,
              boxShadow: "0 2px 10px rgba(17,120,194,0.35)",
              flexShrink: 0,
            }}
          >
            LF
          </div>
          <div>
            <div
              style={{
                fontFamily: c.fh,
                fontWeight: 800,
                fontSize: 14,
                color: c.dark,
                lineHeight: 1.1,
                letterSpacing: "-0.2px",
              }}
            >
              FAST Peshawar
            </div>
            <div
              style={{ fontSize: 10, color: c.text3, letterSpacing: "0.2px" }}
            >
              Lost & Found Intelligence
            </div>
          </div>
          <div
            style={{
              width: 1,
              height: 28,
              background: c.border,
              margin: "0 6px",
            }}
          />
          <span style={{ fontSize: 11, color: c.text3 }}>Portal</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Bell */}
          {["student", "faculty"].includes(user.role) && (
            <button
              onClick={() => onNavigate("notifications")}
              style={{
                position: "relative",
                width: 36,
                height: 36,
                borderRadius: 8,
                background: c.surface2,
                border: `1.5px solid ${c.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: unread > 0 ? c.amber : c.text2,
                fontSize: 16,
              }}
            >
              🔔
              {unread > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: c.amber,
                    border: `2px solid #fff`,
                  }}
                />
              )}
            </button>
          )}

          {/* User chip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              background: c.surface2,
              border: `1.5px solid ${c.border}`,
              borderRadius: 10,
              padding: "5px 12px 5px 6px",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${c.blue}, ${c.blueMid})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
                fontFamily: c.fh,
              }}
            >
              {initials}
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: c.text,
                  lineHeight: 1.2,
                }}
              >
                {user.name}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: c.text3,
                  textTransform: "capitalize",
                }}
              >
                {user.role}
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            style={{
              padding: "7px 14px",
              background: "#fdecea",
              border: "1.5px solid #f5b8b4",
              borderRadius: 8,
              color: c.red,
              fontSize: 12,
              fontWeight: 600,
              transition: tr,
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ── Mobile overlay ── */}
      {mobile && open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 250,
            background: "rgba(30,37,48,0.35)",
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{
          position: "fixed",
          top: 60,
          left: 0,
          bottom: 0,
          width: open ? 248 : 0,
          background: "#ffffff",
          borderRight: `1.5px solid ${c.border}`,
          boxShadow: open ? "2px 0 16px rgba(17,120,194,0.06)" : "none",
          overflow: "hidden",
          transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
          zIndex: mobile ? 260 : 100,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: 248,
            padding: "20px 0 24px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Campus tag */}
          <div style={{ padding: "0 14px", marginBottom: 20 }}>
            <div
              style={{
                padding: "12px 14px",
                background: `linear-gradient(135deg, ${c.blue}, ${c.blueMid})`,
                borderRadius: 10,
                color: "#fff",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  opacity: 0.7,
                  letterSpacing: "0.8px",
                  marginBottom: 4,
                }}
              >
                CAMPUS
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, fontFamily: c.fh }}>
                FAST-NUCES Peshawar
              </div>
              <div style={{ fontSize: 10, opacity: 0.65, marginTop: 2 }}>
                Student Affairs Portal
              </div>
            </div>
          </div>

          {/* Nav */}
          <div style={{ padding: "0 10px", flex: 1 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: c.text3,
                letterSpacing: "1px",
                padding: "0 8px 8px",
              }}
            >
              NAVIGATION
            </div>
            {navItems.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    if (mobile) setOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    width: "100%",
                    padding: "11px 12px",
                    borderRadius: 8,
                    marginBottom: 3,
                    background: active ? c.blueLight : "transparent",
                    border: active
                      ? `1.5px solid ${c.border2}`
                      : "1.5px solid transparent",
                    color: active ? c.blue : c.text2,
                    fontSize: 13.5,
                    fontWeight: active ? 700 : 400,
                    fontFamily: c.fb,
                    cursor: "pointer",
                    transition: tr,
                    whiteSpace: "nowrap",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      width: 18,
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  {item.id === "notifications" && unread > 0 && (
                    <span
                      style={{
                        marginLeft: "auto",
                        minWidth: 18,
                        height: 18,
                        borderRadius: 99,
                        background: c.amber,
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 4px",
                      }}
                    >
                      {unread}
                    </span>
                  )}
                  {active && (
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 3,
                        height: 22,
                        background: c.blue,
                        borderRadius: "0 3px 3px 0",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ padding: "0 10px" }}>
            <div
              style={{ height: 1, background: c.border, margin: "0 8px 14px" }}
            />
            <div style={{ padding: "0 8px", marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: c.text3, lineHeight: 1.6 }}>
                Built by
                <br />
                <span style={{ fontWeight: 600, color: c.text2 }}>
                  Muhammad Musawar Ali Shah
                </span>
                <br />
                <span style={{ fontWeight: 600, color: c.text2 }}>
                  & Ahmed Asim
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                background: "#fdecea",
                border: "1.5px solid #f5b8b4",
                color: c.red,
                fontSize: 13,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: tr,
              }}
            >
              ⏻ Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main
        style={{
          marginTop: 60,
          marginLeft: !mobile && open ? 248 : 0,
          transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
          minHeight: "calc(100vh - 60px)",
          padding: "32px 28px 56px",
          background: c.skyLight,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>{children}</div>
      </main>
    </div>
  );
}
