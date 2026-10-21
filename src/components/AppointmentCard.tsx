import type { ReactNode } from "react";
import type { AdminAppointment } from "../api/adminAppointments";
import { formatLongDate, formatPrice, formatTime } from "../lib/format";
import { formatBrazilianMobile } from "../lib/phone";

type AppointmentCardProps = {
  appointment: AdminAppointment;
  showDate?: boolean; // Pedidos mostra a data; na Agenda o dia já está escolhido
  children?: ReactNode; // os botões de ação
};

export function AppointmentCard({
  appointment: a,
  showDate = false,
  children,
}: AppointmentCardProps) {
  return (
    <article className="rounded-2xl border-2 border-soft bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          {showDate && (
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {formatLongDate(a.startsAt)}
            </p>
          )}
          <p className="mt-0.5 text-lg font-semibold text-ink">
            {formatTime(a.startsAt)} – {formatTime(a.endsAt)}
          </p>
        </div>
        <p className="font-semibold text-ink">{formatPrice(a.totalPrice)}</p>
      </div>

      <p className="mt-2 font-semibold text-ink">{a.customerName}</p>
      <p className="text-sm text-muted">
        {a.items.map((i) => i.serviceName).join(", ")}
      </p>

      {/* tel: abre o discador do celular */}
      <a
        href={`tel:${a.client.phone}`}
        className="mt-1 inline-block text-sm text-primary"
      >
        {formatBrazilianMobile(a.client.phone.slice(3))}
      </a>

      {!a.client.whatsappOptInAt && (
        <p className="mt-1 text-xs text-muted">
          Não autorizou mensagens no WhatsApp
        </p>
      )}

      {children && <div className="mt-4 flex gap-2">{children}</div>}
    </article>
  );
}
