import { useEffect, useState } from "react";
import { getItems, getCategories, searchItems } from "../api/client";

const CAN_REGISTER = ["staff", "admin"];
const CAN_ADMIN = ["admin"];
const CAN_CLAIM = ["student", "faculty"];
const CAN_MYCLAIMS = ["student", "faculty"];
const CAN_NOTIFICATIONS = ["student", "faculty"];

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
];

export default function ItemList({
  user,
  onRegister,
  onClaim,
  onAdmin,
  onLogout,
  onMyClaims,
  onNotifications,
}) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [location, setLocation] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    getItems().then((res) => setItems(res.data));
    getCategories().then((res) => setCategories(res.data));
  }, []);

  const handleSearch = async () => {
    const res = await searchItems(keyword, categoryId || null, location);
    setItems(res.data);
    setIsFiltered(true);
  };

  const handleReset = async () => {
    setKeyword("");
    setCategoryId("");
    setLocation("");
    setIsFiltered(false);
    const res = await getItems();
    setItems(res.data);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Lost & Found Items</h2>
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {CAN_REGISTER.includes(user.role) && (
            <button style={styles.registerBtn} onClick={onRegister}>
              + Register Found Item
            </button>
          )}
          {CAN_ADMIN.includes(user.role) && (
            <button style={styles.adminBtn} onClick={onAdmin}>
              🛡 Admin Dashboard
            </button>
          )}
          {CAN_MYCLAIMS.includes(user.role) && (
            <button style={styles.myClaimsBtn} onClick={onMyClaims}>
              📋 My Claims
            </button>
          )}
          {CAN_NOTIFICATIONS.includes(user.role) && (
            <button style={styles.notifBtn} onClick={onNotifications}>
              🔔 Notifications
            </button>
          )}
          <span style={styles.user}>
            Logged in as: <b>{user.name}</b> ({user.role})
          </span>
          <button style={styles.logoutBtn} onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div style={styles.filterBar}>
        <input
          style={styles.filterInput}
          placeholder="🔍 Search by title or description..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <select
          style={styles.filterSelect}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.cat_name}
            </option>
          ))}
        </select>
        <select
          style={styles.filterSelect}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {FAST_LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <button style={styles.searchBtn} onClick={handleSearch}>
          Search
        </button>
        {isFiltered && (
          <button style={styles.resetBtn} onClick={handleReset}>
            ✕ Reset
          </button>
        )}
      </div>

      {isFiltered && (
        <p style={styles.resultCount}>
          {items.length} result{items.length !== 1 ? "s" : ""} found
        </p>
      )}

      {items.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyIcon}>🔍</p>
          <p style={styles.emptyText}>
            {isFiltered
              ? "No items match your search."
              : "No items registered yet."}
          </p>
          {isFiltered && (
            <button style={styles.resetBtn} onClick={handleReset}>
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div style={styles.grid}>
          {items.map((item) => (
            <div key={item.item_id} style={styles.card}>
              {item.category && (
                <span style={styles.categoryTag}>{item.category}</span>
              )}
              <h3 style={styles.itemTitle}>{item.title}</h3>
              <p style={styles.desc}>{item.description}</p>
              <p style={styles.meta}>📍 {item.location_found}</p>
              <p style={styles.meta}>
                🕐 {new Date(item.found_at).toLocaleDateString()}
              </p>
              <div style={styles.cardFooter}>
                <span style={styles.badge}>{item.status}</span>
                {CAN_CLAIM.includes(user.role) && (
                  <button style={styles.claimBtn} onClick={() => onClaim(item)}>
                    Claim This
                  </button>
                )}
              </div>
            </div>
          ))}
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  },
  title: { margin: 0, color: "#1a1a2e" },
  user: { color: "#555", fontSize: "14px" },
  filterBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "10px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
  },
  filterInput: {
    flex: 2,
    minWidth: "200px",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "white",
    color: "#333",
  },
  filterSelect: {
    flex: 1,
    minWidth: "140px",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "white",
    color: "#333",
  },
  searchBtn: {
    padding: "10px 20px",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
  },
  resetBtn: {
    padding: "10px 16px",
    backgroundColor: "white",
    color: "#ea4335",
    border: "1px solid #ea4335",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
  },
  resultCount: { color: "#555", fontSize: "14px", marginBottom: "16px" },
  emptyBox: { textAlign: "center", marginTop: "60px" },
  emptyIcon: { fontSize: "48px", margin: "0 0 12px" },
  emptyText: { color: "#888", fontSize: "16px", marginBottom: "16px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
  },
  categoryTag: {
    display: "inline-block",
    marginBottom: "8px",
    padding: "3px 10px",
    backgroundColor: "#f0f4ff",
    color: "#3d5afe",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  itemTitle: { margin: "0 0 8px", color: "#1a1a2e" },
  desc: { color: "#555", fontSize: "14px", margin: "0 0 12px" },
  meta: { color: "#888", fontSize: "13px", margin: "4px 0" },
  badge: {
    display: "inline-block",
    marginTop: "8px",
    padding: "4px 10px",
    backgroundColor: "#e8f4fd",
    color: "#1a73e8",
    borderRadius: "20px",
    fontSize: "12px",
  },
  registerBtn: {
    padding: "8px 16px",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "12px",
  },
  claimBtn: {
    padding: "6px 14px",
    backgroundColor: "#34a853",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
  },
  adminBtn: {
    padding: "8px 16px",
    backgroundColor: "#1a1a2e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "white",
    color: "#ea4335",
    border: "1px solid #ea4335",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
  },
  myClaimsBtn: {
    padding: "8px 16px",
    backgroundColor: "#f8f9fa",
    color: "#1a1a2e",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
  },
  notifBtn: {
    padding: "8px 16px",
    backgroundColor: "white",
    color: "#1a1a2e",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
  },
};
