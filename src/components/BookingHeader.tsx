import { Link } from "react-router";
import { SALON_NAME } from "../config";

type BookingHeaderProps = {
  backTo?: string; // opcional: sem ele, a seta não aparece
  title?: string;  // texto grande ao lado do logo
};

export function BookingHeader({ backTo, title = "Agendar" }: BookingHeaderProps) {
  return (
    <header className="border-b border-soft bg-background">
      {/* relative: a seta fica "presa" na esquerda sem empurrar o centro */}
      <div className="relative mx-auto flex max-w-md items-center justify-center px-4 py-4">
        {backTo && (
          <Link
            to={backTo}
            aria-label="Voltar"
            className="absolute left-4 top-1/2 -translate-y-1/2 px-1 text-2xl text-ink"
          >
            ←
          </Link>
        )}

        <div className="flex items-center gap-5">
          {/* Logo provisório: inicial do nome dentro de um círculo */}
          <div
            aria-hidden="true"
            className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-soft bg-surface text-lg font-semibold text-primary"
          >
            {SALON_NAME.charAt(0)}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              {SALON_NAME}
            </p>
            <p className="mt-0.5 text-xl font-semibold text-ink">{title}</p>
          </div>
        </div>
      </div>
    </header>
  );
}