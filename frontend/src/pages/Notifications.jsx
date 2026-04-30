import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../api/client";

export default function Notifications({ user, onBack }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    const res = await getNotifications(user.user_id);
    setNotifications(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n)),
    );
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead(user.user_id);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          ← Back
        </button>
        <h2 style={styles.title}>
          Notifications
          {unreadCount > 0 && (
            <span style={styles.unreadBadge}>{unreadCount}</span>
          )}
        </h2>
        {unreadCount > 0 && (
          <button style={styles.markAllBtn} onClick={handleMarkAllRead}>
            Mark all as read
          </button>
        )}
      </div>
      {loading ? (
        <p style={styles.empty}>Loading...</p>
      ) : notifications.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyIcon}>🔔</p>
          <p style={styles.emptyText}>No notifications yet.</p>
        </div>
      ) : (
        <div style={styles.list}>
          {notifications.map((n) => (
            <div
              key={n.notification_id}
              style={{
                ...styles.card,
                ...(n.is_read ? styles.cardRead : styles.cardUnread),
              }}
            >
              <div style={styles.cardContent}>
                <p style={styles.message}>{n.message}</p>
                <p style={styles.time}>
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>
              {!n.is_read && (
                <button
                  style={styles.readBtn}
                  onClick={() => handleMarkRead(n.notification_id)}
                >
                  ✓
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "32px",
    backgroundColor: "#f0f2f5",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "28px",
  },
  title: {
    margin: 0,
    color: "#1a1a2e",
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  backBtn: {
    background: "none",
    border: "1px solid #ddd",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    color: "#555",
  },
  unreadBadge: {
    backgroundColor: "#ea4335",
    color: "white",
    borderRadius: "20px",
    padding: "2px 10px",
    fontSize: "13px",
    fontWeight: "600",
  },
  markAllBtn: {
    padding: "6px 14px",
    backgroundColor: "white",
    color: "#1a73e8",
    border: "1px solid #1a73e8",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  emptyBox: { textAlign: "center", marginTop: "80px" },
  emptyIcon: { fontSize: "48px", margin: "0 0 12px" },
  emptyText: { color: "#888", fontSize: "16px" },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "680px",
    margin: "0 auto",
  },
  card: {
    borderRadius: "10px",
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },
  cardUnread: {
    backgroundColor: "white",
    boxShadow: "0 1px 8px rgba(0,0,0,0.1)",
    borderLeft: "4px solid #1a73e8",
  },
  cardRead: {
    backgroundColor: "#f8f9fa",
    boxShadow: "none",
    borderLeft: "4px solid #ddd",
  },
  cardContent: { flex: 1 },
  message: {
    margin: "0 0 6px",
    color: "#1a1a2e",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  time: { margin: 0, color: "#888", fontSize: "12px" },
  readBtn: {
    padding: "6px 12px",
    backgroundColor: "#e6f4ea",
    color: "#2d7a3a",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
};
