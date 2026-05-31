export const c = {
  white: "#fafafa",
  sky: "#bde3f7",
  blue: "#1178c2",
  dark: "#1e2530",
  blueLight: "#e8f4fd",
  blueMid: "#4a9fd4",
  blueDark: "#0d5f9e",
  blueXDark: "#0a4a7a",
  skyLight: "#f0f8fe",
  text: "#1e2530",
  text2: "#4a5568",
  text3: "#8a97aa",
  border: "#d8eaf6",
  border2: "#b8d8f0",
  surface: "#ffffff",
  surface2: "#f0f8fe",
  surface3: "#e8f4fd",
  green: "#0ea96a",
  greenBg: "#e6f9f0",
  amber: "#e07c00",
  amberBg: "#fff4e0",
  red: "#d93025",
  redBg: "#fdecea",
  fh: "'Syne', sans-serif",
  fb: "'Inter', sans-serif",
};

export const tr = "all 0.2s cubic-bezier(0.4,0,0.2,1)";

export const g = {
  field: { marginBottom: 18 },

  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: "#4a5568",
    letterSpacing: "0.7px",
    textTransform: "uppercase",
    marginBottom: 7,
  },

  input: {
    width: "100%",
    padding: "11px 14px",
    background: "#ffffff",
    border: "1.5px solid #d8eaf6",
    borderRadius: 8,
    fontSize: 14,
    color: "#1e2530",
    transition: tr,
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    padding: "11px 14px",
    background: "#ffffff",
    border: "1.5px solid #d8eaf6",
    borderRadius: 8,
    fontSize: 14,
    color: "#1e2530",
    minHeight: 110,
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
    transition: tr,
  },

  btnPrimary: {
    width: "100%",
    padding: "13px",
    background: "#1178c2",
    color: "#ffffff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.3px",
    cursor: "pointer",
    transition: tr,
    fontFamily: "'Syne', sans-serif",
    boxShadow: "0 4px 16px rgba(17,120,194,0.30)",
  },

  card: {
    background: "#ffffff",
    border: "1.5px solid #e8f4fd",
    borderRadius: 12,
    padding: "22px 24px",
    boxShadow: "0 2px 12px rgba(17,120,194,0.07)",
  },

  sectionHead: {
    fontSize: 11,
    fontWeight: 600,
    color: "#8a97aa",
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    marginBottom: 14,
  },

  pageTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 24,
    fontWeight: 700,
    color: "#1e2530",
    letterSpacing: "-0.3px",
  },

  pageSub: {
    fontSize: 13,
    color: "#8a97aa",
    marginTop: 5,
  },

  divider: {
    height: 1,
    background: "#e8f4fd",
    margin: "20px 0",
  },

  badge: (bg, color) => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 12px",
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 600,
    background: bg,
    color: color,
    letterSpacing: "0.3px",
    whiteSpace: "nowrap",
  }),

  alert: (type) => {
    const map = {
      success: { bg: "#e6f9f0", border: "#9fe8c8", color: "#0a7a4a" },
      error: { bg: "#fdecea", border: "#f5b8b4", color: "#c0251a" },
      warn: { bg: "#fff4e0", border: "#f5d08a", color: "#a05800" },
    };
    const m = map[type] || map.success;
    return {
      padding: "12px 16px",
      background: m.bg,
      border: `1.5px solid ${m.border}`,
      borderRadius: 8,
      fontSize: 13,
      color: m.color,
      marginBottom: 18,
      display: "flex",
      alignItems: "center",
      gap: 10,
    };
  },

  empty: { textAlign: "center", padding: "80px 24px" },
  emptyIcon: { fontSize: 48, marginBottom: 16, display: "block", opacity: 0.5 },
  emptyTitle: {
    fontSize: 17,
    fontWeight: 600,
    color: "#1e2530",
    fontFamily: "'Syne', sans-serif",
    marginBottom: 8,
  },
  emptySub: { fontSize: 13, color: "#8a97aa" },

  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))",
    gap: 14,
    marginBottom: 28,
  },

  statCard: (accent) => ({
    background: "#ffffff",
    border: "1.5px solid #e8f4fd",
    borderRadius: 12,
    padding: "18px 20px",
    borderTop: `3px solid ${accent}`,
    boxShadow: "0 2px 12px rgba(17,120,194,0.07)",
  }),

  statVal: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 30,
    fontWeight: 800,
    color: "#1e2530",
    lineHeight: 1,
    marginBottom: 6,
  },
  statLbl: { fontSize: 12, color: "#8a97aa" },
};
