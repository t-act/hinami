import { MONTHS } from "../constants";

interface MonthHeaderProps {
  month: number;
  year: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function MonthHeader({ month, year, onPrev, onNext }: MonthHeaderProps) {
  return (
    <div style={{ padding: "32px 28px 0" }}>
      <div style={{
        display: "flex", alignItems: "baseline", justifyContent: "space-between",
      }}>
        <div>
          <div style={{
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: 3,
            lineHeight: 1,
            color: "#000",
            textTransform: "uppercase",
          }}>
            {MONTHS[month]}
          </div>
          <div style={{
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#aaa",
            marginTop: 4,
          }}>
            {year}
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <button onClick={onPrev} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 20, color: "#000", padding: 4, lineHeight: 1,
          }}>←</button>
          <button onClick={onNext} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 20, color: "#000", padding: 4, lineHeight: 1,
          }}>→</button>
        </div>
      </div>
    </div>
  );
}
