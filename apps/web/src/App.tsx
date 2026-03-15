import { useState, useEffect, useCallback } from "react";
import type { CalendarEvent, EventMap, Category } from "./types";
import { api } from "./api";
import MonthHeader from "./components/MonthHeader";
import CalendarGrid from "./components/CalendarGrid";
import DayDetail from "./components/DayDetail";
import BottomNav from "./components/BottomNav";
import AddEventModal from "./components/AddEventModal";

function buildEventMap(events: (CalendarEvent & { date: string })[]): EventMap {
  const map: EventMap = {};
  for (const e of events) {
    if (!map[e.date]) map[e.date] = [];
    map[e.date].push({ id: e.id, title: e.title, category: e.category, start_time: e.start_time, end_time: e.end_time, is_mine: e.is_mine });
  }
  return map;
}

export default function App() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [showAddModal, setShowAddModal] = useState(false);
  const [events, setEvents] = useState<EventMap>({});

  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // セッション初期化（マウント時のみ）
  useEffect(() => {
    (async () => {
      try {
        // ?join=TOKEN が URL に含まれていれば招待参加を試みる
        const params = new URLSearchParams(window.location.search);
        const joinToken = params.get("join");
        if (joinToken) {
          await api.joinCouple(joinToken);
          window.history.replaceState({}, "", window.location.pathname);
        }

        const me = await api.getMe();
        setCoupleId(me.couple_id);
        if (me.invite_token) {
          setInviteUrl(`${window.location.origin}/?join=${me.invite_token}`);
        }
      } catch (e: unknown) {
        // 未セッション → 新規カップル作成
        if (e instanceof Error && (e as { status?: number }).status === 401) {
          const couple = await api.createCouple();
          setCoupleId(couple.couple_id);
          setInviteUrl(`${window.location.origin}/?join=${couple.invite_token}`);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 月別イベント取得
  const fetchEvents = useCallback(async (year: number, month: number) => {
    if (!coupleId) return;
    const monthStr = `${year}-${month + 1}`;
    const { events: apiEvents } = await api.fetchEvents(monthStr);
    setEvents(buildEventMap(apiEvents));
  }, [coupleId]);

  useEffect(() => {
    fetchEvents(currentYear, currentMonth);
  }, [fetchEvents, currentYear, currentMonth]);

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
  const selectedEvents = events[selectedKey] || [];

  const handleAddEvent = async (data: { title: string; category: Category; start_time: string | null }) => {
    try {
      const created = await api.createEvent({ ...data, date: selectedKey });
      setEvents(prev => ({
        ...prev,
        [selectedKey]: [...(prev[selectedKey] || []), { ...created, date: undefined } as CalendarEvent],
      }));
    } catch {
      // TODO: エラー表示
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await api.deleteEvent(id);
      setEvents(prev => {
        const updated = { ...prev };
        for (const key of Object.keys(updated)) {
          updated[key] = updated[key].filter(e => e.id !== id);
        }
        return updated;
      });
    } catch {
      // TODO: エラー表示
    }
  };

  if (loading) {
    return (
      <div style={{
        maxWidth: 430, margin: "0 auto", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Helvetica Neue', 'Hiragino Kaku Gothic ProN', sans-serif",
        color: "#ccc", fontSize: 14, letterSpacing: 2,
      }}>
        読み込み中...
      </div>
    );
  }

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
      <MonthHeader
        month={currentMonth}
        year={currentYear}
        onPrev={prevMonth}
        onNext={nextMonth}
      />
      <CalendarGrid
        year={currentYear}
        month={currentMonth}
        selectedDate={selectedDate}
        events={events}
        onSelectDate={setSelectedDate}
      />

      {/* 招待URL（creator のみ表示） */}
      {inviteUrl && (
        <div style={{
          margin: "0 28px",
          padding: "12px 16px",
          background: "#f9f9f9",
          borderRadius: 10,
          fontSize: 11,
          color: "#888",
          letterSpacing: 0.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            パートナーを招待: {inviteUrl}
          </span>
          <button
            onClick={() => navigator.clipboard.writeText(inviteUrl)}
            style={{
              flexShrink: 0,
              padding: "4px 10px",
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "inherit",
              letterSpacing: 1,
            }}
          >
            コピー
          </button>
        </div>
      )}

      <div style={{ height: 1, background: "#f0f0f0", margin: "20px 28px 0" }} />

      <DayDetail
        year={currentYear}
        month={currentMonth}
        date={selectedDate}
        events={selectedEvents}
        onAddClick={() => setShowAddModal(true)}
        onDelete={handleDeleteEvent}
      />
      <BottomNav />

      {showAddModal && (
        <AddEventModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddEvent}
        />
      )}
    </div>
  );
}
