import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { deleteTimeOff, getTimeOffs, type TimeOff } from "../../api/timeOff";
import { ApiError } from "../../api/errors";
import {
  addDaysToDate,
  formatLongDate,
  formatTime,
  localDateOf,
  shortDate,
} from "../../lib/format";

const DAY_MS = 24 * 60 * 60 * 1000;

// Traduz o intervalo do banco em algo legível
function describe(b: TimeOff) {
  const start = formatTime(b.startsAt);
  const end = formatTime(b.endsAt);

  // Começa e termina à meia-noite = dias inteiros
  if (start === "00:00" && end === "00:00") {
    const firstDay = localDateOf(b.startsAt);
    const lastDay = addDaysToDate(localDateOf(b.endsAt), -1); // o fim é a meia-noite do dia seguinte
    const days =
      Math.round((Date.parse(lastDay) - Date.parse(firstDay)) / DAY_MS) + 1;

    if (days === 1) return "Dia inteiro";
    return `${shortDate(firstDay)} até ${shortDate(lastDay)} · ${days} dias`;
  }

  return `${start} às ${end}`;
}

export function BlocksPage() {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState<TimeOff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [confirmingId, setConfirmingId] = useState<number | null>(null); // card pedindo confirmação

  useEffect(() => {
    let ignore = false;

    getTimeOffs()
      .then((data) => {
        if (!ignore) setBlocks(data);
      })
      .catch((err) => {
        if (ignore) return;
        if (err instanceof ApiError && err.status === 401) {
          navigate("/admin/login", { replace: true });
        } else {
          setError("Não foi possível carregar os bloqueios.");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [navigate]);

  async function handleUnblock(id: number) {
    setBusyId(id);
    setError(null);
    try {
      await deleteTimeOff(id);
      setBlocks((list) => list.filter((b) => b.id !== id));
      setConfirmingId(null);
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

  // Agrupa por dia de início, mantendo a ordem (a API já manda ordenado)
  const groups = new Map<string, TimeOff[]>();
  for (const b of blocks) {
    const day = localDateOf(b.startsAt);
    groups.set(day, [...(groups.get(day) ?? []), b]);
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-ink">Bloqueios</h1>
      <p className="mt-1 text-muted">Horários em que você não atende.</p>

      <Link
        to="/admin/bloqueios/novo"
        className="mt-5 block rounded-xl bg-primary py-3 text-center font-semibold text-white transition hover:bg-primary-hover"
      >
        + Novo bloqueio
      </Link>

      {loading && <p className="mt-6 text-muted">Carregando bloqueios...</p>}
      {error && (
        <p role="alert" className="mt-4 text-sm text-primary">
          {error}
        </p>
      )}

      {!loading && !error && blocks.length === 0 && (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-soft p-6 text-center text-muted">
          Nenhum bloqueio. Todos os horários do expediente estão abertos.
        </div>
      )}

      {[...groups.entries()].map(([day, items]) => (
        <section key={day} className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
            {formatLongDate(items[0].startsAt)}
          </h2>

          <ul className="mt-2 space-y-3">
            {items.map((b) => (
              <li key={b.id}>
                <article className="rounded-2xl border-2 border-soft bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink">{describe(b)}</p>
                      {b.reason && (
                        <p className="mt-0.5 text-sm text-muted">{b.reason}</p>
                      )}
                    </div>
                    {confirmingId !== b.id && (
                      <button
                        type="button"
                        onClick={() => setConfirmingId(b.id)}
                        className="shrink-0 text-sm font-semibold text-primary"
                      >
                        Desbloquear
                      </button>
                    )}
                  </div>

                  {/* Confirmação no próprio card, igual à Agenda */}
                  {confirmingId === b.id && (
                    <div className="mt-3">
                      <p className="text-sm text-ink">
                        Desbloquear? O horário volta a aparecer para as
                        clientes.
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          disabled={busyId === b.id}
                          onClick={() => handleUnblock(b.id)}
                          className="flex-1 rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-hover disabled:opacity-50"
                        >
                          Desbloquear
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingId(null)}
                          className="flex-1 rounded-xl border-2 border-soft py-3 font-semibold text-ink transition hover:border-primary"
                        >
                          Voltar
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
