import { useEffect, useState } from "react";
import { getApprovedNoReceipt, createReceipt, getReceipt } from "../api/client";
import { c, tr, g } from "../theme";

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
      setError("Receiver name and phone are required.");
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
      setApproved((p) => p.filter((cl) => cl.claim_id !== selected.claim_id));
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to issue receipt.");
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: "100%",
    padding: "11px 14px",
    background: c.bg3,
    border: `1px solid ${c.border}`,
    borderRadius: 8,
    fontSize: 13,
    color: c.text,
    transition: tr,
    boxSizing: "border-box",
  };

  // Receipt printed view
  if (receipt)
    return (
      <div className="fade-up">
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={onBack}
            style={{
              background: "transparent",
              border: "none",
              color: c.text2,
              fontSize: 13,
              cursor: "pointer",
              padding: "0 0 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            ← Back to Dashboard
          </button>
          <h1
            style={{
              fontFamily: c.fh,
              fontSize: 26,
              fontWeight: 700,
              color: c.text,
              marginBottom: 6,
            }}
          >
            Receipt Issued
          </h1>
          <p style={{ fontSize: 13, color: c.green }}>
            ✓ Item handover confirmed
          </p>
        </div>
        <div style={{ maxWidth: 520 }}>
          <div
            style={{
              ...g.card,
              borderRadius: 16,
              border: `1px solid rgba(0,229,176,0.2)`,
              background: "rgba(0,229,176,0.04)",
            }}
          >
            {/* Receipt header */}
            <div
              style={{
                textAlign: "center",
                paddingBottom: 20,
                borderBottom: `1px solid ${c.border}`,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontFamily: c.fh,
                  fontSize: 15,
                  fontWeight: 700,
                  color: c.text,
                  marginBottom: 4,
                }}
              >
                FAST-NUCES Peshawar
              </div>
              <div style={{ fontSize: 11, color: c.text3, marginBottom: 10 }}>
                Lost & Found — Item Handover Receipt
              </div>
              <span
                style={{
                  padding: "3px 12px",
                  borderRadius: 99,
                  background: "rgba(0,229,176,0.12)",
                  color: c.teal,
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                Receipt #{receipt.receipt_id}
              </span>
            </div>

            {[
              {
                label: "Item Details",
                rows: [
                  ["Item", receipt.title],
                  ["Description", receipt.description],
                  ["Found at", receipt.location_found],
                ],
              },
              {
                label: "Receiver",
                rows: [
                  ["Name", receipt.receiver_name],
                  ["Phone", receipt.receiver_phone],
                  ["Roll No", receipt.roll_number || "—"],
                  ["Email", receipt.claimant_email],
                ],
              },
              {
                label: "Handover",
                rows: [
                  [
                    "Condition",
                    receipt.condition_at_handover || "Not specified",
                  ],
                  ["Notes", receipt.notes || "—"],
                  ["Issued by", receipt.issued_by_name],
                  ["Date", new Date(receipt.issued_at).toLocaleString()],
                ],
              },
            ].map(({ label, rows }) => (
              <div key={label} style={{ marginBottom: 18 }}>
                <div
                  style={{
                    fontSize: 10,
                    color: c.text3,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: 8,
                  }}
                >
                  {label}
                </div>
                {rows.map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "6px 0",
                      borderBottom: `1px solid ${c.border}`,
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: c.text2 }}>{k}</span>
                    <span
                      style={{
                        color: c.text,
                        fontWeight: 500,
                        textAlign: "right",
                        maxWidth: 260,
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            ))}

            <div
              style={{
                textAlign: "center",
                fontSize: 11,
                color: c.text3,
                lineHeight: 1.7,
                paddingTop: 16,
                borderTop: `1px solid ${c.border}`,
              }}
            >
              This receipt confirms the item was collected by the above person.
              <br />
              FAST-NUCES Peshawar — Student Affairs Office
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button
              onClick={() => window.print()}
              style={{
                flex: 2,
                padding: "12px",
                background: c.teal,
                color: c.bg,
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: c.fh,
              }}
            >
              🖨 Print Receipt
            </button>
            <button
              onClick={onBack}
              style={{
                flex: 1,
                padding: "12px",
                background: c.surface,
                border: `1px solid ${c.border}`,
                borderRadius: 8,
                fontSize: 13,
                color: c.text2,
                cursor: "pointer",
              }}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 28 }}>
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: "none",
            color: c.text2,
            fontSize: 13,
            cursor: "pointer",
            padding: "0 0 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          ← Back to Dashboard
        </button>
        <h1
          style={{
            fontFamily: c.fh,
            fontSize: 26,
            fontWeight: 700,
            color: c.text,
            marginBottom: 6,
          }}
        >
          Issue Receipt
        </h1>
        <p style={{ fontSize: 13, color: c.text2 }}>
          Issue handover receipts for approved claims
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: 20,
          alignItems: "start",
        }}
      >
        {/* Left: claim list + form */}
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: c.text3,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Awaiting Receipt ({approved.length})
          </div>

          {approved.length === 0 && (
            <div style={g.empty}>
              <span style={g.emptyIcon}>✅</span>
              <p style={g.emptyTitle}>All receipts issued</p>
              <p style={g.emptySub}>No approved claims pending receipt.</p>
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 20,
            }}
          >
            {approved.map((claim) => (
              <div
                key={claim.claim_id}
                style={{
                  ...g.card,
                  padding: "14px 18px",
                  borderRadius: 10,
                  border:
                    selected?.claim_id === claim.claim_id
                      ? `1px solid rgba(0,229,176,0.3)`
                      : `1px solid ${c.border}`,
                  background:
                    selected?.claim_id === claim.claim_id
                      ? "rgba(0,229,176,0.05)"
                      : c.surface,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: c.text,
                      marginBottom: 3,
                      fontFamily: c.fh,
                    }}
                  >
                    {claim.title}
                  </div>
                  <div style={{ fontSize: 11, color: c.text3 }}>
                    {claim.claimant_name} · {claim.roll_number || "—"} · 📍{" "}
                    {claim.location_found}
                  </div>
                </div>
                <button
                  onClick={() => handleSelect(claim)}
                  style={{
                    padding: "7px 14px",
                    background: "rgba(0,229,176,0.10)",
                    border: `1px solid rgba(0,229,176,0.2)`,
                    borderRadius: 7,
                    color: c.teal,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Issue →
                </button>
              </div>
            ))}
          </div>

          {selected && (
            <div style={{ ...g.card, borderRadius: 14 }}>
              <div style={{ marginBottom: 18 }}>
                <div
                  style={{
                    fontSize: 10,
                    color: c.text3,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    marginBottom: 6,
                  }}
                >
                  Issuing for
                </div>
                <div
                  style={{
                    fontFamily: c.fh,
                    fontSize: 15,
                    fontWeight: 700,
                    color: c.text,
                  }}
                >
                  {selected.title}
                </div>
                <div style={{ fontSize: 12, color: c.text2 }}>
                  {selected.claimant_name}
                </div>
              </div>

              {[
                { lbl: "Receiver Name", key: "receiver_name", ph: "Full name" },
                {
                  lbl: "Phone Number",
                  key: "receiver_phone",
                  ph: "03XX-XXXXXXX",
                },
                {
                  lbl: "Item Condition",
                  key: "condition_at_handover",
                  ph: "e.g. Good, minor scratches",
                },
              ].map(({ lbl, key, ph }) => (
                <div key={key} style={g.field}>
                  <label style={g.label}>{lbl}</label>
                  <input
                    style={inp}
                    placeholder={ph}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                  />
                </div>
              ))}

              <div style={g.field}>
                <label style={g.label}>Notes (optional)</label>
                <textarea
                  style={{ ...g.textarea, minHeight: 70 }}
                  placeholder="Additional notes…"
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                />
              </div>

              {error && <div style={g.alert("error")}>⚠ {error}</div>}
              <div style={g.divider} />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    flex: 1,
                    padding: "11px",
                    background: "transparent",
                    border: `1px solid ${c.border}`,
                    borderRadius: 8,
                    fontSize: 13,
                    color: c.text2,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleIssue}
                  disabled={loading}
                  style={{
                    flex: 2,
                    padding: "11px",
                    background: c.teal,
                    color: c.bg,
                    border: "none",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: c.fh,
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? "Issuing…" : "✓ Issue Receipt"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: live preview */}
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: c.text3,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Receipt Preview
          </div>
          <div
            style={{ ...g.card, borderRadius: 14, opacity: selected ? 1 : 0.4 }}
          >
            <div
              style={{
                textAlign: "center",
                paddingBottom: 16,
                borderBottom: `1px solid ${c.border}`,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontFamily: c.fh,
                  fontSize: 13,
                  fontWeight: 700,
                  color: c.text,
                  marginBottom: 3,
                }}
              >
                FAST-NUCES Peshawar
              </div>
              <div style={{ fontSize: 10, color: c.text3, marginBottom: 8 }}>
                Item Handover Receipt
              </div>
              <span
                style={{
                  padding: "2px 10px",
                  borderRadius: 99,
                  background: c.bg3,
                  color: c.text3,
                  fontSize: 9,
                }}
              >
                {selected ? `Claim #${selected.claim_id}` : "Select a claim"}
              </span>
            </div>
            {selected ? (
              <>
                {[
                  ["Item", selected.title],
                  ["Claimant", form.receiver_name || selected.claimant_name],
                  ["Phone", form.receiver_phone || "—"],
                  ["Location", selected.location_found],
                  ["Condition", form.condition_at_handover || "—"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "5px 0",
                      borderBottom: `1px solid ${c.border}`,
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: c.text2 }}>{k}</span>
                    <span style={{ color: c.text, fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  color: c.text3,
                  padding: "20px 0",
                }}
              >
                Select a claim to preview
              </p>
            )}
            <div
              style={{
                textAlign: "center",
                fontSize: 10,
                color: c.text3,
                paddingTop: 12,
                borderTop: `1px solid ${c.border}`,
                marginTop: 14,
                lineHeight: 1.6,
              }}
            >
              FAST-NUCES Peshawar — Student Affairs Office
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
