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
    submitted_by: null,
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.description ||
      !form.category_id ||
      !form.location_found ||
      !form.found_at
    ) {
      setError("Please fill in all fields");
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
    try {
      await registerItem({
        title: form.title,
        description: form.description,
        category_id: parseInt(form.category_id),
        location_found: finalLocation,
        found_at: new Date(form.found_at).toISOString(),
        submitted_by: form.submitted_by,
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
        submitted_by: null,
      });
    } catch (err) {
      setError("Failed to register item. Try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <button style={styles.backBtn} onClick={onBack}>
            ← Back
          </button>
          <h2 style={styles.title}>Register Found Item</h2>
          <span style={styles.staffBadge}>Staff: {user.name}</span>
        </div>
        {success && (
          <div style={styles.successBox}>✅ Item registered successfully!</div>
        )}
        {error && <div style={styles.errorBox}>⚠️ {error}</div>}
        <div style={styles.form}>
          <label style={styles.label}>Item Title</label>
          <input
            style={styles.input}
            name="title"
            placeholder="e.g. Black Wallet, Blue Water Bottle"
            value={form.title}
            onChange={handleChange}
          />
          <label style={styles.label}>Description</label>
          <textarea
            style={styles.textarea}
            name="description"
            placeholder="Describe the item in detail..."
            value={form.description}
            onChange={handleChange}
          />
          <label style={styles.label}>Category</label>
          <select
            style={styles.input}
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.cat_name}
              </option>
            ))}
          </select>
          <label style={styles.label}>Location Found</label>
          <select
            style={styles.input}
            name="location_found"
            value={form.location_found}
            onChange={handleChange}
          >
            <option value="">-- Select Location --</option>
            {FAST_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {form.location_found === "Other" && (
            <div style={{ marginTop: "8px" }}>
              <label style={styles.label}>Describe the Location</label>
              <input
                style={styles.input}
                name="location_other"
                placeholder="e.g. Near the main gate..."
                value={form.location_other}
                onChange={handleChange}
              />
            </div>
          )}
          <label style={styles.label}>Date & Time Found</label>
          <input
            style={styles.input}
            type="datetime-local"
            name="found_at"
            value={form.found_at}
            onChange={handleChange}
          />
          <button style={styles.button} onClick={handleSubmit}>
            Register Item
          </button>
        </div>
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
    maxWidth: "560px",
    height: "fit-content",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
  },
  title: { margin: 0, color: "#1a1a2e", fontSize: "20px" },
  staffBadge: { fontSize: "13px", color: "#888" },
  backBtn: {
    background: "none",
    border: "1px solid #ddd",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    color: "#555",
  },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "2px",
  },
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
    minHeight: "100px",
    resize: "vertical",
  },
  button: {
    padding: "13px",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "8px",
  },
  successBox: {
    backgroundColor: "#e6f4ea",
    color: "#2d7a3a",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "16px",
  },
  errorBox: {
    backgroundColor: "#fdecea",
    color: "#c0392b",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "16px",
  },
};
