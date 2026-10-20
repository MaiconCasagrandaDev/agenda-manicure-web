import { toApiError } from "./errors";

const API_URL = import.meta.env.VITE_API_URL;

export type AvailableDay = {
  date: string;    // "2026-10-21"
  weekday: number; // 0 = domingo ... 6 = sábado
  slots: string[]; // ["09:00", "09:30", ...] — vazio = dia lotado
};

export type Availability = {
  durationMinutes: number;
  days: AvailableDay[];
};

export async function getAvailability(serviceIds: number[]): Promise<Availability> {
  const params = new URLSearchParams({ serviceIds: serviceIds.join(",") });
  const response = await fetch(`${API_URL}/availability?${params}`);
  if (!response.ok) throw await toApiError(response);
  return response.json();
}