import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { getMe, logout } from "../../api/admin";
import { BookingHeader } from "../../components/BookingHeader";

// O que as abas recebem da moldura (para atualizar o número de pedidos)
export type AdminOutletContext = {
  setPendingCount: (count: number) => void;
};

const TABS = [
  { to: "/admin", label: "Pedidos", end: true }, // end: só fica ativa em /admin exato
  { to: "/admin/agenda", label: "Agenda", end: false },
  { to: "/admin/bloqueios", label: "Bloqueios", end: false },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  // Ao abrir qualquer aba do painel, confere se está logada
  useEffect(() => {
    let ignore = false;

    getMe()
      .then((me) => {
        if (ignore) return;
        if (me) setChecking(false);
        else navigate("/admin/login", { replace: true });
      })
      .catch(() => {
        if (!ignore) setError("Não foi possível conectar ao servidor.");
      });

    return () => {
      ignore = true;
    };
  }, [navigate]);

  async function handleLogout() {
    try {
      await logout();
      navigate("/admin/login", { replace: true });
    } catch {
      setError("Não foi possível sair. Tente novamente.");
    }
  }

  if (error) return <p className="mx-auto max-w-md px-4 pt-8 text-primary">{error}</p>;
  if (checking) return <p className="mx-auto max-w-md px-4 pt-8 text-muted">Carregando...</p>;

  const context: AdminOutletContext = { setPendingCount };

  return (
    <>
      <BookingHeader
        title="Painel"
        action={
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-semibold text-primary"
          >
            Sair
          </button>
        }
      />

      <main className="mx-auto max-w-md px-4 pt-6 pb-28">
        {/* Aqui entra a aba atual (Pedidos, Agenda ou Bloqueios) */}
        <Outlet context={context} />
      </main>

      {/* Barra de abas fixa embaixo */}
      <nav aria-label="Painel" className="fixed inset-x-0 bottom-0 border-t border-soft bg-surface">
        <div className="mx-auto grid max-w-md grid-cols-3">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `relative py-4 text-center text-sm font-semibold transition
                ${isActive ? "text-primary" : "text-muted hover:text-ink"}`
              }
            >
              {({ isActive }) => (
                <>
                  {tab.label}
                  {tab.label === "Pedidos" && pendingCount > 0 && (
                    <span className="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                      {pendingCount}
                    </span>
                  )}
                  {/* Risquinho em cima da aba ativa */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-8 top-0 h-0.5 rounded-full bg-primary"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}