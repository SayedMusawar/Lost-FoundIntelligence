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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getApprovedNoReceipt().then((r) => setApproved(r.data));
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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // ── Printed receipt view ──
  if (receipt)
    return (
      <div style={s.page}>
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
            ← Back to Dashboard
          </button>
        </nav>
        <div style={s.body}>
          <div style={s.receiptWrap}>
            <div style={s.receiptCard}>
              <div style={s.receiptHeader}>
                <p style={s.receiptLogo}>FAST-NUCES Peshawar</p>
                <p style={s.receiptHeaderSub}>
                  Lost &amp; Found — Item Handover Receipt
                </p>
                <span style={s.receiptId}>Receipt #{receipt.receipt_id}</span>
              </div>
              {[
                {
                  label: "Item details",
                  rows: [
                    ["Item", receipt.title],
                    ["Description", receipt.description],
                    ["Found at", receipt.location_found],
                  ],
                },
                {
                  label: "Receiver details",
                  rows: [
                    ["Name", receipt.receiver_name],
                    ["Phone", receipt.receiver_phone],
                    ["Roll No", receipt.roll_number || "—"],
                    ["Email", receipt.claimant_email],
                  ],
                },
                {
                  label: "Handover details",
                  rows: [
                    [
                      "Condition",
                      receipt.condition_at_handover || "Not specified",
                    ],
                    ["Notes", receipt.notes || "—"],
                    ["Issued by", receipt.issued_by_name],
                    [
                      "Date & time",
                      new Date(receipt.issued_at).toLocaleString(),
                    ],
                  ],
                },
              ].map(({ label, rows }) => (
                <div key={label} style={s.rSection}>
                  <p style={s.rSectionLbl}>{label}</p>
                  {rows.map(([k, v]) => (
                    <div key={k} style={s.rRow}>
                      <span style={s.rKey}>{k}</span>
                      <span style={s.rVal}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
              <div style={s.receiptFooter}>
                This receipt confirms the item was collected by the above
                person.
                <br />
                FAST-NUCES Peshawar — Student Affairs Office
              </div>
            </div>
            <div style={s.printActions}>
              <button style={s.printBtn} onClick={() => window.print()}>
                Print Receipt
              </button>
              <button style={s.backLinkBtn} onClick={onBack}>
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  // ── Main view ──
  return (
    <div style={s.page}>
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
          ← Back to Dashboard
        </button>
      </nav>

      <div style={{ ...s.body, alignItems: "flex-start", gap: 20 }}>
        {/* ── Left: claim list + form ── */}
        <div style={s.left}>
          <p style={s.sectionLbl}>Approved claims — awaiting receipt</p>

          {approved.length === 0 && !selected && (
            <div style={s.emptyBox}>
              <div style={s.emptyIcon}>✓</div>
              <p style={s.emptyTitle}>No pending receipts</p>
              <p style={s.emptySub}>
                All approved claims have been issued receipts.
              </p>
            </div>
          )}

          <div style={s.claimList}>
            {approved.map((claim) => (
              <div
                key={claim.claim_id}
                style={{
                  ...s.claimRow,
                  ...(selected?.claim_id === claim.claim_id
                    ? s.claimRowActive
                    : {}),
                }}
              >
                <div>
                  <p style={s.crTitle}>{claim.title}</p>
                  <p style={s.crMeta}>
                    {claim.claimant_name} · {claim.roll_number || "—"} · 📍{" "}
                    {claim.location_found}
                  </p>
                </div>
                <button style={s.issueBtn} onClick={() => handleSelect(claim)}>
                  Issue Receipt →
                </button>
              </div>
            ))}
          </div>

          {selected && (
            <div style={s.formCard}>
              <p style={s.formTitle}>
                Issuing receipt for: <strong>{selected.title}</strong>
              </p>
              <p style={s.formSub}>Claimant: {selected.claimant_name}</p>

              {[
                { lbl: "Receiver Name", key: "receiver_name", ph: "Full name" },
                {
                  lbl: "Receiver Phone",
                  key: "receiver_phone",
                  ph: "03XX-XXXXXXX",
                },
                {
                  lbl: "Item condition at handover",
                  key: "condition_at_handover",
                  ph: "e.g. Good condition, minor scratches",
                },
              ].map(({ lbl, key, ph }) => (
                <div key={key} style={s.field}>
                  <label style={s.lbl}>{lbl}</label>
                  <input
                    style={s.inp}
                    placeholder={ph}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                </div>
              ))}

              <div style={s.field}>
                <label style={s.lbl}>Notes (optional)</label>
                <textarea
                  style={s.ta}
                  placeholder="Any additional notes..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              {error && <div style={s.errorBox}>⚠ {error}</div>}
              <div style={s.divider} />
              <div style={s.btnRow}>
                <button style={s.btnCancel} onClick={() => setSelected(null)}>
                  Cancel
                </button>
                <button
                  style={{ ...s.btnIssue, opacity: loading ? 0.7 : 1 }}
                  onClick={handleIssue}
                  disabled={loading}
                >
                  {loading ? "Issuing..." : "✓ Issue Receipt"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: receipt preview (static placeholder when no receipt yet) ── */}
        <div style={s.right}>
          <p style={s.sectionLbl}>Receipt preview</p>
          <div style={s.receiptCard}>
            <div style={s.receiptHeader}>
              <p style={s.receiptLogo}>FAST-NUCES Peshawar</p>
              <p style={s.receiptHeaderSub}>
                Lost &amp; Found — Item Handover Receipt
              </p>
              <span style={s.receiptId}>
                {selected
                  ? `For: ${selected.title}`
                  : "Select a claim to preview"}
              </span>
            </div>
            {selected ? (
              <>
                {[
                  {
                    label: "Item details",
                    rows: [
                      ["Item", selected.title],
                      ["Found at", selected.location_found],
                    ],
                  },
                  {
                    label: "Receiver details",
                    rows: [
                      ["Name", form.receiver_name || "—"],
                      ["Roll No", selected.roll_number || "—"],
                      ["Email", selected.claimant_email],
                    ],
                  },
                  {
                    label: "Handover details",
                    rows: [
                      ["Condition", form.condition_at_handover || "—"],
                      ["Issued by", user.name],
                      ["Date & time", new Date().toLocaleString()],
                    ],
                  },
                ].map(({ label, rows }) => (
                  <div key={label} style={s.rSection}>
                    <p style={s.rSectionLbl}>{label}</p>
                    {rows.map(([k, v]) => (
                      <div key={k} style={s.rRow}>
                        <span style={s.rKey}>{k}</span>
                        <span style={s.rVal}>{v}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </>
            ) : (
              <p
                style={{
                  fontSize: 12,
                  color: "#9aa5be",
                  textAlign: "center",
                  padding: "20px 0",
                }}
              >
                Select a claim from the list to see a preview here.
              </p>
            )}
            <div style={s.receiptFooter}>
              This receipt confirms the item was collected by the above person.
              <br />
              FAST-NUCES Peshawar — Student Affairs Office
            </div>
          </div>
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
  body: { padding: 24, display: "flex", gap: 20, alignItems: "flex-start" },
  left: { flex: 1, minWidth: 0 },
  right: { width: 300, flexShrink: 0 },
  sectionLbl: {
    fontSize: 11,
    fontWeight: "500",
    color: "#4a5878",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  claimList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 16,
  },
  claimRow: {
    backgroundColor: "#fff",
    borderRadius: 9,
    border: "0.5px solid #c8d8f0",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  claimRowActive: { borderColor: "#0c2d6b", backgroundColor: "#f0f4ff" },
  crTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1a1a2e",
    marginBottom: 3,
  },
  crMeta: { fontSize: 11, color: "#6b7a99" },
  issueBtn: {
    padding: "6px 14px",
    backgroundColor: "#0c2d6b",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 11,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    border: "0.5px solid #c8d8f0",
    padding: 18,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0c2d6b",
    marginBottom: 2,
  },
  formSub: { fontSize: 11, color: "#9aa5be", marginBottom: 14 },
  field: { marginBottom: 12 },
  lbl: {
    display: "block",
    fontSize: 11,
    fontWeight: "500",
    color: "#4a5878",
    letterSpacing: "0.4px",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  inp: {
    width: "100%",
    padding: "8px 11px",
    borderRadius: 7,
    border: "0.5px solid #c8d8f0",
    fontSize: 13,
    color: "#1a1a2e",
    backgroundColor: "#f8faff",
    outline: "none",
    boxSizing: "border-box",
  },
  ta: {
    width: "100%",
    padding: "8px 11px",
    borderRadius: 7,
    border: "0.5px solid #c8d8f0",
    fontSize: 13,
    color: "#1a1a2e",
    backgroundColor: "#f8faff",
    outline: "none",
    minHeight: 70,
    resize: "vertical",
    boxSizing: "border-box",
  },
  errorBox: {
    backgroundColor: "#fcebeb",
    color: "#a32d2d",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 10,
  },
  divider: { height: "0.5px", backgroundColor: "#eef2f9", margin: "14px 0" },
  btnRow: { display: "flex", gap: 8 },
  btnCancel: {
    flex: 1,
    padding: 9,
    backgroundColor: "#fff",
    color: "#4a5878",
    border: "0.5px solid #c8d8f0",
    borderRadius: 7,
    fontSize: 12,
    cursor: "pointer",
  },
  btnIssue: {
    flex: 2,
    padding: 9,
    backgroundColor: "#0c2d6b",
    color: "#fff",
    border: "none",
    borderRadius: 7,
    fontSize: 12,
    fontWeight: "500",
    cursor: "pointer",
  },
  emptyBox: { textAlign: "center", marginTop: 60, marginBottom: 20 },
  emptyIcon: { fontSize: 32, color: "#1a9e75", marginBottom: 8 },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0c2d6b",
    marginBottom: 4,
  },
  emptySub: { fontSize: 12, color: "#9aa5be" },
  receiptWrap: { maxWidth: 560, margin: "0 auto" },
  receiptCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    border: "0.5px solid #c8d8f0",
    padding: 24,
  },
  receiptHeader: {
    textAlign: "center",
    borderBottom: "0.5px solid #eef2f9",
    paddingBottom: 16,
    marginBottom: 16,
  },
  receiptLogo: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0c2d6b",
    marginBottom: 2,
  },
  receiptHeaderSub: { fontSize: 11, color: "#9aa5be", marginBottom: 6 },
  receiptId: {
    fontSize: 10,
    color: "#6b7a99",
    backgroundColor: "#eef2f9",
    padding: "2px 10px",
    borderRadius: 20,
    display: "inline-block",
  },
  rSection: { marginBottom: 14 },
  rSectionLbl: {
    fontSize: 10,
    color: "#9aa5be",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 6,
    fontWeight: "500",
  },
  rRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    padding: "3px 0",
    borderBottom: "0.5px solid #f4f6fb",
  },
  rKey: { color: "#9aa5be" },
  rVal: {
    color: "#1a1a2e",
    fontWeight: "500",
    textAlign: "right",
    maxWidth: 200,
  },
  receiptFooter: {
    textAlign: "center",
    fontSize: 10,
    color: "#9aa5be",
    borderTop: "0.5px solid #eef2f9",
    paddingTop: 12,
    marginTop: 14,
    lineHeight: 1.6,
  },
  printActions: { display: "flex", gap: 10, marginTop: 14 },
  printBtn: {
    flex: 2,
    padding: 10,
    backgroundColor: "#0c2d6b",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
  },
  backLinkBtn: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    color: "#4a5878",
    border: "0.5px solid #c8d8f0",
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
  },
};
