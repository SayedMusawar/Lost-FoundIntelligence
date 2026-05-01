import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../api/client";

export default function Notifications({ user, onBack }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications(user.user_id).then((res) => {
      setNotifications(res.data);
      setLoading(false);
    });
  }, []);

  const handleMarkRead = async (notificationId) => {
    await markNotificationRead(notificationId);
    setNotifications((prev) =>
      prev.map((n) =>
        n.notification_id === notificationId ? { ...n, is_read: true } : n,
      ),
    );
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead(user.user_id);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getRelativeTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    if (days === 1) return "Yesterday";
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div style={s.page}>
      {/* ── Navbar ── */}
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <div style={s.nuCircle}>
            <span style={s.nuText}>NU</span>
          </div>
          <div style={s.navDiv} />
          <span style={s.brand}>I-FAST</span>
          <span style={s.navSub}>Lost &amp; Found Portal</span>
        </div>
        <div style={s.navRight}>
          <span style={s.userLabel}>
            {user.name} ({user.role})
          </span>
          {unreadCount > 0 && (
            <button style={s.markAllBtn} onClick={handleMarkAllRead}>
              Mark all read
            </button>
          )}
          <button style={s.backBtn} onClick={onBack}>
            ← Back to Items
          </button>
        </div>
      </nav>

      {/* ── Body ── */}
      <div style={s.body}>
        {/* Page header */}
        <div style={s.pageHead}>
          <div>
            <h2 style={s.pageTitle}>Notifications</h2>
            <p style={s.pageSub}>Updates on your claims and activity</p>
          </div>
          {!loading && (
            <span style={unreadCount > 0 ? s.unreadBadge : s.adminBadge}>
              {unreadCount > 0 ? `${unreadCount} unread` : "All read"}
            </span>
          )}
        </div>

        {/* Section label */}
        {!loading && notifications.length > 0 && (
          <p style={s.sectionLbl}>All notifications</p>
        )}

        {/* Loading */}
        {loading && <p style={s.empty}>Loading...</p>}

        {/* Empty state */}
        {!loading && notifications.length === 0 && (
          <div style={s.emptyBox}>
            <div style={s.emptyIcon}>🔔</div>
            <p style={s.emptyTitle}>No notifications yet</p>
            <p style={s.emptySub}>
              You'll be notified here when your claims are reviewed.
            </p>
          </div>
        )}

        {/* Notifications list */}
        {!loading && notifications.length > 0 && (
          <div style={s.list}>
            {notifications.map((n) => (
              <div
                key={n.notification_id}
                style={n.is_read ? s.cardRead : s.cardUnread}
              >
                <div style={s.notifRow}>
                  <div style={n.is_read ? s.dotRead : s.dotUnread} />
                  <div style={{ flex: 1 }}>
                    <p style={n.is_read ? s.msgRead : s.msgUnread}>
                      {n.message}
                    </p>
                    <p style={s.time}>{getRelativeTime(n.created_at)}</p>
                    {!n.is_read && (
                      <div style={s.actions}>
                        <button
                          style={s.markReadBtn}
                          onClick={() => handleMarkRead(n.notification_id)}
                        >
                          Mark as read
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { backgroundColor: "#eef2f9", minHeight: "100vh" },
  nav: {
    backgroundColor: "#0c2d6b",
    padding: "10px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navLeft: { display: "flex", alignItems: "center", gap: 10 },
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
  navDiv: { width: 1, height: 26, backgroundColor: "rgba(255,255,255,0.2)" },
  brand: { color: "#fff", fontSize: 14, fontWeight: "500", letterSpacing: 1 },
  navSub: { color: "rgba(255,255,255,0.45)", fontSize: 11, marginLeft: 2 },
  navRight: { display: "flex", alignItems: "center", gap: 10 },
  userLabel: { color: "rgba(255,255,255,0.6)", fontSize: 11 },
  markAllBtn: {
    padding: "5px 12px",
    borderRadius: 6,
    fontSize: 11,
    background: "#1a9e75",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  backBtn: {
    padding: "5px 14px",
    borderRadius: 6,
    fontSize: 11,
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  body: { padding: 24 },
  pageHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  pageTitle: { fontSize: 18, fontWeight: "500", color: "#0c2d6b", margin: 0 },
  pageSub: { fontSize: 12, color: "#9aa5be", marginTop: 2, marginBottom: 0 },
  adminBadge: {
    backgroundColor: "#e6edf9",
    color: "#0c2d6b",
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "500",
  },
  unreadBadge: {
    backgroundColor: "#faeeda",
    color: "#633806",
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "500",
  },
  sectionLbl: {
    fontSize: 11,
    fontWeight: "500",
    color: "#4a5878",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  empty: { color: "#9aa5be", textAlign: "center", marginTop: 60 },
  emptyBox: { textAlign: "center", marginTop: 80 },
  emptyIcon: { fontSize: 36, marginBottom: 10 },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0c2d6b",
    marginBottom: 4,
  },
  emptySub: { fontSize: 13, color: "#9aa5be" },
  list: { display: "flex", flexDirection: "column", gap: 10 },
  cardUnread: {
    backgroundColor: "#f0f4ff",
    borderRadius: "0 10px 10px 0",
    border: "0.5px solid #c8d8f0",
    borderLeft: "3px solid #0c2d6b",
    padding: "14px 18px",
  },
  cardRead: {
    backgroundColor: "#fff",
    borderRadius: 10,
    border: "0.5px solid #c8d8f0",
    padding: "14px 18px",
    opacity: 0.75,
  },
  notifRow: { display: "flex", gap: 12, alignItems: "flex-start" },
  dotUnread: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "#0c2d6b",
    flexShrink: 0,
    marginTop: 4,
  },
  dotRead: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "#c8d8f0",
    flexShrink: 0,
    marginTop: 4,
  },
  msgUnread: {
    fontSize: 13,
    color: "#1a1a2e",
    lineHeight: 1.6,
    marginBottom: 4,
  },
  msgRead: { fontSize: 13, color: "#6b7a99", lineHeight: 1.6, marginBottom: 4 },
  time: { fontSize: 11, color: "#9aa5be" },
  actions: { display: "flex", justifyContent: "flex-end", marginTop: 8 },
  markReadBtn: {
    padding: "4px 12px",
    backgroundColor: "#0c2d6b",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 11,
    cursor: "pointer",
  },
};
