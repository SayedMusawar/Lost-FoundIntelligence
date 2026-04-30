import { useEffect, useState } from "react";
import { getPendingClaims, reviewClaim } from "../api/client";

export default function AdminDashboard({ user, onBack, onReceipt, onLogout }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");

  const fetchClaims = async () => {
    setLoading(true);
    const res = await getPendingClaims();
    setClaims(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleReview = async (claimId, action) => {
    try {
      await reviewClaim(claimId, action, user.user_id);
      setActionMsg(`Claim ${action} successfully`);
      fetchClaims();
      setTimeout(() => setActionMsg(""), 3000);
    } catch (err) {
      setActionMsg(err.response?.data?.detail || "Action failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button style={styles.backBtn} onClick={onBack}>
              ← Back
            </button>
            <button style={styles.receiptNavBtn} onClick={onReceipt}>
              📋 Issue Receipts
            </button>
            <button style={styles.logoutBtn} onClick={onLogout}>
              🚪 Logout
            </button>
          </div>
          <h2 style={styles.title}>Admin Dashboard — Pending Claims</h2>
        </div>
        <span style={styles.adminBadge}>👤 {user.name}</span>
      </div>
      {actionMsg && <div style={styles.toast}>{actionMsg}</div>}
      {loading ? (
        <p style={styles.empty}>Loading...</p>
      ) : claims.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyIcon}>✅</p>
          <p style={styles.emptyText}>No pending claims. All caught up!</p>
        </div>
      ) : (
        <div style={styles.list}>
          {claims.map((claim) => (
            <div key={claim.claim_id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <span style={styles.itemTag}>Item</span>
                  <h3 style={styles.itemTitle}>{claim.title}</h3>
                  <p style={styles.itemMeta}>📍 {claim.location_found}</p>
                </div>
                <span style={styles.pendingBadge}>Pending</span>
              </div>
              <div style={styles.divider} />
              <div style={styles.claimantSection}>
                <p style={styles.sectionLabel}>Claimant</p>
                <p style={styles.claimantName}>👤 {claim.claimant_name}</p>
                <p style={styles.claimantMeta}>✉️ {claim.claimant_email}</p>
                {claim.roll_number && (
                  <p style={styles.claimantMeta}>
                    🎓 Roll No: {claim.roll_number}
                  </p>
                )}
                <p style={styles.claimantMeta}>
                  🕐 Submitted: {new Date(claim.submitted_at).toLocaleString()}
                </p>
              </div>
              <div style={styles.descSection}>
                <p style={styles.sectionLabel}>Ownership Proof</p>
                <p style={styles.descText}>"{claim.claim_description}"</p>
              </div>
              <div style={styles.actions}>
                <button
                  style={styles.approveBtn}
                  onClick={() => handleReview(claim.claim_id, "approved")}
                >
                  ✅ Approve
                </button>
                <button
                  style={styles.rejectBtn}
                  onClick={() => handleReview(claim.claim_id, "rejected")}
                >
                  ❌ Reject
                </button>
              </div>
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
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "28px",
  },
  title: { margin: "8px 0 0", color: "#1a1a2e", fontSize: "22px" },
  backBtn: {
    background: "none",
    border: "1px solid #ddd",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    color: "#555",
  },
  adminBadge: {
    fontSize: "14px",
    color: "#555",
    backgroundColor: "white",
    padding: "8px 14px",
    borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  toast: {
    backgroundColor: "#e6f4ea",
    color: "#2d7a3a",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  emptyBox: { textAlign: "center", marginTop: "80px" },
  emptyIcon: { fontSize: "48px", margin: "0 0 12px" },
  emptyText: { color: "#888", fontSize: "16px" },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    maxWidth: "720px",
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
  },
  itemTag: {
    fontSize: "11px",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  itemTitle: { margin: "4px 0 4px", color: "#1a1a2e", fontSize: "18px" },
  itemMeta: { margin: 0, color: "#666", fontSize: "13px" },
  pendingBadge: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  divider: { height: "1px", backgroundColor: "#f0f0f0", margin: "16px 0" },
  claimantSection: { marginBottom: "16px" },
  sectionLabel: {
    fontSize: "11px",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "0 0 8px",
  },
  claimantName: { margin: "0 0 4px", fontWeight: "600", color: "#1a1a2e" },
  claimantMeta: { margin: "3px 0", color: "#666", fontSize: "13px" },
  descSection: {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "14px",
    marginBottom: "20px",
  },
  descText: {
    margin: 0,
    color: "#444",
    fontSize: "14px",
    lineHeight: "1.6",
    fontStyle: "italic",
  },
  actions: { display: "flex", gap: "12px" },
  approveBtn: {
    flex: 1,
    padding: "11px",
    backgroundColor: "#34a853",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
  },
  rejectBtn: {
    flex: 1,
    padding: "11px",
    backgroundColor: "#ea4335",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
  },
  receiptNavBtn: {
    padding: "6px 14px",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  logoutBtn: {
    padding: "6px 14px",
    backgroundColor: "white",
    color: "#ea4335",
    border: "1px solid #ea4335",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  empty: { color: "#888", textAlign: "center" },
};
