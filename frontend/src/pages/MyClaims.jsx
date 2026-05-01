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

  const getStatusPillStyle = (status) => {
    if (status === "approved") return { ...s.pill, ...s.pillApproved };
    if (status === "rejected") return { ...s.pill, ...s.pillRejected };
    return { ...s.pill, ...s.pillPending };
  };

  const pendingCount = claims.filter((c) => c.status === "pending").length;
  const approvedCount = claims.filter((c) => c.status === "approved").length;
  const rejectedCount = claims.filter((c) => c.status === "rejected").length;

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
            <h2 style={s.pageTitle}>My Claims</h2>
            <p style={s.pageSub}>Track all your submitted item claims</p>
          </div>
          <span style={s.adminBadge}>{user.name}</span>
        </div>

        {/* Stats */}
        {!loading && claims.length > 0 && (
          <div style={s.statsRow}>
            {[
              { val: claims.length, lbl: "Total claims" },
              { val: pendingCount, lbl: "Pending", warn: pendingCount > 0 },
              { val: approvedCount, lbl: "Approved" },
              { val: rejectedCount, lbl: "Rejected" },
            ].map(({ val, lbl, warn }) => (
              <div key={lbl} style={s.statCard}>
                <div style={{ ...s.statVal, ...(warn ? s.statWarn : {}) }}>
                  {val}
                </div>
                <div style={s.statLbl}>{lbl}</div>
              </div>
            ))}
          </div>
        )}

        {/* Section label */}
        {!loading && claims.length > 0 && (
          <p style={s.sectionLbl}>All claims</p>
        )}

        {/* Loading */}
        {loading && <p style={s.empty}>Loading...</p>}

        {/* Empty state */}
        {!loading && claims.length === 0 && (
          <div style={s.emptyBox}>
            <div style={s.emptyIcon}>📭</div>
            <p style={s.emptyTitle}>No claims yet</p>
            <p style={s.emptySub}>
              Browse items and click "Claim This" to submit one.
            </p>
          </div>
        )}

        {/* Claims list */}
        {!loading && claims.length > 0 && (
          <div style={s.list}>
            {claims.map((claim) => (
              <div key={claim.claim_id} style={s.card}>
                <div style={s.cardTop}>
                  <div>
                    <p style={s.cardItemTag}>Item</p>
                    <h3 style={s.cardItemName}>{claim.title}</h3>
                    <p style={s.cardMeta}>📍 {claim.location_found}</p>
                    <p style={s.cardMeta}>
                      🕐 Submitted:{" "}
                      {new Date(claim.submitted_at).toLocaleString()}
                    </p>
                  </div>
                  <span style={getStatusPillStyle(claim.status)}>
                    {claim.status.charAt(0).toUpperCase() +
                      claim.status.slice(1)}
                  </span>
                </div>

                <div style={s.divider} />

                <div style={s.proofBox}>
                  <p style={s.proofLabel}>Your ownership proof</p>
                  <p style={s.proofText}>"{claim.claim_description}"</p>
                </div>

                {claim.status === "approved" && (
                  <div style={s.noteApproved}>
                    Your claim was approved — visit Student Affairs to collect
                    your item.
                  </div>
                )}
                {claim.status === "rejected" && (
                  <div style={s.noteRejected}>
                    Your claim was not approved. Contact Student Affairs for
                    more information.
                  </div>
                )}
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
  list: { display: "flex", flexDirection: "column", gap: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    border: "0.5px solid #c8d8f0",
    padding: "18px 20px",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardItemTag: {
    fontSize: 10,
    color: "#6b7a99",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 4,
  },
  cardItemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  cardMeta: { fontSize: 11, color: "#9aa5be", marginBottom: 2 },
  pill: {
    padding: "3px 12px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: "500",
    whiteSpace: "nowrap",
  },
  pillPending: { backgroundColor: "#faeeda", color: "#633806" },
  pillApproved: { backgroundColor: "#e6f4ea", color: "#27500a" },
  pillRejected: { backgroundColor: "#fcebeb", color: "#a32d2d" },
  divider: { height: "0.5px", backgroundColor: "#eef2f9", margin: "12px 0" },
  proofBox: {
    backgroundColor: "#f8faff",
    borderRadius: 7,
    padding: 12,
    marginBottom: 12,
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
    margin: 0,
  },
  noteApproved: {
    backgroundColor: "#e6f4ea",
    color: "#27500a",
    padding: "10px 14px",
    borderRadius: 7,
    fontSize: 12,
  },
  noteRejected: {
    backgroundColor: "#fcebeb",
    color: "#a32d2d",
    padding: "10px 14px",
    borderRadius: 7,
    fontSize: 12,
  },
};
