import { toApiError } from "./errors";

const API_URL = import.meta.env.VITE_API_URL;

export type TimeOff = {
  id: number;
  startsAt: string;
  endsAt: string;
  reason: string | null;
};

export async function getTimeOffs(): Promise<TimeOff[]> {
  const response = await fetch(`${API_URL}/admin/time-off`, { credentials: "include" });
  if (!response.ok) throw await toApiError(response);
  return response.json();
}

export async function deleteTimeOff(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/admin/time-off/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw await toApiError(response);
}