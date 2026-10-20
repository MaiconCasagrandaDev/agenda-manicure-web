import { Link, useNavigate } from "react-router";
import { useBooking } from "../booking/BookingContext";
import { BookingFooter } from "../components/BookingFooter";
import { BookingHeader } from "../components/BookingHeader";
import { formatLongDate, formatPrice, formatTime } from "../lib/format";

export function ReceiptPage() {
  const { receipt } = useBooking();
  const navigate = useNavigate();

  // Abriu a página direto, sem ter agendado
  if (!receipt) {
    return (
      <main className="mx-auto max-w-md px-4 pt-8">
        <Link to="/" className="font-semibold text-primary">
          Fazer um agendamento
        </Link>
      </main>
    );
  }

  const details = [
    { label: "Data", value: formatLongDate(receipt.startsAt) },
    { label: "Horário", value: `${formatTime(receipt.startsAt)} às ${formatTime(receipt.endsAt)}` },
    { label: "Serviços", value: receipt.services.join(", ") },
    {
      label: "Valor",
      value: `${receipt.hasStartingAt ? "a partir de " : ""}${formatPrice(receipt.totalPrice)}`,
    },
  ];

  return (
    <>
      <BookingHeader title="Agendamento" />

      <main className="mx-auto max-w-md px-4 pt-10 pb-32 text-center">
        {/* Ícone de "deu certo" */}
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary text-white">
          <svg
            viewBox="0 0 24 24"
            className="size-8"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>

        <h1 className="mt-5 text-2xl font-semibold text-ink">Pedido recebido!</h1>
        <p className="mt-2 text-muted">
          A Carol vai confirmar o seu horário pelo WhatsApp em breve.
        </p>

        {/* Status: ainda não está confirmado */}
        <span className="mt-4 inline-block rounded-full bg-soft px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
          Aguardando confirmação
        </span>

        {/* Card com o resumo do agendamento */}
        <dl className="mt-6 divide-y divide-soft rounded-2xl border-2 border-soft bg-surface text-left">
          {details.map((item) => (
            <div key={item.label} className="flex items-start justify-between gap-4 px-4 py-3">
              <dt className="text-sm text-muted">{item.label}</dt>
              <dd className="text-right font-semibold text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
      </main>

      <BookingFooter disabled={false} onNext={() => navigate("/")} label="Novo agendamento">
        <p className="font-semibold text-ink">Tudo certo!</p>
        <p className="text-muted">Pode fechar esta página.</p>
      </BookingFooter>
    </>
  );
}