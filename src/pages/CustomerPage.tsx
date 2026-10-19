import { Link } from "react-router";
import { useBooking } from "../booking/BookingContext";

export function CustomerPage() {
    const { selectedServices } = useBooking();

    // Se alguém abrir /seus-dados direto, sem escolher serviço
    if (selectedServices.length === 0) {
        return (
        <main className="mx-auto max-w-md px-4 pt-8">
            <p className="text-muted">Você ainda não escolheu nenhum serviço.</p>
            <Link to="/" className="mt-2 inline-block font-semibold text-primary">
            Escolher serviços
            </Link>
        </main>
        );
    }

    return (
        <main className="mx-auto max-w-md px-4 pt-8">
        <Link to="/" className="text-sm text-primary">← Voltar</Link>
        <h1 className="mt-4 text-2xl font-semibold text-ink">Seus dados</h1>
        <p className="mt-1 text-sm text-muted">
            {selectedServices.map((s) => s.name).join(", ")}
        </p>
        </main>
    );
}