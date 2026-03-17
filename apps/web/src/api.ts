import type { Category, CalendarEvent } from "./types";

const BASE = "/api";

// API から返る生のイベント（date フィールド付き）
export interface ApiEvent extends CalendarEvent {
  date: string;
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const err = Object.assign(new Error(await res.text()), { status: res.status });
    throw err;
  }
  return res.json() as Promise<T>;
}

export const api = {
  getMe() {
    return req<{ couple_id: string; role: string; invite_token?: string }>("/couples/me");
  },

  createCouple() {
    return req<{ couple_id: string; invite_token: string }>("/couples", { method: "POST" });
  },

  joinCouple(token: string) {
    return req<{ couple_id: string }>(`/couples/join/${token}`, { method: "POST" });
  },

  fetchEvents(month: string) {
    return req<{ events: ApiEvent[] }>(`/events?month=${month}`);
  },

  createEvent(data: {
    title: string;
    category: Category;
    date: string;
    start_time?: string | null;
    end_time?: string | null;
  }) {
    return req<ApiEvent>("/events", { method: "POST", body: JSON.stringify(data) });
  },

  deleteEvent(id: string) {
    return req<{ id: string }>(`/events/${id}`, { method: "DELETE" });
  },

  updateEvent(id: string, data: {
    title?: string;
    category?: Category;
    start_time?: string | null;
  }) {
    return req<ApiEvent>(`/events/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  },
};
