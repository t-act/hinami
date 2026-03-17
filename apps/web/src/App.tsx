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
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [events, setEvents] = useState<EventMap>({});
  const [error, setError] = useState<string | null>(null);

  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // エラー自動クリア
  useEffect(() => {
    if (!error) return;
    const id = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(id);
  }, [error]);

  // セッション初期化（マウント時のみ）
  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const joinToken = params.get("join");
        if (joinToken) {
          await api.joinCouple(joinToken);
          window.history.replaceState({}, "", window.location.pathname);
        }

        const me = await api.getMe();
        setCoupleId(me.couple_id);
        // partner ロールには招待URLを表示しない
        if (me.invite_token && me.role !== "partner") {
          setInviteUrl(`${window.location.origin}/?join=${me.invite_token}`);
        }
      } catch (e: unknown) {
        if (e instanceof Error && (e as { status?: number }).status === 401) {
          const couple = await api.createCouple();
          setCoupleId(couple.couple_id);
          setInviteUrl(`${window.location.origin}/?join=${couple.invite_token}`);
        } else {
          setError("接続に失敗しました");
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

  // イベント追加（楽観的更新）
  const handleAddEvent = async (data: { title: string; category: Category; start_time: string | null }) => {
    const tempId = `temp-${Date.now()}`;
    const tempEvent: CalendarEvent = { id: tempId, title: data.title, category: data.category, start_time: data.start_time, end_time: null, is_mine: true };
    setEvents(prev => ({ ...prev, [selectedKey]: [...(prev[selectedKey] || []), tempEvent] }));

    try {
      const created = await api.createEvent({ ...data, date: selectedKey });
      setEvents(prev => ({
        ...prev,
        [selectedKey]: (prev[selectedKey] || []).map(e => e.id === tempId ? { ...created } as CalendarEvent : e),
      }));
    } catch {
      setEvents(prev => ({ ...prev, [selectedKey]: (prev[selectedKey] || []).filter(e => e.id !== tempId) }));
      setError("予定の追加に失敗しました");
    }
  };

  // イベント削除要求（確認ダイアログを表示）
  const handleDeleteEvent = (id: string) => {
    setConfirmingDeleteId(id);
  };

  // 削除確認後の実行（楽観的更新）
  const handleConfirmDelete = async () => {
    const id = confirmingDeleteId!;
    setConfirmingDeleteId(null);
    const snapshot = events;
    setEvents(prev => {
      const updated = { ...prev };
      for (const key of Object.keys(updated)) {
        updated[key] = updated[key].filter(e => e.id !== id);
      }
      return updated;
    });

    try {
      await api.deleteEvent(id);
    } catch {
      setEvents(snapshot);
      setError("削除に失敗しました");
    }
  };

  // イベント更新（楽観的更新）
  const handleUpdateEvent = async (id: string, data: { title: string; category: Category; start_time: string | null }) => {
    const snapshot = events;
    setEvents(prev => {
      const updated = { ...prev };
      for (const key of Object.keys(updated)) {
        updated[key] = updated[key].map(e => e.id === id ? { ...e, ...data } : e);
      }
      return updated;
    });
    setEditingEvent(null);

    try {
      await api.updateEvent(id, data);
    } catch {
      setEvents(snapshot);
      setError("予定の更新に失敗しました");
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
        onEdit={setEditingEvent}
      />
      <BottomNav />

      {/* イベント追加モーダル */}
      {showAddModal && (
        <AddEventModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddEvent}
        />
      )}

      {/* イベント編集モーダル */}
      {editingEvent && (
        <AddEventModal
          onClose={() => setEditingEvent(null)}
          onEdit={handleUpdateEvent}
          event={editingEvent}
        />
      )}

      {/* 削除確認ダイアログ */}
      {confirmingDeleteId && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 200,
          }}
          onClick={() => setConfirmingDeleteId(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: "calc(100% - 56px)", maxWidth: 374,
              background: "#fff", borderRadius: 16, padding: "28px 24px",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 400, marginBottom: 8, letterSpacing: -0.3 }}>
              予定を削除しますか？
            </div>
            <div style={{ fontSize: 13, color: "#aaa", marginBottom: 28, letterSpacing: 0.3 }}>
              この操作は取り消せません。
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setConfirmingDeleteId(null)}
                style={{
                  flex: 1, padding: "12px 0",
                  border: "1px solid #e0e0e0", borderRadius: 10,
                  background: "#fff", fontSize: 14, cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{
                  flex: 1, padding: "12px 0",
                  border: "none", borderRadius: 10,
                  background: "#e57373", color: "#fff",
                  fontSize: 14, cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* エラートースト */}
      {error && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          background: "#333", color: "#fff", padding: "10px 20px",
          borderRadius: 8, fontSize: 13, letterSpacing: 0.5,
          zIndex: 300, whiteSpace: "nowrap",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
