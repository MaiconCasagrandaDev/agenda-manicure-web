import { Link } from "react-router";
import { SALON_NAME } from "../config";

type BookingHeaderProps = {
  backTo?: string; // opcional: sem ele, a seta não aparece
};

export function BookingHeader({ backTo }: BookingHeaderProps) {
  return (
    <header className="border-b border-soft bg-background">
      <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
        {backTo && (
          <Link to={backTo} aria-label="Voltar" className="px-1 text-2xl text-ink">
            ←
          </Link>
        )}

        {/* Logo provisório: inicial do nome dentro de um círculo */}
        <div
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-soft bg-surface text-lg font-semibold text-primary"
        >
          {SALON_NAME.charAt(0)}
        </div>

        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-widest text-muted">
            {SALON_NAME}
          </p>
          <p className="text-xl font-semibold text-ink">Agendar</p>
        </div>
      </div>
    </header>
  );
}