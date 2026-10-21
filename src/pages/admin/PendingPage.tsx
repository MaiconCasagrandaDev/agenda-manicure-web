import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import {
  getPendingAppointments,
  updateAppointment,
  type AdminAppointment,
} from "../../api/adminAppointments";
import { ApiError } from "../../api/errors";
import { AppointmentCard } from "../../components/AppointmentCard";
import { confirmationMessage, declineMessage, whatsappLink } from "../../lib/whatsapp";
import type { AdminOutletContext } from "./AdminLayout";

// Depois de confirmar/recusar, o card fica na tela com o botão do WhatsApp
type Done = { kind: "confirmed" | "declined"; appointment: AdminAppointment };

export function PendingPage() {
  const { setPendingCount } = useOutletContext<AdminOutletContext>();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [done, setDone] = useState<Record<number, Done>>({});

  useEffect(() => {
    let ignore = false;

    getPendingAppointments()
      .then((data) => {
        if (ignore) return;
        setAppointments(data.appointments);
        setPendingCount(data.pendingCount);
      })
      .catch((err) => {
        if (ignore) return;
        if (err instanceof ApiError && err.status === 401) {
          navigate("/admin/login", { replace: true }); // sessão expirou
        } else {
          setError("Não foi possível carregar os pedidos.");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [navigate, setPendingCount]);

  async function handleAction(a: AdminAppointment, action: "confirm" | "decline") {
    if (
      action === "decline" &&
      !window.confirm(`Recusar o pedido de ${a.customerName}? O horário volta a ficar livre.`)
    ) {
      return;
    }

    setBusyId(a.id);
    setError(null);
    try {
      const updated = await updateAppointment(a.id, action);
      setDone((current) => ({
        ...current,
        [a.id]: { kind: action === "confirm" ? "confirmed" : "declined", appointment: updated },
      }));
      setPendingCount((count) => Math.max(0, count - 1));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(err instanceof ApiError ? err.message : "Sem conexão com o servidor.");
    } finally {
      setBusyId(null);
    }
  }

  // Tira o card da lista depois que ela terminou (enviou ou não a mensagem)
  function dismiss(id: number) {
    setAppointments((current) => current.filter((a) => a.id !== id));
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-ink">Pedidos</h1>
      <p className="mt-1 text-muted">Confirme ou recuse os horários pedidos pelas clientes.</p>

      {loading && <p className="mt-6 text-muted">Carregando pedidos...</p>}
      {error && (
        <p role="alert" className="mt-4 text-sm text-primary">
          {error}
        </p>
      )}

      {!loading && appointments.length === 0 && (
        <div className="mt-8 rounded-2xl border-2 border-dashed border-soft p-6 text-center text-muted">
          Nenhum pedido esperando confirmação.
        </div>
      )}

      <ul className="mt-6 space-y-3">
        {appointments.map((a) => {
          const result = done[a.id];
          return (
            <li key={a.id}>
              <AppointmentCard appointment={result?.appointment ?? a} showDate>
                {result ? (
                  <div className="w-full">
                    <p className="text-sm font-semibold text-ink">
                      {result.kind === "confirmed" ? "Horário confirmado" : "Pedido recusado"}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <a
                        href={whatsappLink(
                          a.client.phone,
                          result.kind === "confirmed"
                            ? confirmationMessage(result.appointment)
                            : declineMessage(result.appointment),
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
                ) : (
                  <>
                    <button
                      type="button"
                      disabled={busyId === a.id}
                      onClick={() => handleAction(a, "confirm")}
                      className="flex-1 rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-hover disabled:opacity-50"
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      disabled={busyId === a.id}
                      onClick={() => handleAction(a, "decline")}
                      className="flex-1 rounded-xl border-2 border-soft py-3 font-semibold text-ink transition hover:border-primary disabled:opacity-50"
                    >
                      Recusar
                    </button>
                  </>
                )}
              </AppointmentCard>
            </li>
          );
        })}
      </ul>
    </>
  );
}