import { useEffect, useState } from "react";
import { getPendingClaims, reviewClaim } from "../api/client";

export default function AdminDashboard({ user, onBack, onReceipt, onLogout }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");
  const [actionType, setActionType] = useState("success"); // "success" | "error"

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
      setActionMsg(
        `Claim ${action} successfully — notification sent to student.`,
      );
      setActionType("success");
      fetchClaims();
    } catch (err) {
      setActionMsg(err.response?.data?.detail || "Action failed. Try again.");
      setActionType("error");
    } finally {
      setTimeout(() => setActionMsg(""), 4000);
    }
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
          <button style={s.nbGreen} onClick={onReceipt}>
            Issue Receipts
          </button>
          <button style={s.nbGhost} onClick={onBack}>
            ← Back
          </button>
          <button style={s.nbOutline} onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* ── Body ── */}
      <div style={s.body}>
        {/* Page header */}
        <div style={s.pageHead}>
          <div>
            <h2 style={s.pageTitle}>Admin Dashboard</h2>
            <p style={s.pageSub}>Review and manage pending claim requests</p>
          </div>
          <span style={s.adminBadge}>Admin: {user.name}</span>
        </div>

        {/* Toast */}
        {actionMsg && (
          <div
            style={{
              ...s.toast,
              ...(actionType === "error" ? s.toastError : {}),
            }}
          >
            {actionType === "success" ? "✓" : "⚠"} {actionMsg}
          </div>
        )}

        {/* Stats */}
        <div style={s.statsRow}>
          {[
            { val: claims.length, lbl: "Pending claims", warn: true },
            { val: "—", lbl: "Total items" },
            { val: "—", lbl: "Resolved" },
            { val: "—", lbl: "Added today" },
          ].map(({ val, lbl, warn }) => (
            <div key={lbl} style={s.statCard}>
              <div style={{ ...s.statVal, ...(warn ? s.statWarn : {}) }}>
                {val}
              </div>
              <div style={s.statLbl}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Section label */}
        <p style={s.sectionLbl}>Pending claims</p>

        {/* Loading */}
        {loading && <p style={s.empty}>Loading...</p>}

        {/* Empty state */}
        {!loading && claims.length === 0 && (
          <div style={s.emptyBox}>
            <div style={s.emptyIcon}>✓</div>
            <p style={s.emptyTitle}>All caught up!</p>
            <p style={s.emptySub}>No pending claims at the moment.</p>
          </div>
        )}

        {/* Claims list */}
        {!loading && claims.length > 0 && (
          <div style={s.claimsList}>
            {claims.map((claim) => (
              <div key={claim.claim_id} style={s.claimCard}>
                {/* Top row */}
                <div style={s.claimTop}>
                  <div>
                    <p style={s.claimItemTag}>Item</p>
                    <h3 style={s.claimItemName}>{claim.title}</h3>
                    <p style={s.claimLocation}>📍 {claim.location_found}</p>
                  </div>
                  <span style={s.pendingBadge}>Pending</span>
                </div>

                <div style={s.divider} />

                {/* Claimant details */}
                <div style={s.claimantGrid}>
                  <div style={s.clField}>
                    <div style={s.clLabel}>Claimant</div>
                    <div style={s.clVal}>{claim.claimant_name}</div>
                  </div>
                  <div style={s.clField}>
                    <div style={s.clLabel}>Roll No</div>
                    <div style={s.clVal}>{claim.roll_number || "—"}</div>
                  </div>
                  <div style={s.clField}>
                    <div style={s.clLabel}>Email</div>
                    <div style={s.clVal}>{claim.claimant_email}</div>
                  </div>
                  <div style={s.clField}>
                    <div style={s.clLabel}>Submitted</div>
                    <div style={s.clVal}>
                      {new Date(claim.submitted_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Proof */}
                <div style={s.proofBox}>
                  <p style={s.proofLabel}>Ownership proof</p>
                  <p style={s.proofText}>"{claim.claim_description}"</p>
                </div>

                {/* Actions */}
                <div style={s.actions}>
                  <button
                    style={s.btnApprove}
                    onClick={() => handleReview(claim.claim_id, "approved")}
                  >
                    ✓ Approve
                  </button>
                  <button
                    style={s.btnReject}
                    onClick={() => handleReview(claim.claim_id, "rejected")}
                  >
                    ✕ Reject
                  </button>
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
  navRight: { display: "flex", alignItems: "center", gap: 8 },
  nbGhost: {
    padding: "5px 12px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: "500",
    cursor: "pointer",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "none",
  },
  nbGreen: {
    padding: "5px 12px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: "500",
    cursor: "pointer",
    background: "#1a9e75",
    color: "#fff",
    border: "none",
  },
  nbOutline: {
    padding: "5px 12px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: "500",
    cursor: "pointer",
    background: "transparent",
    color: "#f0a07a",
    border: "0.5px solid #f0a07a",
  },
  body: { padding: 24 },
  pageHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  pageTitle: { fontSize: 18, fontWeight: "500", color: "#0c2d6b" },
  pageSub: { fontSize: 12, color: "#9aa5be", marginTop: 2 },
  adminBadge: {
    backgroundColor: "#e6edf9",
    color: "#0c2d6b",
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "500",
  },
  toast: {
    backgroundColor: "#e6f4ea",
    color: "#27500a",
    padding: "10px 16px",
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 16,
    border: "0.5px solid #c0ddb0",
  },
  toastError: {
    backgroundColor: "#fcebeb",
    color: "#a32d2d",
    border: "0.5px solid #f0c0c0",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    border: "0.5px solid #c8d8f0",
    padding: "12px 14px",
  },
  statVal: { fontSize: 22, fontWeight: "500", color: "#0c2d6b" },
  statWarn: { color: "#854f0b" },
  statLbl: { fontSize: 11, color: "#6b7a99", marginTop: 2 },
  sectionLbl: {
    fontSize: 11,
    fontWeight: "500",
    color: "#4a5878",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  empty: { color: "#9aa5be", textAlign: "center", marginTop: 40 },
  emptyBox: { textAlign: "center", marginTop: 80 },
  emptyIcon: { fontSize: 36, color: "#1a9e75", marginBottom: 10 },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0c2d6b",
    marginBottom: 4,
  },
  emptySub: { fontSize: 13, color: "#9aa5be" },
  claimsList: { display: "flex", flexDirection: "column", gap: 12 },
  claimCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    border: "0.5px solid #c8d8f0",
    padding: "18px 20px",
  },
  claimTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  claimItemTag: {
    fontSize: 10,
    color: "#6b7a99",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 4,
  },
  claimItemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a2e",
    marginBottom: 3,
  },
  claimLocation: { fontSize: 11, color: "#9aa5be" },
  pendingBadge: {
    backgroundColor: "#faeeda",
    color: "#633806",
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 10,
    fontWeight: "500",
  },
  divider: { height: "0.5px", backgroundColor: "#eef2f9", margin: "12px 0" },
  claimantGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginBottom: 12,
  },
  clField: { fontSize: 11 },
  clLabel: { color: "#9aa5be", marginBottom: 2 },
  clVal: { color: "#1a1a2e", fontWeight: "500" },
  proofBox: {
    backgroundColor: "#f8faff",
    borderRadius: 7,
    padding: 12,
    marginBottom: 14,
    border: "0.5px solid #e0e8f4",
  },
  proofLabel: {
    fontSize: 10,
    color: "#6b7a99",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 6,
    fontWeight: "500",
  },
  proofText: {
    fontSize: 12,
    color: "#4a5878",
    lineHeight: 1.6,
    fontStyle: "italic",
  },
  actions: { display: "flex", gap: 10 },
  btnApprove: {
    flex: 1,
    padding: 9,
    backgroundColor: "#0c2d6b",
    color: "#fff",
    border: "none",
    borderRadius: 7,
    fontSize: 12,
    fontWeight: "500",
    cursor: "pointer",
  },
  btnReject: {
    flex: 1,
    padding: 9,
    backgroundColor: "#fff",
    color: "#a32d2d",
    border: "0.5px solid #a32d2d",
    borderRadius: 7,
    fontSize: 12,
    fontWeight: "500",
    cursor: "pointer",
  },
};
