import { useEffect, useState } from "react";
import { getItems, getCategories, searchItems } from "../api/client";
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
];

const STATUS = {
  found: { bg: "rgba(0,229,176,0.12)", color: "#00e5b0", dot: "#00e5b0" },
  claimed: { bg: "rgba(77,159,255,0.12)", color: "#4d9fff", dot: "#4d9fff" },
  closed: { bg: "rgba(125,138,170,0.12)", color: "#7d8aaa", dot: "#7d8aaa" },
  expired: { bg: "rgba(255,77,77,0.12)", color: "#ff6b6b", dot: "#ff6b6b" },
};

export default function ItemList({ user, onClaim }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [catId, setCatId] = useState("");
  const [location, setLocation] = useState("");
  const [filtered, setFiltered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid"); // grid | list

  useEffect(() => {
    Promise.all([getItems(), getCategories()]).then(([ir, cr]) => {
      setItems(ir.data);
      setCategories(cr.data);
      setLoading(false);
    });
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    const r = await searchItems(keyword, catId || null, location);
    setItems(r.data);
    setFiltered(true);
    setLoading(false);
  };

  const handleReset = async () => {
    setKeyword("");
    setCatId("");
    setLocation("");
    setFiltered(false);
    setLoading(true);
    const r = await getItems();
    setItems(r.data);
    setLoading(false);
  };

  const claimed = items.filter((i) => i.status === "claimed").length;
  const today = items.filter(
    (i) =>
      new Date(i.registered_at).toDateString() === new Date().toDateString(),
  ).length;
  const canClaim = ["student", "faculty"].includes(user.role);

  const inputStyle = {
    flex: 1,
    minWidth: 120,
    padding: "10px 14px",
    background: c.bg3,
    border: `1px solid ${c.border}`,
    borderRadius: 8,
    fontSize: 13,
    color: c.text,
    transition: tr,
    boxSizing: "border-box",
  };

  return (
    <div className="fade-up">
      {/* Page header */}
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
          Lost & Found Items
        </h1>
        <p style={{ fontSize: 13, color: c.text2 }}>
          Browse items found on campus and submit a claim
        </p>
      </div>

      {/* Stats */}
      <div style={g.statsRow}>
        {[
          { val: items.length, lbl: "Total Items", accent: c.teal },
          { val: claimed, lbl: "Already Claimed", accent: c.blue },
          { val: today, lbl: "Added Today", accent: c.amber },
          { val: categories.length, lbl: "Categories", accent: c.text2 },
        ].map(({ val, lbl, accent }) => (
          <div key={lbl} style={g.statCard(accent)}>
            <div
              style={{
                ...g.statVal,
                color: accent === c.teal ? c.teal : c.text,
              }}
            >
              {val}
            </div>
            <div style={g.statLbl}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div
        style={{
          background: c.surface,
          border: `1px solid ${c.border}`,
          borderRadius: 12,
          padding: "16px 18px",
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <input
          style={{ ...inputStyle, flex: 2, minWidth: 180 }}
          placeholder="Search items…"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <select
          style={{ ...inputStyle }}
          value={catId}
          onChange={(e) => setCatId(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.cat_name}
            </option>
          ))}
        </select>
        <select
          style={{ ...inputStyle }}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {LOCATIONS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 22px",
            background: c.teal,
            color: c.bg,
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            transition: tr,
            whiteSpace: "nowrap",
            fontFamily: c.fh,
          }}
        >
          Search
        </button>
        {filtered && (
          <button
            onClick={handleReset}
            style={{
              padding: "10px 16px",
              background: "transparent",
              border: `1px solid rgba(255,77,77,0.3)`,
              borderRadius: 8,
              color: "#ff6b6b",
              fontSize: 13,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            ✕ Reset
          </button>
        )}
        {/* View toggle */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {["grid", "list"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                width: 34,
                height: 34,
                background: view === v ? c.surface2 : "transparent",
                border: `1px solid ${view === v ? c.border2 : c.border}`,
                borderRadius: 6,
                color: view === v ? c.text : c.text2,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {v === "grid" ? "⊞" : "≡"}
            </button>
          ))}
        </div>
      </div>

      {/* Results label */}
      <div style={{ marginBottom: 16 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: c.text3,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          {filtered
            ? `${items.length} result${items.length !== 1 ? "s" : ""}`
            : "All Items"}
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div style={g.empty}>
          <div
            style={{
              width: 36,
              height: 36,
              border: `3px solid ${c.teal}`,
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={g.emptySub}>Loading items…</p>
        </div>
      )}

      {/* Empty */}
      {!loading && items.length === 0 && (
        <div style={g.empty}>
          <span style={g.emptyIcon}>🔍</span>
          <p style={g.emptyTitle}>
            {filtered ? "No results found" : "No items registered yet"}
          </p>
          <p style={g.emptySub}>
            {filtered ? "Try different filters." : "Check back later."}
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && items.length > 0 && view === "grid" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: 14,
          }}
        >
          {items.map((item, i) => {
            const sc = STATUS[item.status] || STATUS.found;
            return (
              <div
                key={item.item_id}
                className="fade-up"
                style={{
                  ...g.card,
                  display: "flex",
                  flexDirection: "column",
                  animationDelay: `${i * 0.04}s`,
                  transition: tr,
                  cursor: "default",
                }}
              >
                {/* Top row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  {item.category ? (
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 99,
                        background: "rgba(77,159,255,0.12)",
                        color: c.blue,
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    >
                      {item.category}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "4px 10px",
                      borderRadius: 99,
                      background: sc.bg,
                      color: sc.color,
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: sc.dot,
                        display: "inline-block",
                      }}
                    />
                    {item.status}
                  </span>
                </div>

                {/* Title & desc */}
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: c.text,
                    marginBottom: 8,
                    lineHeight: 1.35,
                    fontFamily: c.fh,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: c.text2,
                    lineHeight: 1.65,
                    flex: 1,
                    marginBottom: 14,
                  }}
                >
                  {item.description}
                </p>

                {/* Meta */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    fontSize: 11,
                    color: c.text3,
                    padding: "12px 0 14px",
                    borderTop: `1px solid ${c.border}`,
                    marginBottom: canClaim ? 14 : 0,
                  }}
                >
                  <span>📍 {item.location_found}</span>
                  <span>
                    🕐{" "}
                    {new Date(item.found_at).toLocaleDateString("en-PK", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Claim btn */}
                {canClaim && (
                  <button
                    onClick={() => onClaim(item)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "rgba(0,229,176,0.10)",
                      border: `1px solid rgba(0,229,176,0.22)`,
                      borderRadius: 8,
                      color: c.teal,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: tr,
                      fontFamily: c.fh,
                    }}
                  >
                    Claim This Item →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* List view */}
      {!loading && items.length > 0 && view === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item, i) => {
            const sc = STATUS[item.status] || STATUS.found;
            return (
              <div
                key={item.item_id}
                className="fade-up"
                style={{
                  ...g.card,
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                  animationDelay: `${i * 0.03}s`,
                }}
              >
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: c.text,
                        fontFamily: c.fh,
                      }}
                    >
                      {item.title}
                    </h3>
                    <span
                      style={{
                        ...g.badge(sc.bg, sc.color),
                        padding: "2px 8px",
                        fontSize: 10,
                      }}
                    >
                      {item.status}
                    </span>
                    {item.category && (
                      <span
                        style={{
                          ...g.badge("rgba(77,159,255,0.12)", c.blue),
                          padding: "2px 8px",
                          fontSize: 10,
                        }}
                      >
                        {item.category}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 11, color: c.text3 }}>
                    📍 {item.location_found} ·{" "}
                    {new Date(item.found_at).toLocaleDateString()}
                  </p>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: c.text2,
                    flex: 1,
                    minWidth: 160,
                  }}
                >
                  {item.description?.slice(0, 80)}
                  {item.description?.length > 80 ? "…" : ""}
                </p>
                {canClaim && (
                  <button
                    onClick={() => onClaim(item)}
                    style={{
                      padding: "8px 18px",
                      background: "rgba(0,229,176,0.10)",
                      border: `1px solid rgba(0,229,176,0.22)`,
                      borderRadius: 8,
                      color: c.teal,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Claim →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
