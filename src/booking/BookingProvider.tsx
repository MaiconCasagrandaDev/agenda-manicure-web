import { useState, type ReactNode } from "react";
import type { Service } from "../api/services";
import { BookingContext } from "./BookingContext";

// Componente que "segura" a memória e entrega para tudo que estiver dentro dele
export function BookingProvider({ children }: { children: ReactNode }) {
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);

    return (
        <BookingContext value={{ selectedServices, setSelectedServices }}>
        {children}
        </BookingContext>
    );
}