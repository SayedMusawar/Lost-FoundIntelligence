import { useEffect, useState } from "react";
import { getApprovedNoReceipt, createReceipt, getReceipt } from "../api/client";

export default function IssueReceipt({ user, onBack }) {
  const [approved, setApproved] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    receiver_name: "",
    receiver_phone: "",
    condition_at_handover: "",
    notes: "",
  });
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getApprovedNoReceipt().then((res) => setApproved(res.data));
  }, []);

  const handleSelect = (claim) => {
    setSelected(claim);
    setForm({
      receiver_name: claim.claimant_name,
      receiver_phone: "",
      condition_at_handover: "",
      notes: "",
    });
    setReceipt(null);
    setError("");
  };

  const handleIssue = async () => {
    if (!form.receiver_name || !form.receiver_phone) {
      setError("Receiver name and phone are required");
      return;
    }
    try {
      await createReceipt({
        ...form,
        claim_id: selected.claim_id,
        issued_by: user.user_id,
      });
      const res = await getReceipt(selected.claim_id);
      setReceipt(res.data);
      setError("");
      setApproved((prev) =>
        prev.filter((c) => c.claim_id !== selected.claim_id),
      );
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to issue receipt");
    }
  };

  if (receipt)
    return (
      <div style={styles.container}>
        <div style={styles.receiptCard}>
          <div style={styles.receiptHeader}>
            <h2 style={styles.receiptTitle}>FAST Peshawar</h2>
            <p style={styles.receiptSub}>
              Lost & Found — Item Handover Receipt
            </p>
            <p style={styles.receiptId}>Receipt #{receipt.receipt_id}</p>
          </div>
          <div style={styles.receiptSection}>
            <p style={styles.receiptLabel}>Item Details</p>
            <p style={styles.receiptValue}>
              <b>{receipt.title}</b>
            </p>
            <p style={styles.receiptValue}>{receipt.description}</p>
            <p style={styles.receiptValue}>
              Found at: {receipt.location_found}
            </p>
          </div>
          <div style={styles.receiptSection}>
            <p style={styles.receiptLabel}>Receiver</p>
            <p style={styles.receiptValue}>{receipt.receiver_name}</p>
            <p style={styles.receiptValue}>📞 {receipt.receiver_phone}</p>
            {receipt.roll_number && (
              <p style={styles.receiptValue}>🎓 {receipt.roll_number}</p>
            )}
            <p style={styles.receiptValue}>✉️ {receipt.claimant_email}</p>
          </div>
          <div style={styles.receiptSection}>
            <p style={styles.receiptLabel}>Handover Details</p>
            <p style={styles.receiptValue}>
              Condition: {receipt.condition_at_handover || "Not specified"}
            </p>
            {receipt.notes && (
              <p style={styles.receiptValue}>Notes: {receipt.notes}</p>
            )}
            <p style={styles.receiptValue}>
              Issued by: {receipt.issued_by_name}
            </p>
            <p style={styles.receiptValue}>
              Date & Time: {new Date(receipt.issued_at).toLocaleString()}
            </p>
          </div>
          <div style={styles.receiptFooter}>
            <p>
              This receipt confirms the item was collected by the above person.
            </p>
            <p>FAST Peshawar — Student Affairs Office</p>
          </div>
        </div>
        <div style={styles.printActions}>
          <button style={styles.printBtn} onClick={() => window.print()}>
            🖨 Print Receipt
          </button>
          <button style={styles.backBtn} onClick={onBack}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          ← Back
        </button>
        <h2 style={styles.title}>Issue Receipt — Approved Claims</h2>
      </div>
      {approved.length === 0 && !selected && (
        <div style={styles.emptyBox}>
          <p style={styles.emptyIcon}>📋</p>
          <p style={styles.emptyText}>
            No approved claims waiting for receipt.
          </p>
        </div>
      )}
      {!selected && approved.length > 0 && (
        <div style={styles.list}>
          {approved.map((claim) => (
            <div key={claim.claim_id} style={styles.claimCard}>
              <div>
                <h3 style={styles.claimTitle}>{claim.title}</h3>
                <p style={styles.claimMeta}>
                  👤 {claim.claimant_name} — {claim.claimant_email}
                </p>
                {claim.roll_number && (
                  <p style={styles.claimMeta}>🎓 {claim.roll_number}</p>
                )}
                <p style={styles.claimMeta}>📍 {claim.location_found}</p>
              </div>
              <button
                style={styles.issueBtn}
                onClick={() => handleSelect(claim)}
              >
                Issue Receipt →
              </button>
            </div>
          ))}
        </div>
      )}
      {selected && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>
            Issuing receipt for: <b>{selected.title}</b>
          </h3>
          <p style={styles.formSub}>Claimant: {selected.claimant_name}</p>
          <label style={styles.label}>Receiver Name</label>
          <input
            style={styles.input}
            value={form.receiver_name}
            onChange={(e) =>
              setForm({ ...form, receiver_name: e.target.value })
            }
          />
          <label style={styles.label}>Receiver Phone</label>
          <input
            style={styles.input}
            placeholder="03XX-XXXXXXX"
            value={form.receiver_phone}
            onChange={(e) =>
              setForm({ ...form, receiver_phone: e.target.value })
            }
          />
          <label style={styles.label}>Item Condition at Handover</label>
          <input
            style={styles.input}
            placeholder="e.g. Good condition, minor scratches"
            value={form.condition_at_handover}
            onChange={(e) =>
              setForm({ ...form, condition_at_handover: e.target.value })
            }
          />
          <label style={styles.label}>Notes (optional)</label>
          <textarea
            style={styles.textarea}
            placeholder="Any additional notes..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          {error && <div style={styles.errorBox}>⚠️ {error}</div>}
          <div style={{ display: "flex", gap: "12px" }}>
            <button style={styles.cancelBtn} onClick={() => setSelected(null)}>
              Cancel
            </button>
            <button style={styles.submitBtn} onClick={handleIssue}>
              ✅ Issue Receipt
            </button>
          </div>
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
  title: { margin: 0, color: "#1a1a2e" },
  backBtn: {
    background: "none",
    border: "1px solid #ddd",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    color: "#555",
  },
  emptyBox: { textAlign: "center", marginTop: "80px" },
  emptyIcon: { fontSize: "48px", margin: "0 0 12px" },
  emptyText: { color: "#888", fontSize: "16px" },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "680px",
    margin: "0 auto",
  },
  claimCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  claimTitle: { margin: "0 0 6px", color: "#1a1a2e" },
  claimMeta: { margin: "3px 0", color: "#666", fontSize: "13px" },
  issueBtn: {
    padding: "10px 18px",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "28px",
    maxWidth: "540px",
    margin: "0 auto",
    boxShadow: "0 2px 16px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  formTitle: { margin: 0, color: "#1a1a2e", fontSize: "18px" },
  formSub: { margin: 0, color: "#666", fontSize: "14px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#333" },
  input: {
    padding: "11px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  textarea: {
    padding: "11px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    minHeight: "80px",
    resize: "vertical",
  },
  errorBox: {
    backgroundColor: "#fdecea",
    color: "#c0392b",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
  },
  cancelBtn: {
    flex: 1,
    padding: "11px",
    backgroundColor: "white",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
  },
  submitBtn: {
    flex: 2,
    padding: "11px",
    backgroundColor: "#34a853",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
  },
  receiptCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "40px",
    maxWidth: "600px",
    margin: "0 auto 24px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.1)",
  },
  receiptHeader: {
    textAlign: "center",
    borderBottom: "2px solid #1a1a2e",
    paddingBottom: "20px",
    marginBottom: "24px",
  },
  receiptTitle: { margin: "0 0 4px", color: "#1a1a2e", fontSize: "24px" },
  receiptSub: { margin: "0 0 8px", color: "#555" },
  receiptId: { margin: 0, color: "#888", fontSize: "13px" },
  receiptSection: { marginBottom: "20px" },
  receiptLabel: {
    fontSize: "11px",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "0 0 8px",
    fontWeight: "600",
  },
  receiptValue: { margin: "4px 0", color: "#333", fontSize: "14px" },
  receiptFooter: {
    borderTop: "1px solid #eee",
    paddingTop: "16px",
    textAlign: "center",
    color: "#888",
    fontSize: "12px",
  },
  printActions: {
    display: "flex",
    gap: "12px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  printBtn: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#1a1a2e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
  },
};
