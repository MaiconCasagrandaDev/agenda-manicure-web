import { toApiError } from "./errors";

const API_URL = import.meta.env.VITE_API_URL;

export type NewAppointment = {
    serviceIds: number[];
    date: string; // "2026-10-21"
    time: string; // "14:00"
    customer: {
        firstName: string;
        lastName: string;
        phone: string;
        whatsappOptIn: boolean;
    };
};

// O que a API devolve quando o agendamento é criado
export type CreatedAppointment = {
    id: number;
    startsAt: string; // ISO em UTC, ex.: "2026-10-21T17:00:00.000Z"
    endsAt: string;
    totalPrice: string;
    status: string;
    services: string[];
};

export async function createAppointment(data: NewAppointment): Promise<CreatedAppointment> {
    const response = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw await toApiError(response);
    return response.json();
}