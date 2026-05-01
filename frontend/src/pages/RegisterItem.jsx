import { useState, useEffect } from "react";
import { getCategories, registerItem } from "../api/client";

const FAST_LOCATIONS = [
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

export default function RegisterItem({ user, onBack }) {
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.description ||
      !form.category_id ||
      !form.location_found ||
      !form.found_at
    ) {
      setError("Please fill in all required fields");
      return;
    }
    if (form.location_found === "Other" && !form.location_other.trim()) {
      setError("Please describe the location");
      return;
    }
    const finalLocation =
      form.location_found === "Other"
        ? form.location_other
        : form.location_found;
    setLoading(true);
    try {
      await registerItem({
        title: form.title,
        description: form.description,
        category_id: parseInt(form.category_id),
        location_found: finalLocation,
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
    } catch {
      setError("Failed to register item. Please try again.");
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
          <div style={s.cardHead}>
            <h2 style={s.cardTitle}>Register Found Item</h2>
            <span style={s.staffBadge}>Staff: {user.name}</span>
          </div>
          <p style={s.cardSub}>
            Fill in the details of the item found on campus
          </p>

          {success && (
            <div style={s.successBox}>
              ✓ Item registered successfully! You can register another below.
            </div>
          )}
          {error && <div style={s.errorBox}>⚠ {error}</div>}

          {/* Title */}
          <div style={s.field}>
            <label style={s.lbl}>Item Title</label>
            <input
              style={s.inp}
              name="title"
              placeholder="e.g. Black Wallet, Blue Water Bottle"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div style={s.field}>
            <label style={s.lbl}>Description</label>
            <textarea
              style={s.ta}
              name="description"
              placeholder="Describe the item — colour, brand, distinguishing features..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Category + Location row */}
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.lbl}>Category</label>
              <select
                style={s.inp}
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
              >
                <option value="">-- Select --</option>
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.cat_name}
                  </option>
                ))}
              </select>
            </div>
            <div style={s.field}>
              <label style={s.lbl}>Location Found</label>
              <select
                style={s.inp}
                name="location_found"
                value={form.location_found}
                onChange={handleChange}
              >
                <option value="">-- Select --</option>
                {FAST_LOCATIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Other location */}
          {form.location_found === "Other" && (
            <div style={s.field}>
              <label style={s.lbl}>Describe the Location</label>
              <input
                style={s.inp}
                name="location_other"
                placeholder="e.g. Near the main gate..."
                value={form.location_other}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Date & Time */}
          <div style={s.field}>
            <label style={s.lbl}>Date &amp; Time Found</label>
            <input
              style={s.inp}
              type="datetime-local"
              name="found_at"
              value={form.found_at}
              onChange={handleChange}
            />
          </div>

          <div style={s.divider} />
          <button
            style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Item"}
          </button>
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
    padding: "28px 28px",
    width: "100%",
    maxWidth: 520,
  },
  cardHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cardTitle: { fontSize: 17, fontWeight: "500", color: "#0c2d6b" },
  staffBadge: {
    fontSize: 11,
    color: "#6b7a99",
    backgroundColor: "#eef2f9",
    padding: "4px 10px",
    borderRadius: 20,
  },
  cardSub: { fontSize: 12, color: "#9aa5be", marginBottom: 20 },
  successBox: {
    backgroundColor: "#e6f4ea",
    color: "#27500a",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: "#fcebeb",
    color: "#a32d2d",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 16,
  },
  field: { marginBottom: 14 },
  lbl: {
    display: "block",
    fontSize: 11,
    fontWeight: "500",
    color: "#4a5878",
    letterSpacing: "0.4px",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  inp: {
    width: "100%",
    padding: "9px 12px",
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
    padding: "9px 12px",
    borderRadius: 7,
    border: "0.5px solid #c8d8f0",
    fontSize: 13,
    color: "#1a1a2e",
    backgroundColor: "#f8faff",
    outline: "none",
    minHeight: 90,
    resize: "vertical",
    boxSizing: "border-box",
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
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
};
