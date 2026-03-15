export type Category = "mine" | "partner" | "together";

export interface CalendarEvent {
  id: string;
  title: string;
  category: Category;
  start_time: string | null;
  end_time: string | null;
  is_mine: boolean;
}

// Events keyed by "YYYY-M-D" string (no zero-padding)
export type EventMap = Record<string, CalendarEvent[]>;
