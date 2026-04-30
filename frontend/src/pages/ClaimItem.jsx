import { useState } from "react";
import { submitClaim } from "../api/client";

export default function ClaimItem({ item, user, onBack }) {
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("Please describe how this item is yours");
      return;
    }
    try {
      await submitClaim({
        item_id: item.item_id,
        claimant_id: user.user_id,
        claim_description: description,
      });
      setSuccess(true);
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit claim");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button style={styles.backBtn} onClick={onBack}>
          ← Back
        </button>
        <h2 style={styles.title}>Submit a Claim</h2>
        <div style={styles.itemBox}>
          <p style={styles.itemLabel}>Item you are claiming:</p>
          <h3 style={styles.itemName}>{item.title}</h3>
          <p style={styles.itemMeta}>📍 {item.location_found}</p>
          <p style={styles.itemMeta}>
            🕐 {new Date(item.found_at).toLocaleDateString()}
          </p>
        </div>
        {success ? (
          <div style={styles.successBox}>
            ✅ Claim submitted! Student Affairs will review it and notify you.
          </div>
        ) : (
          <>
            <label style={styles.label}>
              Prove this is yours — describe identifying features, when you lost
              it, what was inside, etc.
            </label>
            <textarea
              style={styles.textarea}
              placeholder="e.g. It's a black Samsung phone with a cracked screen protector..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {error && <div style={styles.errorBox}>⚠️ {error}</div>}
            <button style={styles.button} onClick={handleSubmit}>
              Submit Claim
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "32px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.1)",
    padding: "32px",
    width: "100%",
    maxWidth: "540px",
    height: "fit-content",
  },
  backBtn: {
    background: "none",
    border: "1px solid #ddd",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    color: "#555",
    marginBottom: "16px",
  },
  title: { margin: "0 0 20px", color: "#1a1a2e" },
  itemBox: {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "20px",
  },
  itemLabel: {
    margin: "0 0 8px",
    fontSize: "12px",
    color: "#888",
    textTransform: "uppercase",
  },
  itemName: { margin: "0 0 8px", color: "#1a1a2e" },
  itemMeta: { margin: "4px 0", color: "#666", fontSize: "13px" },
  label: {
    display: "block",
    fontSize: "13px",
    color: "#333",
    marginBottom: "8px",
    lineHeight: "1.5",
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "11px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
    marginBottom: "12px",
  },
  button: {
    width: "100%",
    padding: "13px",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
  },
  successBox: {
    backgroundColor: "#e6f4ea",
    color: "#2d7a3a",
    padding: "16px",
    borderRadius: "8px",
    fontSize: "14px",
  },
  errorBox: {
    backgroundColor: "#fdecea",
    color: "#c0392b",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "12px",
  },
};
