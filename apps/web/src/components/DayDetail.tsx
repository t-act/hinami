import { DAYS } from "../constants";
import type { CalendarEvent } from "../types";
import EventCard from "./EventCard";
import Legend from "./Legend";

interface DayDetailProps {
  year: number;
  month: number;
  date: number;
  events: CalendarEvent[];
  onAddClick: () => void;
}

export default function DayDetail({ year, month, date, events, onAddClick }: DayDetailProps) {
  const dayOfWeek = new Date(year, month, date).getDay();

  return (
    <div style={{ padding: "20px 28px 120px" }}>
      <div style={{
        display: "flex", alignItems: "baseline", justifyContent: "space-between",
        marginBottom: 20,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{
            fontSize: 40, fontWeight: 370, lineHeight: 1, fontVariantNumeric: "tabular-nums",
          }}>
            {date}
          </span>
          <span style={{
            fontSize: 12, fontWeight: 600, letterSpacing: 3,
            color: "#aaa", textTransform: "uppercase",
          }}>
            {DAYS[dayOfWeek]}
          </span>
        </div>
        <button
          onClick={onAddClick}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "#000", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.15s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {events.length === 0 ? (
        <div style={{
          fontSize: 13, color: "#ccc", fontWeight: 400,
          letterSpacing: 1, padding: "16px 0",
        }}>
          予定はありません
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {events.map((ev, i) => (
            <EventCard key={i} event={ev} />
          ))}
        </div>
      )}

      <Legend />
    </div>
  );
}
