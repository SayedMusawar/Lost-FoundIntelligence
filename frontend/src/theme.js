export const c = {
  bg: "#080b12",
  bg2: "#0e1220",
  bg3: "#131929",
  surface: "#181f30",
  surface2: "#1e2840",
  border: "rgba(255,255,255,0.06)",
  border2: "rgba(255,255,255,0.10)",
  teal: "#00e5b0",
  teal2: "#00c49a",
  tealGlow: "rgba(0,229,176,0.15)",
  amber: "#f5a623",
  red: "#ff4d4d",
  green: "#00d68f",
  blue: "#4d9fff",
  text: "#eef0f8",
  text2: "#7d8aaa",
  text3: "#404d6a",
  fh: "'Syne', sans-serif",
  fb: "'Inter', sans-serif",
};

export const tr = "all 0.2s cubic-bezier(0.4,0,0.2,1)";

// Reusable style blocks
export const g = {
  // Form field wrapper
  field: { marginBottom: 18 },

  // Label
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: "#7d8aaa",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    marginBottom: 7,
  },

  // Input / Select
  input: {
    width: "100%",
    padding: "11px 14px",
    background: "#131929",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8,
    fontSize: 14,
    color: "#eef0f8",
    transition: tr,
    boxSizing: "border-box",
  },

  // Textarea
  textarea: {
    width: "100%",
    padding: "11px 14px",
    background: "#131929",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8,
    fontSize: 14,
    color: "#eef0f8",
    minHeight: 110,
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
  },

  // Primary button
  btnPrimary: {
    width: "100%",
    padding: "13px",
    background: "#00e5b0",
    color: "#080b12",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.3px",
    cursor: "pointer",
    transition: tr,
  },

  // Card
  card: {
    background: "#181f30",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: "22px 24px",
  },

  // Section heading
  sectionHead: {
    fontSize: 11,
    fontWeight: 600,
    color: "#404d6a",
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    marginBottom: 14,
  },

  // Page title
  pageTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 24,
    fontWeight: 700,
    color: "#eef0f8",
    letterSpacing: "-0.3px",
  },

  pageSub: {
    fontSize: 13,
    color: "#7d8aaa",
    marginTop: 5,
  },

  // Divider
  divider: {
    height: 1,
    background: "rgba(255,255,255,0.06)",
    margin: "20px 0",
  },

  // Badge
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

  // Toast alert
  alert: (type) => {
    const map = {
      success: {
        bg: "rgba(0,214,143,0.12)",
        border: "rgba(0,214,143,0.25)",
        color: "#00d68f",
      },
      error: {
        bg: "rgba(255,77,77,0.12)",
        border: "rgba(255,77,77,0.25)",
        color: "#ff6b6b",
      },
      warn: {
        bg: "rgba(245,166,35,0.12)",
        border: "rgba(245,166,35,0.25)",
        color: "#f5a623",
      },
    };
    const m = map[type] || map.success;
    return {
      padding: "12px 16px",
      background: m.bg,
      border: `1px solid ${m.border}`,
      borderRadius: 8,
      fontSize: 13,
      color: m.color,
      marginBottom: 18,
      display: "flex",
      alignItems: "center",
      gap: 10,
    };
  },

  // Empty state
  empty: {
    textAlign: "center",
    padding: "80px 24px",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    display: "block",
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: 600,
    color: "#eef0f8",
    fontFamily: "'Syne', sans-serif",
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 13,
    color: "#7d8aaa",
  },

  // Stats row
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 12,
    marginBottom: 28,
  },
  statCard: (accentColor) => ({
    background: "#181f30",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 10,
    padding: "16px 18px",
    borderTop: `2px solid ${accentColor}`,
  }),
  statVal: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 28,
    fontWeight: 700,
    color: "#eef0f8",
    lineHeight: 1,
    marginBottom: 6,
  },
  statLbl: {
    fontSize: 11,
    color: "#7d8aaa",
  },
};
