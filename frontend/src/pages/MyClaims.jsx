import { useEffect, useState } from "react";
import { getMyClaims } from "../api/client";
import { c, g } from "../theme";

const STATUS_STYLE = {
  approved: {
    bg: "rgba(0,214,143,0.12)",
    color: "#00d68f",
    border: "rgba(0,214,143,0.25)",
    dot: "#00d68f",
  },
  rejected: {
    bg: "rgba(255,77,77,0.12)",
    color: "#ff6b6b",
    border: "rgba(255,77,77,0.25)",
    dot: "#ff6b6b",
  },
  pending: {
    bg: "rgba(245,166,35,0.12)",
    color: "#f5a623",
    border: "rgba(245,166,35,0.25)",
    dot: "#f5a623",
  },
};

export default function MyClaims({ user }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getMyClaims(user.user_id).then((r) => {
      setClaims(r.data);
      setLoading(false);
    });
  }, []);

  const counts = {
    all: claims.length,
    pending: claims.filter((cl) => cl.status === "pending").length,
    approved: claims.filter((cl) => cl.status === "approved").length,
    rejected: claims.filter((cl) => cl.status === "rejected").length,
  };

  const visible =
    filter === "all" ? claims : claims.filter((cl) => cl.status === filter);

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: c.fh,
            fontSize: 26,
            fontWeight: 700,
            color: c.text,
            marginBottom: 6,
          }}
        >
          My Claims
        </h1>
        <p style={{ fontSize: 13, color: c.text2 }}>
          Track all your submitted item claims
        </p>
      </div>

      {/* Stats */}
      {!loading && (
        <div style={g.statsRow}>
          {[
            { key: "all", val: counts.all, lbl: "Total", accent: c.text2 },
            {
              key: "pending",
              val: counts.pending,
              lbl: "Pending",
              accent: c.amber,
            },
            {
              key: "approved",
              val: counts.approved,
              lbl: "Approved",
              accent: c.green,
            },
            {
              key: "rejected",
              val: counts.rejected,
              lbl: "Rejected",
              accent: c.red,
            },
          ].map(({ key, val, lbl, accent }) => (
            <div
              key={key}
              onClick={() => setFilter(key)}
              style={{
                ...g.statCard(filter === key ? accent : c.border),
                cursor: "pointer",
                transition: "all 0.15s",
                background:
                  filter === key
                    ? `rgba(${accent === c.amber ? "245,166,35" : accent === c.green ? "0,214,143" : accent === c.red ? "255,77,77" : "125,138,170"},0.08)`
                    : c.surface,
              }}
            >
              <div
                style={{
                  ...g.statVal,
                  color: filter === key ? accent : c.text,
                }}
              >
                {val}
              </div>
              <div style={g.statLbl}>{lbl}</div>
            </div>
          ))}
        </div>
      )}

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

      {!loading && claims.length === 0 && (
        <div style={g.empty}>
          <span style={g.emptyIcon}>📭</span>
          <p style={g.emptyTitle}>No claims yet</p>
          <p style={g.emptySub}>
            Browse items and click "Claim This Item" to get started.
          </p>
        </div>
      )}

      {!loading && visible.length > 0 && (
        <>
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
            {filter === "all" ? "All Claims" : `${filter} Claims`} (
            {visible.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {visible.map((claim, i) => {
              const sc = STATUS_STYLE[claim.status] || STATUS_STYLE.pending;
              return (
                <div
                  key={claim.claim_id}
                  className="fade-up"
                  style={{
                    ...g.card,
                    borderRadius: 14,
                    borderLeft: `3px solid ${sc.dot}`,
                    animationDelay: `${i * 0.04}s`,
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
                      <div
                        style={{
                          fontSize: 11,
                          color: c.text3,
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <span>📍 {claim.location_found}</span>
                        <span>
                          🕐 Submitted:{" "}
                          {new Date(claim.submitted_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 14px",
                        borderRadius: 99,
                        background: sc.bg,
                        color: sc.color,
                        border: `1px solid ${sc.border}`,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: sc.dot,
                        }}
                      />
                      {claim.status.charAt(0).toUpperCase() +
                        claim.status.slice(1)}
                    </span>
                  </div>

                  <div style={g.divider} />

                  <div
                    style={{
                      background: c.bg3,
                      borderRadius: 8,
                      border: `1px solid ${c.border}`,
                      padding: "12px 16px",
                      marginBottom: claim.status !== "pending" ? 14 : 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: c.text3,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        marginBottom: 6,
                      }}
                    >
                      Your Proof
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

                  {claim.status === "approved" && (
                    <div
                      style={{
                        ...g.alert("success"),
                        marginTop: 14,
                        marginBottom: 0,
                      }}
                    >
                      ✓ Approved — visit Student Affairs to collect your item.
                    </div>
                  )}
                  {claim.status === "rejected" && (
                    <div
                      style={{
                        ...g.alert("error"),
                        marginTop: 14,
                        marginBottom: 0,
                      }}
                    >
                      ✕ Not approved. Contact Student Affairs for details.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
