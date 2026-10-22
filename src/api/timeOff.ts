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

type Extra = { reason?: string; force?: boolean };

// Um tipo para cada "kind": o TypeScript só deixa mandar os campos certos
export type NewTimeOff =
  | ({ kind: "day" | "morning" | "afternoon"; date: string } & Extra)
  | ({ kind: "range"; date: string; from: string; to: string } & Extra)
  | ({ kind: "period"; startDate: string; endDate: string } & Extra);

export async function createTimeOff(input: NewTimeOff): Promise<void> {
  const response = await fetch(`${API_URL}/admin/time-off`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw await toApiError(response);
}