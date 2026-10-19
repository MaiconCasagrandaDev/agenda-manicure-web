import { useState, type ReactNode } from "react";
import type { Service } from "../api/services";
import { BookingContext, type Customer, type Receipt, type Slot } from "./BookingContext";

export function BookingProvider({ children }: { children: ReactNode }) {
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [slot, setSlot] = useState<Slot | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [receipt, setReceipt] = useState<Receipt | null>(null);

    return (
        <BookingContext
        value={{
            selectedServices, setSelectedServices,
            slot, setSlot,
            customer, setCustomer,
            receipt, setReceipt,
        }}
        >
        {children}
        </BookingContext>
    );
}