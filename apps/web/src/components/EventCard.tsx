import { CATEGORY_COLORS, CATEGORY_LABELS } from "../constants";
import type { CalendarEvent } from "../types";

interface EventCardProps {
  event: CalendarEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const colors = CATEGORY_COLORS[event.category];

  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 16px",
        background: colors.light,
        borderRadius: 12,
        borderLeft: `3px solid ${colors.solid}`,
        cursor: "pointer",
      }}
    >
      <div>
        <div style={{
          fontSize: 11, fontWeight: 600, color: "#aaa",
          letterSpacing: 1, marginBottom: 2,
          fontVariantNumeric: "tabular-nums",
        }}>
          {event.time}
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
      <div style={{ marginLeft: "auto" }}>
        <span style={{
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: 2,
          color: colors.solid,
          textTransform: "uppercase",
        }}>
          {CATEGORY_LABELS[event.category]}
        </span>
      </div>
    </div>
  );
}
