import type { Service } from "../api/services";
import { formatDuration, formatPrice } from "../lib/format";

// Props: o que a tela "entrega" para o card
type ServiceCardProps = {
    service: Service;
    selected: boolean;
    disabled: boolean;
    onToggle: () => void;
};

export function ServiceCard({ service, selected, disabled, onToggle }: ServiceCardProps) {
    return (
        // Um <button> de verdade: funciona com teclado e leitor de tela
        <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-pressed={selected}
        className={`flex w-full items-center gap-3 rounded-2xl border-2 bg-surface p-3 text-left transition
            ${selected ? "border-primary" : "border-soft"}
            ${disabled ? "cursor-not-allowed opacity-50" : "hover:border-primary"}`}
        >
        {/* Foto do serviço, ou um quadrado na cor suave enquanto não tem foto */}
        {service.imageUrl ? (
            <img src={service.imageUrl} alt="" className="size-16 shrink-0 rounded-xl object-cover" />
        ) : (
            <div className="size-16 shrink-0 rounded-xl bg-soft" aria-hidden="true" />
        )}

        <div className="min-w-0 flex-1">
            <p className="font-semibold text-ink">{service.name}</p>
            <p className="text-sm text-muted">
            {service.priceIsStartingAt && "a partir de "}
            {formatPrice(service.price)} · {formatDuration(service.durationMinutes)}
            </p>
        </div>

        {/* Caixinha de marcar */}
        <span
            aria-hidden="true"
            className={`flex size-6 shrink-0 items-center justify-center rounded-md text-sm font-bold
            ${selected ? "bg-primary text-white" : "border-2 border-muted"}`}
        >
            {selected && "✓"}
        </span>
        </button>
    );
}