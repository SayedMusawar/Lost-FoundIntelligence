import { useEffect, useState } from "react";
import { getMyClaims } from "../api/client";

export default function MyClaims({ user, onBack }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyClaims(user.user_id).then((res) => {
      setClaims(res.data);
      setLoading(false);
    });
  }, []);

  const getStatusStyle = (status) => {
    if (status === "approved") return styles.badgeApproved;
    if (status === "rejected") return styles.badgeRejected;
    return styles.badgePending;
  };

  const getStatusIcon = (status) => {
    if (status === "approved") return "✅";
    if (status === "rejected") return "❌";
    return "⏳";
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          ← Back
        </button>
        <h2 style={styles.title}>My Claims</h2>
        <span style={styles.userBadge}>👤 {user.name}</span>
      </div>
      {loading ? (
        <p style={styles.empty}>Loading...</p>
      ) : claims.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyIcon}>📭</p>
          <p style={styles.emptyText}>You haven't submitted any claims yet.</p>
          <p style={styles.emptyHint}>
            Browse items and click "Claim This" to submit one.
          </p>
        </div>
      ) : (
        <div style={styles.list}>
          {claims.map((claim) => (
            <div key={claim.claim_id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <h3 style={styles.itemTitle}>{claim.title}</h3>
                  <p style={styles.itemMeta}>📍 {claim.location_found}</p>
                  <p style={styles.itemMeta}>
                    🕐 Submitted:{" "}
                    {new Date(claim.submitted_at).toLocaleString()}
                  </p>
                </div>
                <span style={getStatusStyle(claim.status)}>
                  {getStatusIcon(claim.status)} {claim.status.toUpperCase()}
                </span>
              </div>
              <div style={styles.descSection}>
                <p style={styles.descLabel}>Your claim description</p>
                <p style={styles.descText}>"{claim.claim_description}"</p>
              </div>
              {claim.status === "approved" && (
                <div style={styles.approvedNote}>
                  🎉 Your claim was approved! Visit Student Affairs to collect
                  your item.
                </div>
              )}
              {claim.status === "rejected" && (
                <div style={styles.rejectedNote}>
                  Your claim was not approved. Contact Student Affairs for more
                  information.
                </div>
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
  title: { margin: 0, color: "#1a1a2e", flex: 1 },
  backBtn: {
    background: "none",
    border: "1px solid #ddd",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    color: "#555",
  },
  userBadge: {
    fontSize: "14px",
    color: "#555",
    backgroundColor: "white",
    padding: "8px 14px",
    borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  empty: { color: "#888", textAlign: "center", marginTop: "60px" },
  emptyBox: { textAlign: "center", marginTop: "80px" },
  emptyIcon: { fontSize: "48px", margin: "0 0 12px" },
  emptyText: { color: "#555", fontSize: "16px", margin: "0 0 8px" },
  emptyHint: { color: "#888", fontSize: "14px" },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    maxWidth: "680px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  itemTitle: { margin: "0 0 6px", color: "#1a1a2e", fontSize: "18px" },
  itemMeta: { margin: "3px 0", color: "#666", fontSize: "13px" },
  badgePending: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  badgeApproved: {
    backgroundColor: "#e6f4ea",
    color: "#2d7a3a",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  badgeRejected: {
    backgroundColor: "#fdecea",
    color: "#c0392b",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  descSection: {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "14px",
    marginBottom: "12px",
  },
  descLabel: {
    fontSize: "11px",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "0 0 6px",
  },
  descText: {
    margin: 0,
    color: "#444",
    fontSize: "14px",
    lineHeight: "1.6",
    fontStyle: "italic",
  },
  approvedNote: {
    backgroundColor: "#e6f4ea",
    color: "#2d7a3a",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "13px",
  },
  rejectedNote: {
    backgroundColor: "#fdecea",
    color: "#c0392b",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "13px",
  },
};
