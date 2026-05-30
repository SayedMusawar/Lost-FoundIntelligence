import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../api/client";
import { c, g } from "../theme";

const relTime = (d) => {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000),
    h = Math.floor(diff / 3600000),
    days = Math.floor(diff / 86400000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (days === 1) return "Yesterday";
  return new Date(d).toLocaleDateString();
};

export default function Notifications({ user }) {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications(user.user_id).then((r) => {
      setNotifs(r.data);
      setLoading(false);
    });
  }, []);

  const markRead = async (id) => {
    await markNotificationRead(id);
    setNotifs((p) =>
      p.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n)),
    );
  };

  const markAll = async () => {
    await markAllNotificationsRead(user.user_id);
    setNotifs((p) => p.map((n) => ({ ...n, is_read: true })));
  };

  const unread = notifs.filter((n) => !n.is_read).length;

  return (
    <div className="fade-up">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 14,
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: c.fh,
              fontSize: 26,
              fontWeight: 700,
              color: c.text,
              marginBottom: 6,
            }}
          >
            Notifications
          </h1>
          <p style={{ fontSize: 13, color: c.text2 }}>
            Updates on your claims and campus activity
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAll}
            style={{
              padding: "9px 18px",
              background: "rgba(0,229,176,0.10)",
              border: `1px solid rgba(0,229,176,0.22)`,
              borderRadius: 8,
              color: c.teal,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Mark all read ({unread})
          </button>
        )}
      </div>

      {loading && (
        <div style={g.empty}>
          <div
            style={{
              width: 36,
              height: 36,
              border: `3px solid ${c.teal}`,
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
        </div>
      )}

      {!loading && notifs.length === 0 && (
        <div style={g.empty}>
          <span style={g.emptyIcon}>🔔</span>
          <p style={g.emptyTitle}>No notifications yet</p>
          <p style={g.emptySub}>
            You'll be notified here when your claims are reviewed.
          </p>
        </div>
      )}

      {!loading && notifs.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notifs.map((n, i) => (
            <div
              key={n.notification_id}
              className="fade-up"
              style={{
                background: n.is_read ? c.surface : "rgba(0,229,176,0.05)",
                borderRadius: 12,
                border: n.is_read
                  ? `1px solid ${c.border}`
                  : `1px solid rgba(0,229,176,0.15)`,
                borderLeft: n.is_read
                  ? `1px solid ${c.border}`
                  : `3px solid ${c.teal}`,
                padding: "16px 20px",
                opacity: n.is_read ? 0.65 : 1,
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                animationDelay: `${i * 0.04}s`,
                transition: "opacity 0.2s",
              }}
            >
              {/* Dot */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: n.is_read ? c.text3 : c.teal,
                  flexShrink: 0,
                  marginTop: 5,
                  boxShadow: n.is_read ? "none" : `0 0 8px ${c.teal}`,
                }}
              />

              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: 13,
                    color: n.is_read ? c.text2 : c.text,
                    lineHeight: 1.6,
                    marginBottom: 6,
                  }}
                >
                  {n.message}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 11, color: c.text3 }}>
                    {relTime(n.created_at)}
                  </span>
                  {!n.is_read && (
                    <button
                      onClick={() => markRead(n.notification_id)}
                      style={{
                        padding: "2px 10px",
                        background: "rgba(0,229,176,0.08)",
                        border: `1px solid rgba(0,229,176,0.18)`,
                        borderRadius: 99,
                        color: c.teal,
                        fontSize: 10,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
