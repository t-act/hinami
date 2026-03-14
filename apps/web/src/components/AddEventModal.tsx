import { useState } from "react";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "../constants";
import type { Category, CalendarEvent } from "../types";

interface AddEventModalProps {
  onClose: () => void;
  onAdd: (event: CalendarEvent) => void;
}

const categories: Category[] = ["mine", "partner", "together"];

export default function AddEventModal({ onClose, onAdd }: AddEventModalProps) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("mine");

  const handleSubmit = () => {
    if (title.trim() && time) {
      onAdd({ title: title.trim(), time, category: selectedCategory });
    }
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 430,
          background: "#fff",
          borderRadius: "20px 20px 0 0",
          padding: "28px 28px 40px",
          animation: "slideUp 0.25s ease-out",
        }}
      >
        <div style={{
          width: 36, height: 4, borderRadius: 2, background: "#e0e0e0",
          margin: "0 auto 24px",
        }} />
        <div style={{
          fontSize: 20, fontWeight: 300, letterSpacing: -0.5, marginBottom: 24,
        }}>
          予定を追加
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{
            fontSize: 9, fontWeight: 600, letterSpacing: 2,
            color: "#aaa", textTransform: "uppercase",
            display: "block", marginBottom: 8,
          }}>タイトル</label>
          <input
            type="text"
            placeholder="予定の名前"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              width: "100%", padding: "12px 0",
              border: "none", borderBottom: "1px solid #e0e0e0",
              fontSize: 16, fontWeight: 300,
              outline: "none", background: "transparent",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{
            fontSize: 9, fontWeight: 600, letterSpacing: 2,
            color: "#aaa", textTransform: "uppercase",
            display: "block", marginBottom: 8,
          }}>時間</label>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            style={{
              padding: "12px 0",
              border: "none", borderBottom: "1px solid #e0e0e0",
              fontSize: 16, fontWeight: 300,
              outline: "none", background: "transparent",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{
            fontSize: 9, fontWeight: 600, letterSpacing: 2,
            color: "#aaa", textTransform: "uppercase",
            display: "block", marginBottom: 12,
          }}>カテゴリ</label>
          <div style={{ display: "flex", gap: 10 }}>
            {categories.map(cat => {
              const isSelected = cat === selectedCategory;
              const colors = CATEGORY_COLORS[cat];
              return (
                <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 8,
                  border: `1.5px solid ${isSelected ? colors.solid : "#e0e0e0"}`,
                  background: isSelected ? colors.light : "#fff",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: 1,
                  color: isSelected ? colors.solid : "#666",
                  fontFamily: "inherit",
                }}>
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: "100%", padding: "14px 0",
            background: "#000", color: "#fff",
            border: "none", borderRadius: 12,
            fontSize: 14, fontWeight: 500, letterSpacing: 2,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          追加する
        </button>
      </div>
    </div>
  );
}
