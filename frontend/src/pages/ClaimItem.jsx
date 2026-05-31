import { useState } from "react";
import { submitClaim } from "../api/client";
import { c, tr, g } from "../theme";

export default function ClaimItem({ item, user, onBack }) {
  const [desc, setDesc] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!desc.trim()) {
      setError("Please describe how this item is yours.");
      return;
    }
    setLoading(true);
    try {
      await submitClaim({
        item_id: item.item_id,
        claimant_id: user.user_id,
        claim_description: desc,
      });
      setSuccess(true);
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit claim.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 28 }}>
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: "none",
            color: c.text3,
            fontSize: 13,
            cursor: "pointer",
            padding: "0 0 14px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ← Back to Items
        </button>
        <h1
          style={{
            fontFamily: c.fh,
            fontSize: 26,
            fontWeight: 700,
            color: c.dark,
            marginBottom: 6,
          }}
        >
          Submit a Claim
        </h1>
        <p style={{ fontSize: 13, color: c.text3 }}>
          Provide proof of ownership to claim this item
        </p>
      </div>
      <div style={{ maxWidth: 560 }}>
        <div
          style={{
            ...g.card,
            borderRadius: 12,
            borderLeft: `4px solid ${c.blue}`,
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                color: c.text3,
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: 8,
              }}
            >
              Item You Are Claiming
            </div>
            <h3
              style={{
                fontFamily: c.fh,
                fontSize: 17,
                fontWeight: 700,
                color: c.dark,
                marginBottom: 8,
              }}
            >
              {item.title}
            </h3>
            <div
              style={{
                fontSize: 12,
                color: c.text2,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <span>📍 {item.location_found}</span>
              <span>
                🕐 Found: {new Date(item.found_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          {item.category && (
            <span style={g.badge(c.blueLight, c.blueDark)}>
              {item.category}
            </span>
          )}
        </div>

        {success ? (
          <div
            style={{
              ...g.card,
              borderRadius: 16,
              textAlign: "center",
              padding: "48px 32px",
              border: `1.5px solid #9fe8c8`,
              background: c.greenBg,
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2
              style={{
                fontFamily: c.fh,
                fontSize: 20,
                fontWeight: 700,
                color: c.green,
                marginBottom: 10,
              }}
            >
              Claim Submitted!
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "#0a7a4a",
                lineHeight: 1.7,
                marginBottom: 28,
              }}
            >
              Student Affairs will review your claim and notify you on the
              Notifications page.
            </p>
            <button
              onClick={onBack}
              style={{
                padding: "11px 28px",
                background: `linear-gradient(135deg,${c.blue},${c.blueDark})`,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: c.fh,
              }}
            >
              ← Back to Items
            </button>
          </div>
        ) : (
          <div style={{ ...g.card, borderRadius: 16 }}>
            <div style={g.field}>
              <label style={g.label}>Ownership Proof *</label>
              <p
                style={{
                  fontSize: 12,
                  color: c.text3,
                  marginBottom: 10,
                  lineHeight: 1.6,
                }}
              >
                Describe identifying features, when you lost it, what was
                inside, lock screen details, serial number, etc.
              </p>
              <textarea
                style={{
                  ...g.textarea,
                  minHeight: 130,
                  background: c.surface2,
                }}
                placeholder="e.g. Black Samsung S22 with cracked screen protector. Wallpaper is a photo of my dog…"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            {error && <div style={g.alert("error")}>⚠ {error}</div>}
            <div style={g.divider} />
            <button
              onClick={submit}
              disabled={loading}
              style={{ ...g.btnPrimary, opacity: loading ? 0.65 : 1 }}
            >
              {loading ? "Submitting…" : "Submit Claim →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
