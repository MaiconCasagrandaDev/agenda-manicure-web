import type { Service } from "../api/services";
import { formatDuration, formatPrice } from "../lib/format";

type ServiceCardProps = {
  service: Service;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
};

export function ServiceCard({
  service,
  selected,
  disabled,
  onToggle,
}: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={selected}
      className={`flex min-h-28 w-full items-stretch overflow-hidden rounded-2xl border-2 bg-surface text-left transition
        ${selected ? "border-primary" : "border-soft"}
        ${disabled ? "cursor-not-allowed opacity-50" : "hover:border-primary"}`}
    >
      {/* Foto ocupando a lateral (ou espaço reservado até as fotos chegarem) */}
      {service.imageUrl ? (
        <img
          src={service.imageUrl}
          alt=""
          className="w-28 shrink-0 object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex w-28 shrink-0 items-center justify-center bg-soft text-3xl font-semibold text-primary"
        >
          {service.name.charAt(0)}
        </div>
      )}

      <div className="flex min-w-0 flex-1 items-center gap-3 p-4">
        <div className="min-w-0 flex-1">
          <p className="font-bold uppercase leading-tight text-ink">
            {service.name}
          </p>
          <p className="mt-1 text-sm text-muted">
            {formatPrice(service.price)}
            {service.priceIsStartingAt && " (a partir de)"} |{" "}
            {formatDuration(service.durationMinutes)}
          </p>
        </div>

        {/* Caixinha de marcar */}
        <span
          aria-hidden="true"
          className={`flex size-7 shrink-0 items-center justify-center rounded-md border-2 text-base font-bold
            ${selected ? "border-primary bg-primary text-white" : "border-ink"}`}
        >
          {selected && "✓"}
        </span>
      </div>
    </button>
  );
}
