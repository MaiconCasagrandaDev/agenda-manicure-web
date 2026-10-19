import { Link } from "react-router";
import { useBooking } from "../booking/BookingContext";
import { formatLongDate, formatPrice, formatTime } from "../lib/format";

export function ReceiptPage() {
    const { receipt } = useBooking();

    // Abriu a página direto, sem ter agendado
    if (!receipt) {
        return (
        <main className="mx-auto max-w-md px-4 pt-8">
            <Link to="/" className="font-semibold text-primary">Fazer um agendamento</Link>
        </main>
        );
    }

    return (
        <main className="mx-auto max-w-md px-4 pt-12 pb-12 text-center">
        <p className="text-4xl" aria-hidden="true">✓</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">Pedido de agendamento recebido!</h1>

        <div className="mt-6 rounded-2xl border-2 border-soft bg-surface p-4">
            <p className="font-semibold text-ink">{formatLongDate(receipt.startsAt)}</p>
            <p className="text-ink">
            {formatTime(receipt.startsAt)} às {formatTime(receipt.endsAt)}
            </p>
            <p className="mt-2 text-sm text-muted">
            {receipt.services.join(", ")} ·{" "}
            {receipt.hasStartingAt && "a partir de "}
            {formatPrice(receipt.totalPrice)}
            </p>
        </div>

        <p className="mt-6 text-sm text-muted">
            A manicure vai confirmar seu horário pelo WhatsApp em breve.
        </p>

        <Link to="/" className="mt-6 inline-block font-semibold text-primary">
            Fazer outro agendamento
        </Link>
        </main>
    );
}