import { useState, useEffect } from "react";
import { getNotifications } from "../api/client";
import { c, tr } from "../theme";

const NAV_ITEMS = {
  admin: [
    { id: "items", icon: "⊞", label: "Browse Items" },
    { id: "register", icon: "+", label: "Register Item" },
    { id: "admin", icon: "◈", label: "Dashboard" },
    { id: "receipt", icon: "▤", label: "Issue Receipt" },
  ],
  staff: [
    { id: "items", icon: "⊞", label: "Browse Items" },
    { id: "register", icon: "+", label: "Register Item" },
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (user && ["student", "faculty"].includes(user.role)) {
      getNotifications(user.user_id)
        .then((r) => setUnread(r.data.filter((n) => !n.is_read).length))
        .catch(() => {});
    }
  }, [user, currentPage]);

  const navItems = NAV_ITEMS[user.role] || NAV_ITEMS.student;
  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const sidebarW = sidebarOpen ? 240 : 0;

  return (
    <div style={{ minHeight: "100vh", background: c.bg }}>
      {/* ── Topbar ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 300,
          height: 56,
          background: "rgba(8,11,18,0.90)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${c.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 20px 0 0",
          gap: 0,
        }}
      >
        {/* Hamburger */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          style={{
            width: 56,
            height: 56,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            color: c.text2,
            fontSize: 20,
            transition: tr,
          }}
        >
          ☰
        </button>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${c.teal}, #0099ff)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 800,
              color: c.bg,
              fontFamily: c.fh,
              boxShadow: `0 0 12px ${c.tealGlow}`,
            }}
          >
            NU
          </div>
          <span
            style={{
              fontFamily: c.fh,
              fontWeight: 800,
              fontSize: 16,
              color: c.text,
              letterSpacing: "0.5px",
            }}
          >
            I-FAST
          </span>
          <span
            style={{
              fontSize: 11,
              color: c.text3,
              borderLeft: `1px solid ${c.border2}`,
              paddingLeft: 10,
              marginLeft: 2,
            }}
          >
            Lost & Found Portal
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Notification bell */}
          {["student", "faculty"].includes(user.role) && (
            <button
              onClick={() => onNavigate("notifications")}
              style={{
                position: "relative",
                width: 36,
                height: 36,
                borderRadius: 8,
                background: c.surface,
                border: `1px solid ${c.border}`,
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
                    top: 6,
                    right: 6,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: c.amber,
                    border: `2px solid ${c.bg}`,
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
              background: c.surface,
              border: `1px solid ${c.border}`,
              borderRadius: 10,
              padding: "5px 12px 5px 6px",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: `rgba(0,229,176,0.12)`,
                border: `1.5px solid rgba(0,229,176,0.35)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                color: c.teal,
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
              background: "rgba(255,77,77,0.08)",
              border: "1px solid rgba(255,77,77,0.2)",
              borderRadius: 8,
              color: "#ff6b6b",
              fontSize: 12,
              fontWeight: 500,
              transition: tr,
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ── Sidebar ── */}
      {/* Overlay on mobile */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 250,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      <aside
        style={{
          position: "fixed",
          top: 56,
          left: 0,
          bottom: 0,
          width: sidebarOpen ? 240 : 0,
          background: c.bg2,
          borderRight: sidebarOpen ? `1px solid ${c.border}` : "none",
          overflow: "hidden",
          transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
          zIndex: isMobile ? 260 : 100,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: 240,
            padding: "20px 0 24px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Campus tag */}
          <div style={{ padding: "0 16px", marginBottom: 24 }}>
            <div
              style={{
                padding: "10px 14px",
                background: c.bg3,
                borderRadius: 10,
                border: `1px solid ${c.border}`,
              }}
            >
              <div style={{ fontSize: 10, color: c.text3, marginBottom: 3 }}>
                CAMPUS
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: c.text }}>
                FAST-NUCES Peshawar
              </div>
            </div>
          </div>

          {/* Nav items */}
          <div style={{ padding: "0 10px", flex: 1 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: c.text3,
                letterSpacing: "1px",
                padding: "0 8px",
                marginBottom: 8,
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
                    if (isMobile) setSidebarOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    padding: "11px 12px",
                    borderRadius: 8,
                    marginBottom: 3,
                    background: active ? `rgba(0,229,176,0.10)` : "transparent",
                    border: active
                      ? `1px solid rgba(0,229,176,0.18)`
                      : "1px solid transparent",
                    color: active ? c.teal : c.text2,
                    fontSize: 13.5,
                    fontWeight: active ? 600 : 400,
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
                        color: c.bg,
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
                        height: 20,
                        background: c.teal,
                        borderRadius: "0 3px 3px 0",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ padding: "0 10px", marginTop: 16 }}>
            <div
              style={{
                height: 1,
                background: c.border,
                margin: "0 8px 14px",
              }}
            />
            <button
              onClick={onLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                background: "rgba(255,77,77,0.06)",
                border: "1px solid rgba(255,77,77,0.12)",
                color: "#ff6b6b",
                fontSize: 13,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: tr,
              }}
            >
              <span>⏻</span> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main
        style={{
          marginTop: 56,
          marginLeft: !isMobile && sidebarOpen ? 240 : 0,
          transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
          minHeight: "calc(100vh - 56px)",
          padding: "32px 28px 56px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>{children}</div>
      </main>
    </div>
  );
}
