export type Category = 'mine' | 'partner' | 'together';
export type Role = 'creator' | 'partner';

export type Bindings = {
  DB: D1Database;
};

export type Variables = {
  session: SessionRow;
};

export type CoupleRow = {
  id: string;
  token: string;
  created_at: number;
};

export type SessionRow = {
  id: string;
  couple_id: string;
  role: Role;
  created_at: number;
  expires_at: number;
};

export type EventRow = {
  id: string;
  couple_id: string;
  session_id: string;
  title: string;
  category: Category;
  date: string;
  start_time: string | null;
  end_time: string | null;
  created_at: number;
  updated_at: number;
};

export type EventWithCreatorRole = EventRow & { creator_role: Role };
