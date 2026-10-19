import { useState, type ReactNode } from "react";
import type { Service } from "../api/services";
import { BookingContext, type Customer } from "./BookingContext";

export function BookingProvider({ children }: { children: ReactNode }) {
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [customer, setCustomer] = useState<Customer | null>(null);

    return (
        <BookingContext value={{ selectedServices, setSelectedServices, customer, setCustomer }}>
        {children}
        </BookingContext>
    );
}