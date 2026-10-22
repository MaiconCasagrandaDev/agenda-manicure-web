import { Link } from "react-router";

export function NewBlockPage() {
  return (
    <>
      <Link to="/admin/bloqueios" className="text-sm font-semibold text-primary">
        ← Voltar
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-ink">Novo bloqueio</h1>
      <p className="mt-1 text-muted">Em breve.</p>
    </>
  );
}