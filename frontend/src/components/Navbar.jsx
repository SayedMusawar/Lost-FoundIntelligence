// Navbar.jsx
import { useState, useEffect } from "react";
import { getNotifications } from "../api/client";

export default function Navbar({ user, currentPage, onNavigate, onLogout }) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (user && (user.role === "student" || user.role === "faculty")) {
      getNotifications(user.user_id)
        .then((res) => setUnread(res.data.filter((n) => !n.is_read).length))
        .catch(() => {});
    }
  }, [user, currentPage]);

  const isAdmin = user.role === "admin";
  const isStaff = user.role === "staff";
  const isStudent = user.role === "student" || user.role === "faculty";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');
        .nav-link {
          padding: 6px 14px; border-radius: 8px; border: none;
          background: none; font-size: 13px; font-weight: 500;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          color: rgba(255,255,255,0.75); transition: all 0.15s;
          display: flex; align-items: center; gap: 6px;
        }
        .nav-link:hover { background: rgba(255,255,255,0.12); color: white; }
        .nav-link.active { background: rgba(255,255,255,0.18); color: white; font-weight: 600; }
        .logout-btn {
          padding: 6px 14px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.3);
          background: none; font-size: 13px; font-weight: 500;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          color: rgba(255,255,255,0.8); transition: all 0.15s;
        }
        .logout-btn:hover { background: rgba(255,255,255,0.12); color: white; }
      `}</style>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "linear-gradient(135deg, #1A3F7A 0%, #2563b0 100%)",
          boxShadow: "0 2px 16px rgba(26,63,122,0.18)",
          height: "64px",
          display: "flex",
          alignItems: "center",
          padding: "0 32px",
          gap: "8px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginRight: "24px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "1.5px solid rgba(255,255,255,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "14px",
                color: "white",
                lineHeight: 1.1,
              }}
            >
              FAST Peshawar
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.05em",
              }}
            >
              Lost & Found
            </div>
          </div>
        </div>

        {/* Nav links */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}
        >
          <button
            className={`nav-link${currentPage === "items" ? " active" : ""}`}
            onClick={() => onNavigate("items")}
          >
            🏠 Items
          </button>

          {(isAdmin || isStaff) && (
            <button
              className={`nav-link${currentPage === "register" ? " active" : ""}`}
              onClick={() => onNavigate("register")}
            >
              + Register Item
            </button>
          )}

          {isAdmin && (
            <button
              className={`nav-link${currentPage === "admin" ? " active" : ""}`}
              onClick={() => onNavigate("admin")}
            >
              🛡 Admin
            </button>
          )}

          {isAdmin && (
            <button
              className={`nav-link${currentPage === "receipt" ? " active" : ""}`}
              onClick={() => onNavigate("receipt")}
            >
              📋 Receipts
            </button>
          )}

          {isStudent && (
            <button
              className={`nav-link${currentPage === "myclaims" ? " active" : ""}`}
              onClick={() => onNavigate("myclaims")}
            >
              📁 My Claims
            </button>
          )}

          {isStudent && (
            <button
              className={`nav-link${currentPage === "notifications" ? " active" : ""}`}
              onClick={() => onNavigate("notifications")}
              style={{ position: "relative" }}
            >
              🔔 Notifications
              {unread > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    background: "#ea4335",
                    color: "white",
                    borderRadius: "50%",
                    width: "16px",
                    height: "16px",
                    fontSize: "10px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {unread}
                </span>
              )}
            </button>
          )}
        </div>

        {/* User info + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "white" }}>
              {user.name}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.6)",
                textTransform: "capitalize",
              }}
            >
              {user.role}
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}
