import { useEffect, useState } from "react";
import { getServices, type Service } from "../api/services";
import { ServiceCard } from "../components/ServiceCard";
import { formatDuration, formatPrice } from "../lib/format";

const MAX_SELECTED = 3;

export function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    // Guardamos só os IDs escolhidos, não os serviços inteiros
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    useEffect(() => {
        let ignore = false;

        getServices()
        .then((data) => { if (!ignore) setServices(data); })
        .catch(() => { if (!ignore) setError(true); })
        .finally(() => { if (!ignore) setLoading(false); });

        return () => { ignore = true; };
    }, []);

    // Marca ou desmarca um serviço
    function toggleService(id: number) {
        setSelectedIds((current) =>
        current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
        );
    }

    // Valores calculados a partir do estado (não precisam de useState)
    const selectedServices = services.filter((s) => selectedIds.includes(s.id));
    const limitReached = selectedIds.length >= MAX_SELECTED;
    // Soma em centavos para não ter erro de arredondamento
    const totalCents = selectedServices.reduce((sum, s) => sum + Math.round(Number(s.price) * 100), 0);
    const totalMinutes = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);
    const hasStartingAt = selectedServices.some((s) => s.priceIsStartingAt);

    if (loading) return <p className="mx-auto max-w-md px-4 pt-8 text-muted">Carregando serviços...</p>;
    if (error) return <p className="mx-auto max-w-md px-4 pt-8 text-primary">Não foi possível carregar os serviços.</p>;

    return (
        <>
        <main className="mx-auto max-w-md px-4 pt-8 pb-32">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Agendar</p>
            <h1 className="mt-1 text-2xl font-semibold text-ink">Escolha seus serviços</h1>
            <p className="mt-1 text-sm text-muted">Até {MAX_SELECTED} por horário</p>

            <ul className="mt-6 space-y-3">
            {services.map((service) => {
                const selected = selectedIds.includes(service.id);
                return (
                <li key={service.id}>
                    <ServiceCard
                    service={service}
                    selected={selected}
                    disabled={!selected && limitReached}
                    onToggle={() => toggleService(service.id)}
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

        {/* Barra fixa no rodapé com o resumo e o botão */}
        <footer className="fixed inset-x-0 bottom-0 border-t border-soft bg-surface">
            <div className="mx-auto flex max-w-md items-center justify-between gap-4 px-4 py-3">
            <div className="text-sm">
                {selectedServices.length === 0 ? (
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
            </div>
            <button
                type="button"
                disabled={selectedServices.length === 0}
                className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
                Avançar
            </button>
            </div>
        </footer>
        </>
    );
}