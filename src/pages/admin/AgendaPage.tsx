import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import {
  getDayAppointments,
  markReminderSent,
  updateAppointment,
  type AdminAppointment,
} from "../../api/adminAppointments";
import { ApiError } from "../../api/errors";
import { AppointmentCard } from "../../components/AppointmentCard";
import {
  addDaysToDate,
  formatPrice,
  formatSlotDate,
  formatTime,
  todayInBrazil,
} from "../../lib/format";
import {
  cancellationMessage,
  reminderMessage,
  whatsappLink,
} from "../../lib/whatsapp";
import type { AdminOutletContext } from "./AdminLayout";

const DAYS_BACK = 30; // histórico: até 30 dias atrás
const DAYS_AHEAD = 30; // mesmo limite da agenda das clientes

// Já terminou?
function isPast(a: AdminAppointment) {
  return new Date(a.endsAt).getTime() < Date.now();
}

export function AgendaPage() {
  const { setPendingCount } = useOutletContext<AdminOutletContext>();
  const navigate = useNavigate();
  const today = todayInBrazil();
  const minDate = addDaysToDate(today, -DAYS_BACK);
  const maxDate = addDaysToDate(today, DAYS_AHEAD);

  const [date, setDate] = useState(today);
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [cancelingId, setCancelingId] = useState<number | null>(null); // card mostrando "por quê?"
  const [canceled, setCanceled] = useState<Record<number, AdminAppointment>>(
    {},
  );

  // Busca os confirmados sempre que o dia muda
  useEffect(() => {
    let ignore = false;

    getDayAppointments(date)
      .then((data) => {
        if (ignore) return;
        setAppointments(data.appointments);
        setPendingCount(data.pendingCount);
        setError(null);
      })
      .catch((err) => {
        if (ignore) return;
        if (err instanceof ApiError && err.status === 401) {
          navigate("/admin/login", { replace: true });
        } else {
          setError("Não foi possível carregar a agenda.");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [date, navigate, setPendingCount]);

  function goTo(newDate: string) {
    // Comparar "AAAA-MM-DD" como texto funciona porque tem sempre o mesmo formato
    if (newDate === date || newDate < minDate || newDate > maxDate) return;
    setLoading(true);
    setCanceled({});
    setCancelingId(null);
    setDate(newDate);
  }

  async function handleCancel(a: AdminAppointment, blockSlot: boolean) {
    setBusyId(a.id);
    setError(null);
    try {
      const updated = await updateAppointment(a.id, "cancel", { blockSlot });
      setCancelingId(null);
      if (blockSlot) {
        // A Carol não pode atender: a cliente precisa ser avisada
        setCanceled((current) => ({ ...current, [a.id]: updated }));
      } else {
        // A cliente que pediu: ela já sabe, o card só sai da agenda
        dismiss(a.id);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(
        err instanceof ApiError ? err.message : "Sem conexão com o servidor.",
      );
    } finally {
      setBusyId(null);
    }
  }

  // O link abre o WhatsApp na hora; a anotação vai para a API em segundo plano
  function handleReminder(a: AdminAppointment) {
    markReminderSent(a.id)
      .then(() => {
        const now = new Date().toISOString();
        setAppointments((list) =>
          list.map((x) => (x.id === a.id ? { ...x, reminderSentAt: now } : x)),
        );
      })
      .catch(() =>
        setError("Não foi possível marcar o lembrete como enviado."),
      );
  }

  function dismiss(id: number) {
    setAppointments((list) => list.filter((a) => a.id !== id));
  }

  // Próximos em cima, os que já passaram embaixo
  const upcoming = appointments.filter((a) => !isPast(a));
  const past = appointments.filter((a) => isPast(a));

  // Resumo do dia (sem os cancelados agora há pouco)
  const active = appointments.filter((a) => !canceled[a.id]);
  const totalCents = active.reduce(
    (sum, a) => sum + Math.round(Number(a.totalPrice) * 100),
    0,
  );

  function renderCard(a: AdminAppointment) {
    const canceledAppointment = canceled[a.id];

    return (
      <li key={a.id}>
        <AppointmentCard
          appointment={canceledAppointment ?? a}
          note={
            !canceledAppointment && a.reminderSentAt
              ? `Lembrete enviado às ${formatTime(a.reminderSentAt)}`
              : undefined
          }
        >
          {canceledAppointment ? (
            // Depois de cancelar: avisar a cliente
            <div className="w-full">
              <p className="text-sm font-semibold text-ink">
                Agendamento cancelado
              </p>
              <div className="mt-3 flex gap-2">
                <a
                  href={whatsappLink(
                    a.client.phone,
                    cancellationMessage(canceledAppointment),
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-xl bg-primary py-3 text-center font-semibold text-white transition hover:bg-primary-hover"
                >
                  Avisar no WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => dismiss(a.id)}
                  className="rounded-xl border-2 border-soft px-5 py-3 font-semibold text-ink transition hover:border-primary"
                >
                  Ok
                </button>
              </div>
            </div>
          ) : cancelingId === a.id ? (
            // Perguntando o motivo do cancelamento
            <div className="w-full">
              <p className="text-sm font-semibold text-ink">
                Por que está cancelando?
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={busyId === a.id}
                  onClick={() => handleCancel(a, true)}
                  className="rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-hover disabled:opacity-50"
                >
                  Não posso atender · bloquear horário
                </button>
                <button
                  type="button"
                  disabled={busyId === a.id}
                  onClick={() => handleCancel(a, false)}
                  className="rounded-xl border-2 border-soft py-3 font-semibold text-ink transition hover:border-primary disabled:opacity-50"
                >
                  A cliente pediu para cancelar · liberar horário
                </button>
                <button
                  type="button"
                  onClick={() => setCancelingId(null)}
                  className="py-2 text-sm font-semibold text-muted"
                >
                  Voltar
                </button>
              </div>
            </div>
          ) : isPast(a) ? null : (
            // Normal: lembrar ou cancelar
            <>
              <a
                href={whatsappLink(a.client.phone, reminderMessage(a))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleReminder(a)}
                className="flex-1 rounded-xl bg-primary py-3 text-center font-semibold text-white transition hover:bg-primary-hover"
              >
                {a.reminderSentAt ? "Lembrar de novo" : "Lembrar"}
              </a>
              <button
                type="button"
                onClick={() => setCancelingId(a.id)}
                className="flex-1 rounded-xl border-2 border-soft py-3 font-semibold text-ink transition hover:border-primary"
              >
                Cancelar
              </button>
            </>
          )}
        </AppointmentCard>
      </li>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-ink">Agenda</h1>

      {/* Navegação por dia, com limites */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Dia anterior"
          disabled={date <= minDate}
          onClick={() => goTo(addDaysToDate(date, -1))}
          className="rounded-xl border-2 border-soft px-4 py-2 text-xl text-ink transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-30"
        >
          ‹
        </button>

        <div className="text-center">
          <p className="text-lg font-semibold text-ink">
            {date === today ? "Hoje" : formatSlotDate(date)}
          </p>
          {date === today ? (
            <p className="text-sm text-muted">{formatSlotDate(date)}</p>
          ) : (
            <button
              type="button"
              onClick={() => goTo(today)}
              className="text-sm font-semibold text-primary"
            >
              Voltar para hoje
            </button>
          )}
        </div>

        <button
          type="button"
          aria-label="Próximo dia"
          disabled={date >= maxDate}
          onClick={() => goTo(addDaysToDate(date, 1))}
          className="rounded-xl border-2 border-soft px-4 py-2 text-xl text-ink transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-30"
        >
          ›
        </button>
      </div>

      {!loading && active.length > 0 && (
        <p className="mt-5 text-sm text-muted">
          {active.length} {active.length === 1 ? "atendimento" : "atendimentos"}{" "}
          · {formatPrice(totalCents / 100)}
        </p>
      )}

      {loading && <p className="mt-6 text-muted">Carregando agenda...</p>}
      {error && (
        <p role="alert" className="mt-4 text-sm text-primary">
          {error}
        </p>
      )}

      {!loading && appointments.length === 0 && (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-soft p-6 text-center text-muted">
          Nenhum horário confirmado neste dia.
        </div>
      )}

      {!loading && upcoming.length > 0 && (
        <ul className="mt-4 space-y-3">{upcoming.map(renderCard)}</ul>
      )}

      {/* Os que já passaram ficam no fim, mais apagados */}
      {!loading && past.length > 0 && (
        <section className="mt-8 opacity-60">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
            Já atendidos
          </h2>
          <ul className="mt-3 space-y-3">{past.map(renderCard)}</ul>
        </section>
      )}
    </>
  );
}
