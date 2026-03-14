import type { Category } from "./types";

export const CATEGORY_COLORS: Record<Category, { solid: string; light: string }> = {
  mine:     { solid: "#4A6FA5", light: "rgba(74, 111, 165, 0.10)" },
  partner:  { solid: "#7BAB7E", light: "rgba(123, 171, 126, 0.10)" },
  together: { solid: "#C2684D", light: "rgba(194, 104, 77, 0.12)" },
};

export const CATEGORY_LABELS: Record<Category, string> = {
  mine: "自分",
  partner: "パートナー",
  together: "ふたり",
};

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

export const SUNDAY_COLOR = "#C2684D";
export const SATURDAY_COLOR = "#4A90D9";
export const SELECTED_BG = "#e8e4e0";
