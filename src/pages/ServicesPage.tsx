import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getServices, type Service } from "../api/services";
import { useBooking } from "../booking/BookingContext";
import { BookingHeader } from "../components/BookingHeader";
import { ServiceCard } from "../components/ServiceCard";
import { formatDuration, formatPrice } from "../lib/format";
import { BookingFooter } from "../components/BookingFooter";

const MAX_SELECTED = 3;

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { selectedServices, setSelectedServices } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    getServices()
      .then((data) => {
        if (!ignore) setServices(data);
      })
      .catch(() => {
        if (!ignore) setError(true);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Marca ou desmarca um serviço
  function toggleService(service: Service) {
    setSelectedServices((current) =>
      current.some((s) => s.id === service.id)
        ? current.filter((s) => s.id !== service.id)
        : [...current, service],
    );
  }

  // Valores calculados a partir da seleção
  const count = selectedServices.length;
  const limitReached = count >= MAX_SELECTED;
  const totalCents = selectedServices.reduce(
    (sum, s) => sum + Math.round(Number(s.price) * 100),
    0,
  );
  const totalMinutes = selectedServices.reduce(
    (sum, s) => sum + s.durationMinutes,
    0,
  );
  const hasStartingAt = selectedServices.some((s) => s.priceIsStartingAt);

  return (
    <>
      <BookingHeader />

      <main className="mx-auto max-w-md px-4 pt-6 pb-32">
        <h1 className="text-2xl font-semibold text-ink">
          Agende seu atendimento
        </h1>
        <p className="mt-2 text-muted">
          Selecione até {MAX_SELECTED} serviços para o agendamento.
        </p>

        {loading && <p className="mt-6 text-muted">Carregando serviços...</p>}
        {error && (
          <p className="mt-6 text-primary">
            Não foi possível carregar os serviços.
          </p>
        )}

        <ul className="mt-6 space-y-3">
          {services.map((service) => {
            const selected = selectedServices.some((s) => s.id === service.id);
            return (
              <li key={service.id}>
                <ServiceCard
                  service={service}
                  selected={selected}
                  disabled={!selected && limitReached}
                  onToggle={() => toggleService(service)}
                />
              </li>
            );
          })}
        </ul>

        {limitReached && (
          <p className="mt-3 text-sm text-muted">
            Você já escolheu {MAX_SELECTED} serviços. Desmarque um para trocar.
          </p>
        )}
      </main>

      <BookingFooter disabled={count === 0} onNext={() => navigate("/horario")}>
        {count === 0 ? (
          <span className="text-muted">Nenhum serviço escolhido</span>
        ) : (
          <>
            <p className="font-semibold text-ink">
              {hasStartingAt && "a partir de "}
              {formatPrice(totalCents / 100)}
            </p>
            <p className="text-muted">{formatDuration(totalMinutes)}</p>
          </>
        )}
      </BookingFooter>
    </>
  );
}
