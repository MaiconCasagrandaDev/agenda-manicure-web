import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { Service } from "../api/services";

export type Customer = {
    firstName: string;
    lastName: string;
    phone: string; // formato internacional, ex.: "+5554999991234"
    whatsappOptIn: boolean;
};

export type BookingContextValue = {
    selectedServices: Service[];
    setSelectedServices: Dispatch<SetStateAction<Service[]>>;
    customer: Customer | null;
    setCustomer: Dispatch<SetStateAction<Customer | null>>;
};

export const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error("useBooking precisa estar dentro do <BookingProvider>");
    }
    return context;
}