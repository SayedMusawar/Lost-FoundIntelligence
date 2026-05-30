import { useEffect, useState } from "react";
import { getPendingClaims, reviewClaim } from "../api/client";
import { c, tr, g } from "../theme";

export default function AdminDashboard({ user, onReceipt }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchClaims = async () => {
    setLoading(true);
    const r = await getPendingClaims();
    setClaims(r.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleReview = async (claimId, action) => {
    try {
      await reviewClaim(claimId, action, user.user_id);
      setToast({
        msg: `Claim ${action} — notification sent.`,
        type: "success",
      });
      fetchClaims();
    } catch (err) {
      setToast({
        msg: err.response?.data?.detail || "Action failed.",
        type: "error",
      });
    } finally {
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <div className="fade-up">
      {/* Header */}
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
            Admin Dashboard
          </h1>
          <p style={{ fontSize: 13, color: c.text2 }}>
            Review and manage pending claim requests
          </p>
        </div>
        <button
          onClick={onReceipt}
          style={{
            padding: "10px 20px",
            background: "rgba(0,229,176,0.10)",
            border: `1px solid rgba(0,229,176,0.22)`,
            borderRadius: 9,
            color: c.teal,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: c.fh,
            transition: tr,
          }}
        >
          📋 Issue Receipts
        </button>
      </div>

      {/* Stats */}
      <div style={g.statsRow}>
        {[
          {
            val: claims.length,
            lbl: "Pending Claims",
            accent: claims.length > 0 ? c.amber : c.teal,
          },
          { val: "—", lbl: "Total Items", accent: c.blue },
          { val: "—", lbl: "Resolved Today", accent: c.green },
          { val: "—", lbl: "This Month", accent: c.text2 },
        ].map(({ val, lbl, accent }) => (
          <div key={lbl} style={g.statCard(accent)}>
            <div
              style={{
                ...g.statVal,
                color:
                  accent === c.amber && claims.length > 0 ? c.amber : c.text,
              }}
            >
              {val}
            </div>
            <div style={g.statLbl}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div style={g.alert(toast.type)}>
          {toast.type === "success" ? "✓" : "⚠"} {toast.msg}
        </div>
      )}

      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: c.text3,
          letterSpacing: "1.2px",
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        Pending Claims ({claims.length})
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
          <p style={g.emptySub}>Loading claims…</p>
        </div>
      )}

      {!loading && claims.length === 0 && (
        <div style={g.empty}>
          <span style={g.emptyIcon}>✅</span>
          <p style={g.emptyTitle}>All caught up!</p>
          <p style={g.emptySub}>No pending claims right now.</p>
        </div>
      )}

      {!loading && claims.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {claims.map((claim, i) => (
            <div
              key={claim.claim_id}
              className="fade-up"
              style={{
                ...g.card,
                borderRadius: 14,
                animationDelay: `${i * 0.05}s`,
              }}
            >
              {/* Top */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: c.text3,
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                      marginBottom: 6,
                    }}
                  >
                    Item
                  </div>
                  <h3
                    style={{
                      fontFamily: c.fh,
                      fontSize: 16,
                      fontWeight: 700,
                      color: c.text,
                      marginBottom: 4,
                    }}
                  >
                    {claim.title}
                  </h3>
                  <p style={{ fontSize: 12, color: c.text2 }}>
                    📍 {claim.location_found}
                  </p>
                </div>
                <span style={g.badge("rgba(245,166,35,0.12)", c.amber)}>
                  ⏳ Pending Review
                </span>
              </div>

              <div style={g.divider} />

              {/* Claimant info grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                {[
                  { k: "Claimant", v: claim.claimant_name },
                  { k: "Roll No", v: claim.roll_number || "—" },
                  { k: "Email", v: claim.claimant_email },
                  {
                    k: "Submitted",
                    v: new Date(claim.submitted_at).toLocaleString("en-PK", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }),
                  },
                ].map(({ k, v }) => (
                  <div key={k}>
                    <div
                      style={{ fontSize: 10, color: c.text3, marginBottom: 4 }}
                    >
                      {k}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: c.text,
                        fontWeight: 500,
                        wordBreak: "break-all",
                      }}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>

              {/* Proof */}
              <div
                style={{
                  background: c.bg3,
                  borderRadius: 8,
                  border: `1px solid ${c.border}`,
                  padding: "12px 16px",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: c.text3,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    marginBottom: 8,
                  }}
                >
                  Ownership Proof
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: c.text2,
                    lineHeight: 1.65,
                    fontStyle: "italic",
                  }}
                >
                  "{claim.claim_description}"
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => handleReview(claim.claim_id, "approved")}
                  style={{
                    flex: 1,
                    padding: "11px",
                    background: "rgba(0,214,143,0.12)",
                    border: `1px solid rgba(0,214,143,0.25)`,
                    borderRadius: 8,
                    color: c.green,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: c.fh,
                    transition: tr,
                  }}
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => handleReview(claim.claim_id, "rejected")}
                  style={{
                    flex: 1,
                    padding: "11px",
                    background: "rgba(255,77,77,0.08)",
                    border: `1px solid rgba(255,77,77,0.2)`,
                    borderRadius: 8,
                    color: "#ff6b6b",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: c.fh,
                    transition: tr,
                  }}
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
