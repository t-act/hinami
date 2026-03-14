import { CATEGORY_COLORS, CATEGORY_LABELS } from "../constants";
import type { Category } from "../types";

const categories: Category[] = ["mine", "partner", "together"];

export default function Legend() {
  return (
    <div style={{
      display: "flex", gap: 20, marginTop: 28,
      paddingTop: 16, borderTop: "1px solid #f0f0f0",
    }}>
      {categories.map((cat) => (
        <div key={cat} style={{
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{
            display: "inline-block", width: 8, height: 8, borderRadius: "50%",
            background: CATEGORY_COLORS[cat].solid,
          }} />
          <span style={{
            fontSize: 10, fontWeight: 500, letterSpacing: 1, color: "#999",
          }}>
            {CATEGORY_LABELS[cat]}
          </span>
        </div>
      ))}
    </div>
  );
}
