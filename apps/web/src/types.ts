export type Category = "mine" | "partner" | "together";

export interface CalendarEvent {
  title: string;
  category: Category;
  time: string; // "HH:mm" format
}

// Events keyed by "YYYY-M-D" string (no zero-padding)
export type EventMap = Record<string, CalendarEvent[]>;
