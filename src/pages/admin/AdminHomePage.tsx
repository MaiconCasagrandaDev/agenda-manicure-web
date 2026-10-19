import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getMe, logout, type Admin } from "../../api/admin";

export function AdminHomePage() {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Ao abrir, pergunta à API quem está logado. Ninguém → vai para o login.
    useEffect(() => {
        let ignore = false;

        getMe()
        .then((me) => {
            if (ignore) return;
            if (me) setAdmin(me);
            else navigate("/admin/login", { replace: true });
        })
        .catch(() => { if (!ignore) setError("Não foi possível conectar ao servidor."); });

        return () => { ignore = true; };
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
    if (!admin) return <p className="mx-auto max-w-md px-4 pt-8 text-muted">Carregando...</p>;

    return (
        <main className="mx-auto max-w-md px-4 pt-8">
        <div className="flex items-center justify-between">
            <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Painel</p>
            <h1 className="mt-1 text-2xl font-semibold text-ink">Agenda</h1>
            </div>
            <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border-2 border-soft px-4 py-2 text-sm font-semibold text-ink transition hover:border-primary"
            >
            Sair
            </button>
        </div>
        <p className="mt-2 text-sm text-muted">Logado como {admin.email}</p>
        <p className="mt-8 text-muted">Aqui vai ficar a agenda da semana.</p>
        </main>
    );
    }