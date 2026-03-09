import { useState } from "react";

const ACCENT = "#C2684D";
const ACCENT_LIGHT = "rgba(194, 104, 77, 0.12)";

const DAYS_JP = ["日", "月", "火", "水", "木", "金", "土"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const sampleEvents = {
  "2026-3-8": [
    { title: "ブランチ", category: "together", time: "11:00" },
  ],
  "2026-3-10": [
    { title: "MTG", category: "mine", time: "14:00" },
  ],
  "2026-3-12": [
    { title: "歯医者", category: "partner", time: "10:30" },
  ],
  "2026-3-14": [
    { title: "ディナー", category: "together", time: "19:00" },
  ],
  "2026-3-15": [
    { title: "ジム", category: "mine", time: "8:00" },
    { title: "買い物", category: "together", time: "15:00" },
  ],
  "2026-3-20": [
    { title: "出張", category: "mine", time: "9:00" },
  ],
  "2026-3-22": [
    { title: "映画", category: "together", time: "14:00" },
  ],
  "2026-3-25": [
    { title: "ヨガ", category: "partner", time: "7:00" },
  ],
  "2026-3-28": [
    { title: "友人と食事", category: "partner", time: "18:30" },
  ],
};

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

export default function CalendarApp() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [showAddModal, setShowAddModal] = useState(false);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentYear(y => y - 1); setCurrentMonth(11); }
    else setCurrentMonth(m => m - 1);
    setSelectedDate(1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentYear(y => y + 1); setCurrentMonth(0); }
    else setCurrentMonth(m => m + 1);
    setSelectedDate(1);
  };

  const selectedKey = `${currentYear}-${currentMonth + 1}-${selectedDate}`;
  const selectedEvents = sampleEvents[selectedKey] || [];

  const isToday = (d) =>
    d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const getEventKey = (d) => `${currentYear}-${currentMonth + 1}-${d}`;

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{
      maxWidth: 430,
      margin: "0 auto",
      minHeight: "100vh",
      background: "#fff",
      fontFamily: "'Helvetica Neue', 'Hiragino Kaku Gothic ProN', sans-serif",
      color: "#000",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Status bar mock */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 24px 0", fontSize: 12, fontWeight: 600, letterSpacing: 0.5,
        color: "#999",
      }}>
        <span>9:41</span>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><rect x="0" y="4" width="3" height="8" rx="0.5" fill="#999"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="0.5" fill="#999"/><rect x="9" y="1" width="3" height="11" rx="0.5" fill="#999"/><rect x="13.5" y="0" width="2.5" height="12" rx="0.5" fill="#999"/></svg>
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none"><rect x="0.5" y="0.5" width="17" height="11" rx="2" stroke="#999"/><rect x="2" y="2" width="12" height="8" rx="1" fill="#999"/><rect x="18" y="3.5" width="2" height="5" rx="0.5" fill="#999"/></svg>
        </div>
      </div>

      {/* Month & Year Header */}
      <div style={{ padding: "32px 28px 0" }}>
        <div style={{
          display: "flex", alignItems: "baseline", justifyContent: "space-between",
        }}>
          <div>
            <div style={{
              fontSize: 52,
              fontWeight: 200,
              letterSpacing: -3,
              lineHeight: 1,
              color: "#000",
            }}>
              {MONTHS[currentMonth]}
            </div>
            <div style={{
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#aaa",
              marginTop: 4,
            }}>
              {currentYear}
            </div>
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <button onClick={prevMonth} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 20, color: "#000", padding: 4, lineHeight: 1,
            }}>←</button>
            <button onClick={nextMonth} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 20, color: "#000", padding: 4, lineHeight: 1,
            }}>→</button>
          </div>
        </div>
      </div>

      {/* Day headers */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
        padding: "28px 20px 8px", gap: 0,
      }}>
        {DAYS_JP.map((d, i) => (
          <div key={d} style={{
            textAlign: "center",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: 2,
            color: i === 0 ? ACCENT : "#bbb",
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

          const events = sampleEvents[getEventKey(d)] || [];
          const isSel = d === selectedDate;
          const isTdy = isToday(d);
          const isSunday = i % 7 === 0;

          return (
            <button
              key={d}
              onClick={() => setSelectedDate(d)}
              style={{
                background: isSel ? "#000" : "transparent",
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
                color: isSel ? "#fff" : isSunday ? ACCENT : "#000",
                lineHeight: 1.2,
                fontVariantNumeric: "tabular-nums",
              }}>
                {d}
              </span>
              <div style={{
                display: "flex", gap: 3, marginTop: 5, minHeight: 6, justifyContent: "center",
              }}>
                {events.slice(0, 3).map((ev, j) => (
                  <span key={j} style={{
                    display: "inline-block",
                    width: 4, height: 4, borderRadius: "50%",
                    background: isSel
                      ? (ev.category === "together" ? ACCENT : "rgba(255,255,255,0.6)")
                      : (ev.category === "together" ? ACCENT : ev.category === "mine" ? "#000" : "#ccc"),
                  }} />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#f0f0f0", margin: "20px 28px 0" }} />

      {/* Selected Day Detail */}
      <div style={{ padding: "20px 28px 120px" }}>
        <div style={{
          display: "flex", alignItems: "baseline", justifyContent: "space-between",
          marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{
              fontSize: 40, fontWeight: 200, lineHeight: 1, letterSpacing: -2,
            }}>
              {selectedDate}
            </span>
            <span style={{
              fontSize: 12, fontWeight: 600, letterSpacing: 3,
              color: "#aaa", textTransform: "uppercase",
            }}>
              {DAYS_JP[new Date(currentYear, currentMonth, selectedDate).getDay()]}曜日
            </span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "#000", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {selectedEvents.length === 0 ? (
          <div style={{
            fontSize: 13, color: "#ccc", fontWeight: 400,
            letterSpacing: 1, padding: "16px 0",
          }}>
            予定はありません
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {selectedEvents.map((ev, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 16px",
                  background: ev.category === "together" ? ACCENT_LIGHT : "#f8f8f8",
                  borderRadius: 12,
                  borderLeft: `3px solid ${ev.category === "together" ? ACCENT : ev.category === "mine" ? "#000" : "#ccc"}`,
                  cursor: "pointer",
                }}
              >
                <div>
                  <div style={{
                    fontSize: 11, fontWeight: 600, color: "#aaa",
                    letterSpacing: 1, marginBottom: 2,
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    {ev.time}
                  </div>
                  <div style={{
                    fontSize: 15,
                    fontWeight: ev.category === "together" ? 600 : 400,
                    color: "#000",
                    letterSpacing: 0.5,
                  }}>
                    {ev.title}
                  </div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <span style={{
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: 2,
                    color: ev.category === "together" ? ACCENT : ev.category === "mine" ? "#666" : "#bbb",
                    textTransform: "uppercase",
                  }}>
                    {ev.category === "together" ? "ふたり" : ev.category === "mine" ? "自分" : "パートナー"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div style={{
          display: "flex", gap: 20, marginTop: 28,
          paddingTop: 16, borderTop: "1px solid #f0f0f0",
        }}>
          {[
            { label: "自分", color: "#000" },
            { label: "パートナー", color: "#ccc" },
            { label: "ふたり", color: ACCENT },
          ].map(item => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{
                display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                background: item.color,
              }} />
              <span style={{
                fontSize: 10, fontWeight: 500, letterSpacing: 1, color: "#999",
              }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
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
        {[
          { label: "カレンダー", icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="4" width="18" height="16" rx="2" stroke="#000" strokeWidth="1.5"/>
              <path d="M2 9h18" stroke="#000" strokeWidth="1.5"/>
              <path d="M7 2v4M15 2v4" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ), active: true },
          { label: "設定", icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="3" stroke="#999" strokeWidth="1.5"/>
              <path d="M11 2v2M11 18v2M2 11h2M18 11h2M4.93 4.93l1.41 1.41M15.66 15.66l1.41 1.41M4.93 17.07l1.41-1.41M15.66 6.34l1.41-1.41" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ), active: false },
        ].map(item => (
          <button key={item.label} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          }}>
            {item.icon}
            <span style={{
              fontSize: 9, fontWeight: 600, letterSpacing: 1.5,
              color: item.active ? "#000" : "#999",
              textTransform: "uppercase",
            }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            zIndex: 100,
          }}
          onClick={() => setShowAddModal(false)}
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
                {[
                  { id: "mine", label: "自分", color: "#000" },
                  { id: "partner", label: "パートナー", color: "#ccc" },
                  { id: "together", label: "ふたり", color: ACCENT },
                ].map(cat => (
                  <button key={cat.id} style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 8,
                    border: `1.5px solid ${cat.id === "together" ? ACCENT : "#e0e0e0"}`,
                    background: cat.id === "together" ? ACCENT_LIGHT : "#fff",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: 1,
                    color: cat.id === "together" ? ACCENT : "#666",
                    fontFamily: "inherit",
                  }}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(false)}
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
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        button:active { opacity: 0.7; }
        input::placeholder { color: #ccc; }
      `}</style>
    </div>
  );
}
