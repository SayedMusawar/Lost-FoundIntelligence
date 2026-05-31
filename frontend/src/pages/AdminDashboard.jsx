import { useEffect, useState } from "react";
import { getPendingClaims, reviewClaim } from "../api/client";
import { c, tr, g } from "../theme";

export default function AdminDashboard({ user, onReceipt }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetch = async () => {
    setLoading(true);
    const r = await getPendingClaims();
    setClaims(r.data);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const review = async (id, action) => {
    try {
      await reviewClaim(id, action, user.user_id);
      setToast({ msg: `Claim ${action} — student notified.`, type: "success" });
      fetch();
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
    <>
      <style>{`
        .admin-stats { display: grid; grid-template-columns: repeat(4,1fr); gap:14px; margin-bottom:28px; }
        .claim-meta-grid { display: grid; grid-template-columns: repeat(2,1fr); gap:12px; margin-bottom:16px; }
        @media (max-width: 700px) { .admin-stats { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 480px) { .admin-stats { grid-template-columns: repeat(2,1fr); gap:10px; } .claim-meta-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="fade-up">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 26,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: c.fh,
                fontSize: 24,
                fontWeight: 700,
                color: c.dark,
                marginBottom: 5,
              }}
            >
              Admin Dashboard
            </h1>
            <p style={{ fontSize: 13, color: c.text3 }}>
              Review and manage pending claim requests
            </p>
          </div>
          <button
            onClick={onReceipt}
            style={{
              padding: "10px 18px",
              background: c.blueLight,
              border: `1.5px solid ${c.border2}`,
              borderRadius: 9,
              color: c.blue,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: c.fh,
              transition: tr,
              whiteSpace: "nowrap",
            }}
          >
            📋 Issue Receipts
          </button>
        </div>

        <div className="admin-stats">
          {[
            {
              val: claims.length,
              lbl: "Pending Claims",
              accent: claims.length > 0 ? c.amber : c.green,
            },
            { val: "—", lbl: "Total Items", accent: c.blue },
            { val: "—", lbl: "Resolved Today", accent: c.green },
            { val: "—", lbl: "This Month", accent: c.text3 },
          ].map(({ val, lbl, accent }) => (
            <div key={lbl} style={g.statCard(accent)}>
              <div
                style={{
                  ...g.statVal,
                  fontSize: 26,
                  color:
                    accent === c.amber && claims.length > 0 ? c.amber : c.dark,
                }}
              >
                {val}
              </div>
              <div style={g.statLbl}>{lbl}</div>
            </div>
          ))}
        </div>

        {toast && (
          <div style={g.alert(toast.type)}>
            {toast.type === "success" ? "✓" : "⚠"} {toast.msg}
          </div>
        )}
        <div style={g.sectionHead}>Pending Claims ({claims.length})</div>

        {loading && (
          <div style={g.empty}>
            <div
              style={{
                width: 34,
                height: 34,
                border: `3px solid ${c.blue}`,
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 14px",
              }}
            />
            <p style={g.emptySub}>Loading…</p>
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 14,
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
                        marginBottom: 5,
                      }}
                    >
                      Item
                    </div>
                    <h3
                      style={{
                        fontFamily: c.fh,
                        fontSize: 15,
                        fontWeight: 700,
                        color: c.dark,
                        marginBottom: 3,
                      }}
                    >
                      {claim.title}
                    </h3>
                    <p style={{ fontSize: 12, color: c.text2 }}>
                      📍 {claim.location_found}
                    </p>
                  </div>
                  <span style={g.badge(c.amberBg, c.amber)}>⏳ Pending</span>
                </div>
                <div style={g.divider} />
                <div className="claim-meta-grid">
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
                        style={{
                          fontSize: 10,
                          color: c.text3,
                          marginBottom: 3,
                        }}
                      >
                        {k}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: c.dark,
                          fontWeight: 600,
                          wordBreak: "break-all",
                        }}
                      >
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    background: c.surface2,
                    borderRadius: 8,
                    border: `1.5px solid ${c.border}`,
                    padding: "12px 16px",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: c.text3,
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                      marginBottom: 7,
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
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => review(claim.claim_id, "approved")}
                    style={{
                      flex: 1,
                      padding: "11px",
                      background: c.greenBg,
                      border: `1.5px solid #9fe8c8`,
                      borderRadius: 8,
                      color: c.green,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: c.fh,
                    }}
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => review(claim.claim_id, "rejected")}
                    style={{
                      flex: 1,
                      padding: "11px",
                      background: c.redBg,
                      border: `1.5px solid #f5b8b4`,
                      borderRadius: 8,
                      color: c.red,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: c.fh,
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
    </>
  );
}
