import { toApiError } from "./errors";

const API_URL = import.meta.env.VITE_API_URL;

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELED" | "DONE";

export type AdminAppointment = {
  id: number;
  customerName: string;
  startsAt: string;
  endsAt: string;
  totalPrice: string;
  status: AppointmentStatus;
  confirmedAt: string | null;
  reminderSentAt: string | null;
  client: { name: string; phone: string; whatsappOptInAt: string | null };
  items: { serviceName: string }[];
};

export type AppointmentList = {
  pendingCount: number;
  date?: string;
  appointments: AdminAppointment[];
};

export type AppointmentAction = "confirm" | "decline" | "cancel";

// Todas as chamadas do painel enviam o cookie da sessão
export async function getPendingAppointments(): Promise<AppointmentList> {
  const response = await fetch(`${API_URL}/admin/appointments?view=pending`, {
    credentials: "include",
  });
  if (!response.ok) throw await toApiError(response);
  return response.json();
}

export async function getDayAppointments(date: string): Promise<AppointmentList> {
  const params = new URLSearchParams({ date });
  const response = await fetch(`${API_URL}/admin/appointments?${params}`, {
    credentials: "include",
  });
  if (!response.ok) throw await toApiError(response);
  return response.json();
}

// options.blockSlot: ao cancelar, o horário vira bloqueio (não volta para as clientes)
export async function updateAppointment(
  id: number,
  action: AppointmentAction,
  options: { blockSlot?: boolean } = {},
): Promise<AdminAppointment> {
  const response = await fetch(`${API_URL}/admin/appointments/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...options }),
  });
  if (!response.ok) throw await toApiError(response);
  return response.json();
}

export async function markReminderSent(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/admin/appointments/${id}/reminder`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) throw await toApiError(response);
}