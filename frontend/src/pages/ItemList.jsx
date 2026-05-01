import { useEffect, useState } from "react";
import { getItems, getCategories, searchItems } from "../api/client";

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

const CAN_REGISTER = ["staff", "admin"];
const CAN_ADMIN = ["admin"];
const CAN_CLAIM = ["student", "faculty"];
const CAN_MYCLAIMS = ["student", "faculty"];
const CAN_NOTIF = ["student", "faculty"];

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
    getItems().then((r) => setItems(r.data));
    getCategories().then((r) => setCategories(r.data));
  }, []);

  const handleSearch = async () => {
    const r = await searchItems(keyword, categoryId || null, location);
    setItems(r.data);
    setIsFiltered(true);
  };

  const handleReset = async () => {
    setKeyword("");
    setCategoryId("");
    setLocation("");
    setIsFiltered(false);
    const r = await getItems();
    setItems(r.data);
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
        <div style={s.navRight}>
          {CAN_REGISTER.includes(user.role) && (
            <button style={s.nbPrimary} onClick={onRegister}>
              + Register Item
            </button>
          )}
          {CAN_ADMIN.includes(user.role) && (
            <button style={s.nbGhost} onClick={onAdmin}>
              Admin Dashboard
            </button>
          )}
          {CAN_MYCLAIMS.includes(user.role) && (
            <button style={s.nbGhost} onClick={onMyClaims}>
              My Claims
            </button>
          )}
          {CAN_NOTIF.includes(user.role) && (
            <button style={s.nbGhost} onClick={onNotifications}>
              Notifications
            </button>
          )}
          <span style={s.userLabel}>
            {user.name} ({user.role})
          </span>
          <button style={s.nbOutline} onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* ── Body ── */}
      <div style={s.body}>
        {/* Filter bar */}
        <div style={s.filterBar}>
          <input
            style={s.searchBox}
            placeholder="Search by title or description..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <select
            style={s.sel}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.category_id} value={c.category_id}>
                {c.cat_name}
              </option>
            ))}
          </select>
          <select
            style={s.sel}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {FAST_LOCATIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <button style={s.searchBtn} onClick={handleSearch}>
            Search
          </button>
          {isFiltered && (
            <button style={s.resetBtn} onClick={handleReset}>
              ✕ Reset
            </button>
          )}
        </div>

        {/* Stats row */}
        <div style={s.statsRow}>
          {[
            { val: items.length, lbl: "Items available" },
            {
              val: items.filter((i) => i.status === "claimed").length,
              lbl: "Claimed",
            },
            {
              val: items.filter((i) => {
                const d = new Date(i.registered_at);
                return d.toDateString() === new Date().toDateString();
              }).length,
              lbl: "Added today",
            },
          ].map(({ val, lbl }) => (
            <div key={lbl} style={s.statCard}>
              <div style={s.statVal}>{val}</div>
              <div style={s.statLbl}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Result count */}
        {isFiltered && (
          <p style={s.resultCount}>
            {items.length} result{items.length !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Section label */}
        <p style={s.sectionLabel}>Available items</p>

        {/* Empty state */}
        {items.length === 0 ? (
          <div style={s.emptyBox}>
            <div style={s.emptyIcon}>🔍</div>
            <p style={s.emptyText}>
              {isFiltered
                ? "No items match your search."
                : "No items registered yet."}
            </p>
            {isFiltered && (
              <button style={s.resetBtn} onClick={handleReset}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div style={s.grid}>
            {items.map((item) => (
              <div key={item.item_id} style={s.card}>
                {item.category && <span style={s.catTag}>{item.category}</span>}
                <h3 style={s.cardTitle}>{item.title}</h3>
                <p style={s.cardDesc}>{item.description}</p>
                <p style={s.cardMeta}>📍 {item.location_found}</p>
                <p style={s.cardMeta}>
                  🕐 {new Date(item.found_at).toLocaleDateString()}
                </p>
                <div style={s.cardFooter}>
                  <span style={s.statusPill}>{item.status}</span>
                  {CAN_CLAIM.includes(user.role) && (
                    <button style={s.claimBtn} onClick={() => onClaim(item)}>
                      Claim This
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
  navRight: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  nbGhost: {
    padding: "5px 12px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: "500",
    cursor: "pointer",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "none",
  },
  nbPrimary: {
    padding: "5px 12px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: "500",
    cursor: "pointer",
    background: "#1a9e75",
    color: "#fff",
    border: "none",
  },
  nbOutline: {
    padding: "5px 12px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: "500",
    cursor: "pointer",
    background: "transparent",
    color: "#f0a07a",
    border: "0.5px solid #f0a07a",
  },
  userLabel: { color: "rgba(255,255,255,0.6)", fontSize: 11 },
  body: { padding: 24 },
  filterBar: {
    backgroundColor: "#fff",
    borderRadius: 10,
    border: "0.5px solid #c8d8f0",
    padding: "14px 16px",
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  searchBox: {
    flex: 2,
    minWidth: 160,
    padding: "8px 12px",
    borderRadius: 7,
    border: "0.5px solid #c8d8f0",
    fontSize: 13,
    color: "#1a1a2e",
    backgroundColor: "#f8faff",
    outline: "none",
  },
  sel: {
    flex: 1,
    minWidth: 130,
    padding: "8px 10px",
    borderRadius: 7,
    border: "0.5px solid #c8d8f0",
    fontSize: 13,
    color: "#4a5878",
    backgroundColor: "#f8faff",
  },
  searchBtn: {
    padding: "8px 18px",
    backgroundColor: "#0c2d6b",
    color: "#fff",
    border: "none",
    borderRadius: 7,
    fontSize: 13,
    fontWeight: "500",
    cursor: "pointer",
  },
  resetBtn: {
    padding: "8px 14px",
    backgroundColor: "#fff",
    color: "#a32d2d",
    border: "0.5px solid #a32d2d",
    borderRadius: 7,
    fontSize: 13,
    cursor: "pointer",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    border: "0.5px solid #c8d8f0",
    padding: "12px 14px",
  },
  statVal: { fontSize: 24, fontWeight: "500", color: "#0c2d6b" },
  statLbl: { fontSize: 11, color: "#6b7a99", marginTop: 2 },
  resultCount: { color: "#6b7a99", fontSize: 13, marginBottom: 12 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#4a5878",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    border: "0.5px solid #c8d8f0",
    padding: 16,
  },
  catTag: {
    display: "inline-block",
    padding: "2px 9px",
    borderRadius: 20,
    backgroundColor: "#e6edf9",
    color: "#0c2d6b",
    fontSize: 10,
    fontWeight: "500",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: "#6b7a99",
    marginBottom: 8,
    lineHeight: 1.5,
  },
  cardMeta: { fontSize: 11, color: "#9aa5be", marginBottom: 2 },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTop: "0.5px solid #eef2f9",
  },
  statusPill: {
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 10,
    fontWeight: "500",
    backgroundColor: "#e6f4ea",
    color: "#27500a",
  },
  claimBtn: {
    padding: "5px 13px",
    backgroundColor: "#0c2d6b",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 11,
    cursor: "pointer",
  },
  emptyBox: { textAlign: "center", marginTop: 80 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { color: "#9aa5be", fontSize: 15, marginBottom: 16 },
};
