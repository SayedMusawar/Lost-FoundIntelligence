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
      setOpen(!m);
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
  const sidebarW = 248;

  return (
    <>
      <style>{`
        .layout-topbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 300;
          height: 60px;
          background: #ffffff;
          border-bottom: 1.5px solid #d8eaf6;
          box-shadow: 0 2px 12px rgba(17,120,194,0.08);
          display: flex; align-items: center;
          padding: 0 16px 0 0;
          gap: 0;
        }
        .layout-brand-sub {
          font-size: 10px;
          color: #8a97aa;
        }
        .layout-user-name {
          font-size: 12px;
          font-weight: 600;
          color: #1e2530;
          line-height: 1.2;
        }
        .layout-user-role {
          font-size: 10px;
          color: #8a97aa;
          text-transform: capitalize;
        }
        .layout-logout-btn {
          padding: 7px 14px;
          background: #fdecea;
          border: 1.5px solid #f5b8b4;
          border-radius: 8px;
          color: #d93025;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: ${tr};
          font-family: 'Inter', sans-serif;
        }
        .layout-logout-btn:hover { background: #fbd5d2; }

        .layout-sidebar {
          position: fixed;
          top: 60px; left: 0; bottom: 0;
          background: #ffffff;
          border-right: 1.5px solid #d8eaf6;
          overflow: hidden;
          transition: width 0.25s cubic-bezier(0.4,0,0.2,1),
                      box-shadow 0.25s ease;
          display: flex;
          flex-direction: column;
        }
        .layout-sidebar-inner {
          width: ${sidebarW}px;
          padding: 16px 0 24px;
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow-y: auto;
        }
        .layout-main {
          transition: margin-left 0.25s cubic-bezier(0.4,0,0.2,1);
          min-height: calc(100vh - 60px);
          background: #f0f8fe;
        }
        .layout-main-inner {
          padding: 28px 24px 56px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ── Tablet ── */
        @media (max-width: 768px) {
          .layout-brand-sub { display: none; }
          .layout-user-chip-text { display: none; }
          .layout-main-inner { padding: 20px 16px 48px; }
        }

        /* ── Mobile ── */
        @media (max-width: 480px) {
          .layout-topbar { padding: 0 12px 0 0; }
          .layout-logout-btn { padding: 6px 10px; font-size: 11px; }
          .layout-main-inner { padding: 16px 12px 56px; }
        }

        /* Nav item hover */
        .nav-item:hover {
          background: #f0f8fe !important;
          color: #1178c2 !important;
        }

        /* Sidebar scrollbar */
        .layout-sidebar-inner::-webkit-scrollbar { width: 3px; }
        .layout-sidebar-inner::-webkit-scrollbar-thumb { background: #d8eaf6; border-radius: 2px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: c.skyLight }}>
        {/* ── Topbar ── */}
        <header className="layout-topbar">
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
              border: "none",
              cursor: "pointer",
            }}
          >
            ☰
          </button>

          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src="/fast-logo.png"
              alt="FAST-NUCES"
              style={{ height: 30, width: "auto", objectFit: "contain" }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div
              style={{
                width: 1,
                height: 24,
                background: c.border,
                margin: "0 4px",
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: c.fh,
                  fontWeight: 800,
                  fontSize: 13,
                  color: c.dark,
                  lineHeight: 1.1,
                  letterSpacing: "-0.1px",
                }}
              >
                Lost & Found
              </div>
              <div className="layout-brand-sub">Intelligence System</div>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                  cursor: "pointer",
                  flexShrink: 0,
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
                      border: "2px solid #fff",
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
                gap: 8,
                background: c.surface2,
                border: `1.5px solid ${c.border}`,
                borderRadius: 10,
                padding: "5px 10px 5px 5px",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg,${c.blue},${c.blueMid})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: c.fh,
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <div className="layout-user-chip-text">
                <div className="layout-user-name">{user.name}</div>
                <div className="layout-user-role">{user.role}</div>
              </div>
            </div>

            {/* Logout */}
            <button className="layout-logout-btn" onClick={onLogout}>
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
          className="layout-sidebar"
          style={{
            width: open ? sidebarW : 0,
            boxShadow: open ? "2px 0 16px rgba(17,120,194,0.06)" : "none",
            zIndex: mobile ? 260 : 100,
          }}
        >
          <div className="layout-sidebar-inner">
            {/* Campus tag */}
            <div style={{ padding: "0 12px", marginBottom: 16 }}>
              <div
                style={{
                  padding: "12px 14px",
                  background: `linear-gradient(135deg,${c.blue},${c.blueMid})`,
                  borderRadius: 10,
                  color: "#fff",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    opacity: 0.65,
                    letterSpacing: "0.8px",
                    marginBottom: 3,
                  }}
                >
                  CAMPUS
                </div>
                <div
                  style={{ fontSize: 12, fontWeight: 700, fontFamily: c.fh }}
                >
                  FAST-NUCES Peshawar
                </div>
                <div style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>
                  Student Affairs Portal
                </div>
              </div>
            </div>

            {/* Nav */}
            <div style={{ padding: "0 8px", flex: 1 }}>
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
                    className="nav-item"
                    onClick={() => {
                      onNavigate(item.id);
                      if (mobile) setOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
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
            <div style={{ padding: "0 8px" }}>
              <div
                style={{
                  height: 1,
                  background: c.border,
                  margin: "0 8px 14px",
                }}
              />
              <div style={{ padding: "0 8px", marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: c.text3, lineHeight: 1.7 }}>
                  Built by
                  <br />
                  <span
                    style={{ fontWeight: 600, color: c.text2, fontSize: 11 }}
                  >
                    Musawar Ali Shah
                  </span>
                  <br />
                  <span
                    style={{ fontWeight: 600, color: c.text2, fontSize: 11 }}
                  >
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
                  fontFamily: c.fb,
                }}
              >
                ⏻ Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main
          className="layout-main"
          style={{
            marginTop: 60,
            marginLeft: !mobile && open ? sidebarW : 0,
          }}
        >
          <div className="layout-main-inner">{children}</div>
        </main>
      </div>
    </>
  );
}
