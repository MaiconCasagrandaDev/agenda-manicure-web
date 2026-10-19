import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { Service } from "../api/services";

// O que fica guardado no agendamento em andamento
export type BookingContextValue = {
    selectedServices: Service[];
    setSelectedServices: Dispatch<SetStateAction<Service[]>>;
};

export const BookingContext = createContext<BookingContextValue | null>(null);

// Atalho para as telas lerem o contexto.
// Se alguém esquecer o Provider, o erro avisa na hora em vez de falhar escondido.
export function useBooking() {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error("useBooking precisa estar dentro do <BookingProvider>");
    }
    return context;
}