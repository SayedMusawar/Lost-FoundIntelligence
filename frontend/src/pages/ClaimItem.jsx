import { useState } from "react";
import { submitClaim } from "../api/client";

export default function ClaimItem({ item, user, onBack }) {
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("Please describe how this item is yours");
      return;
    }
    setLoading(true);
    try {
      await submitClaim({
        item_id: item.item_id,
        claimant_id: user.user_id,
        claim_description: description,
      });
      setSuccess(true);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to submit claim. Try again.",
      );
    } finally {
      setLoading(false);
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
        <button style={s.backBtn} onClick={onBack}>
          ← Back to Items
        </button>
      </nav>

      {/* ── Body ── */}
      <div style={s.body}>
        <div style={s.card}>
          <h2 style={s.cardTitle}>Submit a Claim</h2>
          <p style={s.cardSub}>Provide proof that this item belongs to you</p>

          {/* Item preview box */}
          <div style={s.itemBox}>
            <p style={s.itemBoxLabel}>Item you are claiming</p>
            <h3 style={s.itemName}>{item.title}</h3>
            <p style={s.itemMeta}>📍 {item.location_found}</p>
            <p style={s.itemMeta}>
              🕐 Found on {new Date(item.found_at).toLocaleDateString()}
            </p>
            {item.category && <span style={s.catTag}>{item.category}</span>}
          </div>

          {success ? (
            <div style={s.successBox}>
              <div style={s.successIcon}>✓</div>
              <p style={s.successTitle}>Claim submitted successfully!</p>
              <p style={s.successSub}>
                Student Affairs will review your claim and notify you via the
                Notifications page.
              </p>
              <button style={s.backLinkBtn} onClick={onBack}>
                ← Back to Items
              </button>
            </div>
          ) : (
            <>
              <label style={s.lbl}>Ownership Proof</label>
              <p style={s.hint}>
                Describe identifying features, when you lost it, what was
                inside, lock screen details, etc. The more detail, the better
                your chances of approval.
              </p>
              <textarea
                style={s.ta}
                placeholder="e.g. It's a black Samsung S22 with a cracked screen protector. My wallpaper is a photo of my dog. There's a blue sticker on the back..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {error && <div style={s.errorBox}>⚠ {error}</div>}
              <div style={s.divider} />
              <button
                style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Claim"}
              </button>
            </>
          )}
        </div>
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
  backBtn: {
    padding: "5px 14px",
    borderRadius: 6,
    fontSize: 11,
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  body: { padding: 28, display: "flex", justifyContent: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    border: "0.5px solid #c8d8f0",
    padding: 28,
    width: "100%",
    maxWidth: 520,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: "#0c2d6b",
    marginBottom: 4,
  },
  cardSub: { fontSize: 12, color: "#9aa5be", marginBottom: 20 },
  itemBox: {
    backgroundColor: "#f0f4ff",
    borderRadius: 9,
    border: "0.5px solid #c8d8f0",
    padding: 16,
    marginBottom: 20,
  },
  itemBoxLabel: {
    fontSize: 10,
    color: "#6b7a99",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 8,
    fontWeight: "500",
  },
  itemName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0c2d6b",
    marginBottom: 6,
  },
  itemMeta: { fontSize: 12, color: "#6b7a99", marginBottom: 3 },
  catTag: {
    display: "inline-block",
    padding: "2px 9px",
    borderRadius: 20,
    backgroundColor: "#e6edf9",
    color: "#0c2d6b",
    fontSize: 10,
    fontWeight: "500",
    marginTop: 6,
  },
  lbl: {
    display: "block",
    fontSize: 11,
    fontWeight: "500",
    color: "#4a5878",
    letterSpacing: "0.4px",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  hint: { fontSize: 12, color: "#9aa5be", marginBottom: 10, lineHeight: 1.6 },
  ta: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 7,
    border: "0.5px solid #c8d8f0",
    fontSize: 13,
    color: "#1a1a2e",
    backgroundColor: "#f8faff",
    outline: "none",
    minHeight: 110,
    resize: "vertical",
    boxSizing: "border-box",
  },
  errorBox: {
    backgroundColor: "#fcebeb",
    color: "#a32d2d",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
    marginTop: 12,
  },
  divider: { height: "0.5px", backgroundColor: "#eef2f9", margin: "18px 0" },
  btn: {
    width: "100%",
    padding: 11,
    backgroundColor: "#0c2d6b",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: "500",
    cursor: "pointer",
  },
  successBox: {
    backgroundColor: "#e6f4ea",
    borderRadius: 10,
    padding: 24,
    textAlign: "center",
    border: "0.5px solid #c0ddb0",
  },
  successIcon: { fontSize: 30, color: "#27500a", marginBottom: 10 },
  successTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#27500a",
    marginBottom: 6,
  },
  successSub: {
    fontSize: 12,
    color: "#3b6d11",
    lineHeight: 1.6,
    marginBottom: 16,
  },
  backLinkBtn: {
    padding: "8px 18px",
    backgroundColor: "#0c2d6b",
    color: "#fff",
    border: "none",
    borderRadius: 7,
    fontSize: 12,
    cursor: "pointer",
  },
};
