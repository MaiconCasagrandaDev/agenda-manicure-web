import { toApiError } from "./errors";

const API_URL = import.meta.env.VITE_API_URL;

export type TimeOff = {
  id: number;
  startsAt: string;
  endsAt: string;
  reason: string | null;
};

// Cliente marcada no período do bloqueio (vem no 409 e, depois, em "canceled")
export type BlockedClient = {
  id: number;
  customerName: string;
  startsAt: string;
  endsAt: string;
  status: "PENDING" | "CONFIRMED"; // status de ANTES do cancelamento
  client: { phone: string };
  items: { serviceName: string }[];
};

type Extra = { reason?: string; force?: boolean };

// Um tipo para cada "kind": o TypeScript só deixa mandar os campos certos
export type NewTimeOff =
  | ({ kind: "day" | "morning" | "afternoon"; date: string } & Extra)
  | ({ kind: "range"; date: string; from: string; to: string } & Extra)
  | ({ kind: "period"; startDate: string; endDate: string } & Extra);

export type CreateTimeOffResult = {
  timeOffs: TimeOff[];
  canceled: BlockedClient[]; // quem precisa ser avisada (vazio se não tinha ninguém)
};

// Erro especial do 409: além da mensagem, traz quem está marcada
export class TimeOffConflictError extends Error {
  conflicts: BlockedClient[];

  constructor(message: string, conflicts: BlockedClient[]) {
    super(message);
    this.name = "TimeOffConflictError";
    this.conflicts = conflicts;
  }
}

export async function getTimeOffs(): Promise<TimeOff[]> {
  const response = await fetch(`${API_URL}/admin/time-off`, { credentials: "include" });
  if (!response.ok) throw await toApiError(response);
  return response.json();
}

export async function createTimeOff(input: NewTimeOff): Promise<CreateTimeOffResult> {
  const response = await fetch(`${API_URL}/admin/time-off`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (response.status === 409) {
    const data = await response.json();
    throw new TimeOffConflictError(
      data.error ?? "Existem clientes marcadas nesse período.",
      data.conflicts ?? [],
    );
  }
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