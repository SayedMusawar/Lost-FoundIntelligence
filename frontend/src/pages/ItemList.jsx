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
  found: { bg: "#e6f9f0", color: "#0a7a4a", dot: "#0ea96a" },
  claimed: { bg: "#e8f4fd", color: "#0d5f9e", dot: "#1178c2" },
  closed: { bg: "#f0f4f8", color: "#6b7a8a", dot: "#8a97aa" },
  expired: { bg: "#fdecea", color: "#d93025", dot: "#d93025" },
};

export default function ItemList({ user, onClaim }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [catId, setCatId] = useState("");
  const [location, setLocation] = useState("");
  const [filtered, setFiltered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");

  useEffect(() => {
    Promise.all([getItems(), getCategories()]).then(([ir, cr]) => {
      setItems(ir.data);
      setCategories(cr.data);
      setLoading(false);
    });
  }, []);

  const search = async () => {
    setLoading(true);
    const r = await searchItems(keyword, catId || null, location);
    setItems(r.data);
    setFiltered(true);
    setLoading(false);
  };

  const reset = async () => {
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

  return (
    <>
      <style>{`
        .items-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 28px;
        }
        .filter-bar {
          background: #fff;
          border: 1.5px solid #d8eaf6;
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          margin-bottom: 22px;
          box-shadow: 0 2px 8px rgba(17,120,194,0.06);
        }
        .filter-inp {
          flex: 2;
          min-width: 160px;
          padding: 10px 14px;
          background: #fff;
          border: 1.5px solid #d8eaf6;
          border-radius: 8px;
          font-size: 13px;
          color: #1e2530;
          transition: ${tr};
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }
        .filter-inp:focus {
          border-color: #1178c2;
          box-shadow: 0 0 0 3px rgba(17,120,194,0.1);
          outline: none;
        }
        .filter-sel {
          flex: 1;
          min-width: 130px;
          padding: 10px 14px;
          background: #fff;
          border: 1.5px solid #d8eaf6;
          border-radius: 8px;
          font-size: 13px;
          color: #4a5568;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }
        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
        }
        .item-card {
          background: #fff;
          border: 1.5px solid #d8eaf6;
          border-radius: 12px;
          padding: 18px 20px 16px;
          box-shadow: 0 2px 10px rgba(17,120,194,0.06);
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .item-card:hover {
          box-shadow: 0 6px 24px rgba(17,120,194,0.13);
          transform: translateY(-2px);
        }
        .view-toggle-btn {
          width: 34px; height: 34px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: ${tr};
          font-family: 'Inter', sans-serif;
        }

        @media (max-width: 900px) {
          .items-stats { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .items-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .filter-bar { padding: 12px; gap: 8px; }
          .filter-inp { min-width: 100%; flex: none; }
          .filter-sel { min-width: calc(50% - 4px); flex: none; }
          .items-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 400px) {
          .items-stats { grid-template-columns: 1fr 1fr; gap: 8px; }
          .filter-sel { min-width: 100%; }
        }
      `}</style>

      <div className="fade-up">
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontFamily: c.fh,
              fontSize: 24,
              fontWeight: 700,
              color: c.dark,
              marginBottom: 5,
            }}
          >
            Browse Lost & Found Items
          </h1>
          <p style={{ fontSize: 13, color: c.text3 }}>
            Items found on campus — submit a claim if something is yours
          </p>
        </div>

        {/* Stats */}
        <div className="items-stats">
          {[
            { val: items.length, lbl: "Total Items", accent: c.blue },
            { val: claimed, lbl: "Claimed", accent: c.blueMid },
            { val: today, lbl: "Added Today", accent: c.amber },
            { val: categories.length, lbl: "Categories", accent: c.text3 },
          ].map(({ val, lbl, accent }) => (
            <div key={lbl} style={g.statCard(accent)}>
              <div
                style={{
                  ...g.statVal,
                  fontSize: 26,
                  color: accent === c.blue ? c.blue : c.dark,
                }}
              >
                {val}
              </div>
              <div style={g.statLbl}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          <input
            className="filter-inp"
            style={{ flex: 2 }}
            placeholder="🔍  Search items…"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
          />
          <select
            className="filter-sel"
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
            className="filter-sel"
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
            onClick={search}
            style={{
              padding: "10px 20px",
              background: `linear-gradient(135deg,${c.blue},${c.blueDark})`,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 3px 12px rgba(17,120,194,0.3)",
              whiteSpace: "nowrap",
              fontFamily: c.fh,
            }}
          >
            Search
          </button>
          {filtered && (
            <button
              onClick={reset}
              style={{
                padding: "10px 14px",
                background: c.redBg,
                border: "1.5px solid #f5b8b4",
                borderRadius: 8,
                color: c.red,
                fontSize: 13,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              ✕ Reset
            </button>
          )}
          <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            {["grid", "list"].map((v) => (
              <button
                key={v}
                className="view-toggle-btn"
                onClick={() => setView(v)}
                style={{
                  background: view === v ? c.blueLight : "transparent",
                  border: `1.5px solid ${view === v ? c.border2 : c.border}`,
                  color: view === v ? c.blue : c.text3,
                }}
              >
                {v === "grid" ? "⊞" : "≡"}
              </button>
            ))}
          </div>
        </div>

        {/* Label */}
        <div style={{ ...g.sectionHead, marginBottom: 14 }}>
          {filtered
            ? `${items.length} result${items.length !== 1 ? "s" : ""} found`
            : "All Items"}
        </div>

        {/* Spinner */}
        {loading && (
          <div style={g.empty}>
            <div
              style={{
                width: 34,
                height: 34,
                border: `3px solid ${c.blue}`,
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 14px",
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
              {filtered ? "No results found" : "No items yet"}
            </p>
            <p style={g.emptySub}>
              {filtered
                ? "Try different search terms."
                : "Items will appear once registered."}
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && items.length > 0 && view === "grid" && (
          <div className="items-grid">
            {items.map((item, i) => {
              const sc = STATUS[item.status] || STATUS.found;
              return (
                <div
                  key={item.item_id}
                  className="item-card fade-up"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    {item.category ? (
                      <span style={g.badge(c.blueLight, c.blueDark)}>
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
                        fontWeight: 700,
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
                  <h3
                    style={{
                      fontFamily: c.fh,
                      fontSize: 15,
                      fontWeight: 700,
                      color: c.dark,
                      marginBottom: 7,
                      lineHeight: 1.3,
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
                      marginBottom: 12,
                    }}
                  >
                    {item.description}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                      fontSize: 11,
                      color: c.text3,
                      padding: "10px 0 12px",
                      borderTop: `1px solid ${c.border}`,
                      marginBottom: canClaim ? 12 : 0,
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
                  {canClaim && (
                    <button
                      onClick={() => onClaim(item)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        background: `linear-gradient(135deg,${c.blue},${c.blueDark})`,
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: c.fh,
                        boxShadow: "0 3px 10px rgba(17,120,194,0.25)",
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

        {/* List */}
        {!loading && items.length > 0 && view === "list" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map((item, i) => {
              const sc = STATUS[item.status] || STATUS.found;
              return (
                <div
                  key={item.item_id}
                  className="fade-up"
                  style={{
                    background: "#fff",
                    border: `1.5px solid ${c.border}`,
                    borderRadius: 10,
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    flexWrap: "wrap",
                    boxShadow: "0 1px 6px rgba(17,120,194,0.05)",
                    animationDelay: `${i * 0.03}s`,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        marginBottom: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: c.fh,
                          fontSize: 14,
                          fontWeight: 700,
                          color: c.dark,
                        }}
                      >
                        {item.title}
                      </h3>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 99,
                          background: sc.bg,
                          color: sc.color,
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        {item.status}
                      </span>
                      {item.category && (
                        <span style={g.badge(c.blueLight, c.blueDark)}>
                          {item.category}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 11, color: c.text3 }}>
                      📍 {item.location_found} · 🕐{" "}
                      {new Date(item.found_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: c.text2,
                      flex: 1,
                      minWidth: 140,
                    }}
                  >
                    {item.description?.slice(0, 70)}
                    {item.description?.length > 70 ? "…" : ""}
                  </p>
                  {canClaim && (
                    <button
                      onClick={() => onClaim(item)}
                      style={{
                        padding: "8px 16px",
                        background: c.blueLight,
                        border: `1.5px solid ${c.border2}`,
                        borderRadius: 8,
                        color: c.blue,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        fontFamily: c.fh,
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
    </>
  );
}
