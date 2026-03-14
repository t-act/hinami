interface NavItem {
  label: string;
  icon: React.ReactNode;
  active: boolean;
}

const items: NavItem[] = [
  {
    label: "カレンダー",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 9h18" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 2v4M15 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    active: true,
  },
  {
    label: "設定",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 2v2M11 18v2M2 11h2M18 11h2M4.93 4.93l1.41 1.41M15.66 15.66l1.41 1.41M4.93 17.07l1.41-1.41M15.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    active: false,
  },
];

export default function BottomNav() {
  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: 430,
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(20px)",
      borderTop: "1px solid #f0f0f0",
      display: "flex",
      justifyContent: "space-around",
      padding: "12px 0 28px",
    }}>
      {items.map(item => (
        <button key={item.label} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          color: item.active ? "#000" : "#999",
        }}>
          {item.icon}
          <span style={{
            fontSize: 9, fontWeight: 600, letterSpacing: 1.5,
            textTransform: "uppercase",
          }}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
