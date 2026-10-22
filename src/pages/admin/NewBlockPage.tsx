import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { createTimeOff, type NewTimeOff } from "../../api/timeOff";
import { ApiError } from "../../api/errors";
import { formatSlotDate, shortDate, todayInBrazil } from "../../lib/format";

type Kind = NewTimeOff["kind"];

const KINDS: { value: Kind; label: string }[] = [
  { value: "day", label: "Dia inteiro" },
  { value: "morning", label: "Manhã" },
  { value: "afternoon", label: "Tarde" },
  { value: "range", label: "Horário específico" },
  { value: "period", label: "Férias" },
];

const KIND_SUFFIX = {
  day: "dia inteiro",
  morning: "manhã",
  afternoon: "tarde",
};

// 07:00, 07:30 ... 21:00 (mesma grade de 30 min da agenda)
const TIMES = Array.from({ length: 29 }, (_, i) => {
  const minutes = 7 * 60 + i * 30;
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
});

const DAY_MS = 24 * 60 * 60 * 1000;

const inputClass =
  "mt-1 w-full rounded-xl border-2 border-soft bg-surface px-3 py-3 text-ink focus:border-primary focus:outline-none";

export function NewBlockPage() {
  const navigate = useNavigate();
  const today = todayInBrazil();

  const [kind, setKind] = useState<Kind>("day");
  const [date, setDate] = useState(today);
  const [from, setFrom] = useState("09:00");
  const [to, setTo] = useState("10:00");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resumo do que vai ser bloqueado; null = formulário incompleto ou inválido
  let summary: string | null = null;
  if (kind === "period") {
    if (startDate && endDate && endDate >= startDate) {
      const days =
        Math.round((Date.parse(endDate) - Date.parse(startDate)) / DAY_MS) + 1;
      summary = `${shortDate(startDate)} até ${shortDate(endDate)} · ${days} ${days === 1 ? "dia" : "dias"}`;
    }
  } else if (date) {
    if (kind === "range") {
      if (to > from) summary = `${formatSlotDate(date)} · ${from} às ${to}`;
    } else {
      summary = `${formatSlotDate(date)} · ${KIND_SUFFIX[kind]}`;
    }
  }

  // Monta só os campos que a API espera para cada tipo
  function buildInput(): NewTimeOff {
    const extra = { reason: reason.trim() || undefined };
    if (kind === "period") return { kind, startDate, endDate, ...extra };
    if (kind === "range") return { kind, date, from, to, ...extra };
    return { kind, date, ...extra };
  }

  async function handleSubmit() {
    if (!summary || saving) return;
    setSaving(true);
    setError(null);
    try {
      await createTimeOff(buildInput());
      navigate("/admin/bloqueios");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(
        err instanceof ApiError ? err.message : "Sem conexão com o servidor.",
      );
      setSaving(false);
    }
  }

  function handleStartDate(value: string) {
    setStartDate(value);
    if (endDate < value) setEndDate(value); // o fim nunca fica antes do começo
  }

  return (
    <>
      <Link
        to="/admin/bloqueios"
        className="text-sm font-semibold text-primary"
      >
        ← Bloqueios
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-ink">Novo bloqueio</h1>

      <form
        className="mt-5 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
      >
        {/* Tipo */}
        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-widest text-primary">
            O que bloquear
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <button
                key={k.value}
                type="button"
                aria-pressed={kind === k.value}
                onClick={() => setKind(k.value)}
                className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${
                  kind === k.value
                    ? "border-primary bg-primary text-white"
                    : "border-soft bg-surface text-ink hover:border-primary"
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Data (ou período, nas férias) */}
        {kind === "period" ? (
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-semibold text-ink">
              De
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => handleStartDate(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-semibold text-ink">
              Até
              <input
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClass}
              />
            </label>
          </div>
        ) : (
          <label className="block text-sm font-semibold text-ink">
            Data
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </label>
        )}

        {/* Horário específico */}
        {kind === "range" && (
          <div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-semibold text-ink">
                De
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className={inputClass}
                >
                  {TIMES.slice(0, -1).map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold text-ink">
                Até
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className={inputClass}
                >
                  {TIMES.filter((t) => t > from).map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>
            {to > from && (
              <p className="mt-2 text-sm text-muted">
                Você volta a atender às {to}.
              </p>
            )}
          </div>
        )}

        <label className="block text-sm font-semibold text-ink">
          Motivo <span className="font-normal text-muted">(opcional)</span>
          <input
            type="text"
            maxLength={100}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ex.: médico, curso, feriado"
            className={inputClass}
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-primary">
            {error}
          </p>
        )}

        {/* Resumo + botão */}
        <div className="rounded-2xl border-2 border-soft bg-surface p-4">
          <p className="font-semibold text-ink">
            {summary ?? "Confira as datas e horários"}
          </p>
          <button
            type="submit"
            disabled={!summary || saving}
            className="mt-3 w-full rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-hover disabled:opacity-50"
          >
            {saving ? "Bloqueando..." : "Bloquear"}
          </button>
        </div>
      </form>
    </>
  );
}
