import { useState } from "react";
import type { CalendarEvent, EventMap } from "./types";
import MonthHeader from "./components/MonthHeader";
import CalendarGrid from "./components/CalendarGrid";
import DayDetail from "./components/DayDetail";
import BottomNav from "./components/BottomNav";
import AddEventModal from "./components/AddEventModal";

export default function App() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [showAddModal, setShowAddModal] = useState(false);
  const [events, setEvents] = useState<EventMap>({});

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

  const handleAddEvent = (event: CalendarEvent) => {
    setEvents(prev => ({
      ...prev,
      [selectedKey]: [...(prev[selectedKey] || []), event],
    }));
  };

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

      {/* Divider */}
      <div style={{ height: 1, background: "#f0f0f0", margin: "20px 28px 0" }} />

      <DayDetail
        year={currentYear}
        month={currentMonth}
        date={selectedDate}
        events={selectedEvents}
        onAddClick={() => setShowAddModal(true)}
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
