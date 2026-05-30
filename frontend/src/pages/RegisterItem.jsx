import { useState, useEffect } from "react";
import { getCategories, registerItem } from "../api/client";
import { c, tr, g } from "../theme";

const LOCATIONS = [
  "Room 1",
  "Room 2",
  "Room 3",
  "Room 4",
  "Room 5",
  "Room 6",
  "Room 7",
  "Room 8",
  "Room 9",
  "Room 10",
  "Room 11",
  "Room 12",
  "Rafaqat Lab",
  "Khyber Lab",
  "Hassan Abidi Lab",
  "Mehboob/PC Lab",
  "Library",
  "Basement",
  "Lobby",
  "Girls Common Room",
  "Hall A",
  "CAL Lab",
  "FYP Lab",
  "Cafeteria",
  "Engineering Workshop",
  "Other",
];

export default function RegisterItem({ user }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category_id: "",
    location_found: "",
    location_other: "",
    found_at: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data));
  }, []);

  const set = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.description ||
      !form.category_id ||
      !form.location_found ||
      !form.found_at
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.location_found === "Other" && !form.location_other.trim()) {
      setError("Please describe the specific location.");
      return;
    }
    const finalLoc =
      form.location_found === "Other"
        ? form.location_other
        : form.location_found;
    setLoading(true);
    try {
      await registerItem({
        title: form.title,
        description: form.description,
        category_id: parseInt(form.category_id),
        location_found: finalLoc,
        found_at: new Date(form.found_at).toISOString(),
        submitted_by: null,
      });
      setSuccess(true);
      setError("");
      setForm({
        title: "",
        description: "",
        category_id: "",
        location_found: "",
        location_other: "",
        found_at: "",
      });
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Failed to register item. Please try again.");
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
    fontSize: 14,
    color: c.text,
    transition: tr,
    boxSizing: "border-box",
  };

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
          Register Found Item
        </h1>
        <p style={{ fontSize: 13, color: c.text2 }}>
          Record an item found on campus —{" "}
          <span style={{ color: c.teal }}>{user.name}</span>
        </p>
      </div>

      <div style={{ maxWidth: 600 }}>
        <div style={{ ...g.card, borderRadius: 16 }}>
          {success && (
            <div style={{ ...g.alert("success"), marginBottom: 24 }}>
              ✓ Item registered successfully!
            </div>
          )}
          {error && (
            <div style={{ ...g.alert("error"), marginBottom: 24 }}>
              ⚠ {error}
            </div>
          )}

          <div style={g.field}>
            <label style={g.label}>Item Title *</label>
            <input
              style={inp}
              name="title"
              placeholder="e.g. Black Wallet, Blue Water Bottle"
              value={form.title}
              onChange={set}
            />
          </div>

          <div style={g.field}>
            <label style={g.label}>Description *</label>
            <textarea
              style={{ ...g.textarea }}
              name="description"
              placeholder="Colour, brand, distinguishing features…"
              value={form.description}
              onChange={set}
            />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <div style={g.field}>
              <label style={g.label}>Category *</label>
              <select
                style={inp}
                name="category_id"
                value={form.category_id}
                onChange={set}
              >
                <option value="">— Select —</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.cat_name}
                  </option>
                ))}
              </select>
            </div>
            <div style={g.field}>
              <label style={g.label}>Location Found *</label>
              <select
                style={inp}
                name="location_found"
                value={form.location_found}
                onChange={set}
              >
                <option value="">— Select —</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {form.location_found === "Other" && (
            <div style={g.field}>
              <label style={g.label}>Specific Location *</label>
              <input
                style={inp}
                name="location_other"
                placeholder="Describe the exact spot…"
                value={form.location_other}
                onChange={set}
              />
            </div>
          )}

          <div style={g.field}>
            <label style={g.label}>Date & Time Found *</label>
            <input
              style={inp}
              type="datetime-local"
              name="found_at"
              value={form.found_at}
              onChange={set}
            />
          </div>

          <div style={g.divider} />

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              ...g.btnPrimary,
              opacity: loading ? 0.6 : 1,
              boxShadow: loading ? "none" : `0 0 24px rgba(0,229,176,0.2)`,
              fontFamily: c.fh,
            }}
          >
            {loading ? "Registering…" : "Register Item →"}
          </button>
        </div>
      </div>
    </div>
  );
}
