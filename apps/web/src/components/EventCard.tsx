import { CATEGORY_COLORS, CATEGORY_LABELS } from "../constants";
import type { CalendarEvent } from "../types";

interface EventCardProps {
  event: CalendarEvent;
  onDelete?: (id: string) => void;
}

export default function EventCard({ event, onDelete }: EventCardProps) {
  const colors = CATEGORY_COLORS[event.category];

  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 16px",
        background: colors.light,
        borderRadius: 12,
        borderLeft: `3px solid ${colors.solid}`,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 11, fontWeight: 600, color: "#aaa",
          letterSpacing: 1, marginBottom: 2,
          fontVariantNumeric: "tabular-nums",
        }}>
          {event.start_time ?? ""}
        </div>
        <div style={{
          fontSize: 15,
          fontWeight: event.category === "together" ? 600 : 400,
          color: "#000",
          letterSpacing: 0.5,
        }}>
          {event.title}
        </div>
      </div>
      <span style={{
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: 2,
        color: colors.solid,
        textTransform: "uppercase",
        flexShrink: 0,
      }}>
        {CATEGORY_LABELS[event.category]}
      </span>
      {onDelete && (
        <button
          onClick={() => onDelete(event.id)}
          style={{
            flexShrink: 0,
            width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "transparent", border: "none",
            cursor: "pointer", borderRadius: 6,
            color: "#ccc",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#e57373")}
          onMouseLeave={e => (e.currentTarget.style.color = "#ccc")}
          aria-label="削除"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 4h10M5 4V2.5h4V4M6 6.5v4M8 6.5v4M3 4l.8 7.5h6.4L11 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
