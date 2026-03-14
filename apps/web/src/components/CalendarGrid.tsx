import { DAYS, CATEGORY_COLORS, SUNDAY_COLOR, SATURDAY_COLOR, SELECTED_BG } from "../constants";
import type { EventMap } from "../types";

interface CalendarGridProps {
  year: number;
  month: number;
  selectedDate: number;
  events: EventMap;
  onSelectDate: (day: number) => void;
}

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

export default function CalendarGrid({ year, month, selectedDate, events, onSelectDate }: CalendarGridProps) {
  const today = new Date();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const getEventKey = (d: number) => `${year}-${month + 1}-${d}`;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <>
      {/* Day headers */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
        padding: "28px 20px 8px", gap: 0,
      }}>
        {DAYS.map((d, i) => (
          <div key={d} style={{
            textAlign: "center",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: 2,
            color: i === 0 ? SUNDAY_COLOR : i === 6 ? SATURDAY_COLOR : "#bbb",
            textTransform: "uppercase",
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
        padding: "0 20px", gap: 0,
      }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={`empty-${i}`} />;

          const dayEvents = events[getEventKey(d)] || [];
          const isSel = d === selectedDate;
          const isTdy = isToday(d);
          const isSunday = i % 7 === 0;
          const isSaturday = i % 7 === 6;

          return (
            <button
              key={d}
              onClick={() => onSelectDate(d)}
              style={{
                background: isSel ? SELECTED_BG : "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "10px 0 6px",
                borderRadius: 12,
                transition: "all 0.15s ease",
                position: "relative",
              }}
            >
              <span style={{
                fontSize: 18,
                fontWeight: isTdy ? 700 : isSel ? 500 : 300,
                color: isSunday ? SUNDAY_COLOR : isSaturday ? SATURDAY_COLOR : "#000",
                lineHeight: 1.2,
                fontVariantNumeric: "tabular-nums",
              }}>
                {d}
              </span>
              <div style={{
                display: "flex", gap: 3, marginTop: 5, minHeight: 6, justifyContent: "center",
              }}>
                {dayEvents.slice(0, 3).map((ev, j) => (
                  <span key={j} style={{
                    display: "inline-block",
                    width: 4, height: 4, borderRadius: "50%",
                    background: CATEGORY_COLORS[ev.category].solid,
                  }} />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
