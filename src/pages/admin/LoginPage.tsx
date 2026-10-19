import { useState } from "react";
import { useNavigate } from "react-router";
import { TextField } from "../../components/TextField";
import { login } from "../../api/admin";
import { ApiError } from "../../api/errors";

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit() {
        if (submitting) return; // evita enviar duas vezes com clique duplo

        if (!email.trim() || !password) {
        setError("Preencha o e-mail e a senha.");
        return;
        }

        setError(null);
        setSubmitting(true);
        try {
        await login(email, password);
        navigate("/admin", { replace: true }); // replace: o "voltar" não retorna ao login
        } catch (err) {
        // Mostra a mensagem da API (genérica de propósito) ou erro de conexão
        setError(
            err instanceof ApiError
            ? err.message
            : "Sem conexão com o servidor. Tente novamente.",
        );
        setPassword("");
        } finally {
        setSubmitting(false);
        }
    }

    return (
        <main className="mx-auto flex min-h-svh max-w-sm flex-col justify-center px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Painel
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-ink">Entrar</h1>

        <form
            noValidate
            className="mt-6 space-y-4"
            onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
            }}
        >
            <TextField
            id="email"
            label="E-mail"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
            id="password"
            label="Senha"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            {/* role="alert" faz o leitor de tela anunciar o erro assim que aparece */}
            {error && (
            <p role="alert" className="text-sm text-primary">
                {error}
            </p>
            )}

            <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
            {submitting ? "Entrando..." : "Entrar"}
            </button>
        </form>
        </main>
    );
}
