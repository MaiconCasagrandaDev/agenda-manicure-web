import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { Service } from "../api/services";
import type { CreatedAppointment } from "../api/appointments";

export type Customer = {
    firstName: string;
    lastName: string;
    phone: string; // formato internacional, ex.: "+5554999991234"
    whatsappOptIn: boolean;
};

export type Slot = {
  date: string; // "2026-10-21"
  time: string; // "14:00"
};

// O que a tela "Pedido recebido!" mostra
export type Receipt = CreatedAppointment & { hasStartingAt: boolean };

export type BookingContextValue = {
    selectedServices: Service[];
    setSelectedServices: Dispatch<SetStateAction<Service[]>>;
    slot: Slot | null;
    setSlot: Dispatch<SetStateAction<Slot | null>>;
    customer: Customer | null;
    setCustomer: Dispatch<SetStateAction<Customer | null>>;
    receipt: Receipt | null;
    setReceipt: Dispatch<SetStateAction<Receipt | null>>;
};

export const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error("useBooking precisa estar dentro do <BookingProvider>");
    }
    return context;
}