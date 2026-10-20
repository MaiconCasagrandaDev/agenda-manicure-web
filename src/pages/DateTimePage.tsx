import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { getAvailability, type AvailableDay } from "../api/availability";
import { useBooking } from "../booking/BookingContext";
import { BookingHeader } from "../components/BookingHeader";

const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

// "2026-10-21" → "21/10"
function shortDate(date: string) {
  return `${date.slice(8, 10)}/${date.slice(5, 7)}`;
}

export function DateTimePage() {
  const { selectedServices, slot, setSlot } = useBooking();
  const navigate = useNavigate();
  const stripRef = useRef<HTMLDivElement>(null);

  const [days, setDays] = useState<AvailableDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(slot?.date ?? null);
  const [selectedTime, setSelectedTime] = useState<string | null>(slot?.time ?? null);

  // Texto estável ("1,3") para o useEffect saber quando buscar de novo
  const serviceKey = selectedServices.map((s) => s.id).join(",");

  useEffect(() => {
    if (!serviceKey) return;
    let ignore = false;

    getAvailability(serviceKey.split(",").map(Number))
      .then((data) => {
        if (ignore) return;
        setDays(data.days);
        // Mantém o dia escolhido antes, se ainda tiver horário;
        // senão, seleciona o primeiro dia com horário livre
        setSelectedDate((current) => {
          const stillValid = data.days.some((d) => d.date === current && d.slots.length > 0);
          return stillValid ? current : (data.days.find((d) => d.slots.length > 0)?.date ?? null);
        });
      })
      .catch(() => { if (!ignore) setError("Não foi possível carregar os horários."); })
      .finally(() => { if (!ignore) setLoading(false); });

    return () => { ignore = true; };
  }, [serviceKey]);

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

  const day = days.find((d) => d.date === selectedDate);
  const morning = day?.slots.filter((t) => t < "12:00") ?? [];
  const afternoon = day?.slots.filter((t) => t >= "12:00") ?? [];

  function scrollDays(direction: 1 | -1) {
    stripRef.current?.scrollBy({ left: direction * 240, behavior: "smooth" });
  }

  function chooseDay(date: string) {
    setSelectedDate(date);
    setSelectedTime(null); // horário de outro dia não vale mais
  }

  return (
    <>
      <BookingHeader backTo="/" />

      <main className="mx-auto max-w-md px-4 pt-6 pb-32">
        <h1 className="text-2xl font-semibold text-ink">Selecione a data</h1>

        {loading && <p className="mt-4 text-muted">Carregando horários...</p>}
        {error && <p className="mt-4 text-primary">{error}</p>}

        {!loading && !error && (
          <>
            {/* Faixa de dias com rolagem lateral */}
            <div className="mt-4 flex items-center gap-1">
              <button
                type="button"
                aria-label="Dias anteriores"
                onClick={() => scrollDays(-1)}
                className="shrink-0 px-1 text-2xl text-ink"
              >
                ‹
              </button>

              <div
                ref={stripRef}
                className="flex snap-x gap-2 overflow-x-auto py-1 [scrollbar-width:none]"
              >
                {days.map((d) => {
                  const full = d.slots.length === 0;
                  const selected = d.date === selectedDate;
                  return (
                    <button
                      key={d.date}
                      type="button"
                      disabled={full}
                      aria-pressed={selected}
                      onClick={() => chooseDay(d.date)}
                      className={`w-24 shrink-0 snap-start rounded-2xl border-2 py-2 text-center transition
                        ${selected ? "border-primary bg-primary text-white" : "border-soft bg-surface text-ink"}
                        ${full ? "cursor-not-allowed opacity-40" : "hover:border-primary"}`}
                    >
                      <span className="block text-lg font-semibold">{shortDate(d.date)}</span>
                      <span className="block text-sm">{full ? "Sem horários" : WEEKDAYS[d.weekday]}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                aria-label="Próximos dias"
                onClick={() => scrollDays(1)}
                className="shrink-0 px-1 text-2xl text-ink"
              >
                ›
              </button>
            </div>

            <h2 className="mt-8 text-2xl font-semibold text-ink">Horários disponíveis</h2>

            {!day && <p className="mt-3 text-muted">Nenhum horário livre nos próximos dias.</p>}

            {[
              { label: "Manhã", times: morning },
              { label: "Tarde", times: afternoon },
            ].map(
              (group) =>
                group.times.length > 0 && (
                  <section key={group.label} className="mt-5">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">
                      {group.label}
                    </h3>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {group.times.map((time) => {
                        const selected = time === selectedTime;
                        return (
                          <button
                            key={time}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => setSelectedTime(time)}
                            className={`rounded-full border-2 py-2 text-center transition
                              ${selected
                                ? "border-primary bg-primary font-semibold text-white"
                                : "border-soft bg-surface text-ink hover:border-primary"}`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ),
            )}
          </>
        )}
      </main>

      {/* Botão fixo embaixo, igual à referência */}
      <footer className="fixed inset-x-0 bottom-0 bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-md px-4 py-3">
          <button
            type="button"
            disabled={!selectedDate || !selectedTime}
            onClick={() => {
              if (!selectedDate || !selectedTime) return;
              setSlot({ date: selectedDate, time: selectedTime });
              navigate("/seus-dados");
            }}
            className="w-full rounded-2xl bg-primary py-4 text-lg font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Avançar
          </button>
        </div>
      </footer>
    </>
  );
}