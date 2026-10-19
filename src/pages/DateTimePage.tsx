import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useBooking } from "../booking/BookingContext";

// PROVISÓRIO: lista fixa de 30 em 30 min. A versão final vai pedir
// à API só os horários livres do dia escolhido.
const TIMES = Array.from({ length: 20 }, (_, i) => {
    const minutes = 9 * 60 + i * 30; // de 09:00 até 18:30
    const h = String(Math.floor(minutes / 60)).padStart(2, "0");
    const m = String(minutes % 60).padStart(2, "0");
    return `${h}:${m}`;
});

// Data local no formato "2026-10-21" (o que o <input type="date"> usa)
function toInputDate(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
    }

    export function DateTimePage() {
    const { selectedServices, slot, setSlot } = useBooking();
    const [date, setDate] = useState(slot?.date ?? "");
    const [time, setTime] = useState(slot?.time ?? "");
    const navigate = useNavigate();

    if (selectedServices.length === 0) {
        return (
        <main className="mx-auto max-w-md px-4 pt-8">
            <p className="text-muted">Você ainda não escolheu nenhum serviço.</p>
            <Link to="/" className="mt-2 inline-block font-semibold text-primary">
            Escolher serviços
            </Link>
        </main>
        );
    }

    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);

    return (
        <main className="mx-auto max-w-md px-4 pt-8 pb-12">
        <Link to="/" className="text-sm text-primary">← Voltar</Link>
        <h1 className="mt-4 text-2xl font-semibold text-ink">Data e horário</h1>
        <p className="mt-1 text-sm text-muted">
            {selectedServices.map((s) => s.name).join(", ")}
        </p>

        <div className="mt-6 space-y-4">
            <div>
            <label htmlFor="date" className="block text-sm font-semibold text-ink">Dia</label>
            <input
                id="date"
                type="date"
                min={toInputDate(today)}
                max={toInputDate(maxDate)}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-xl border-2 border-soft bg-surface px-3 py-3 text-ink outline-none focus:border-primary"
            />
            </div>

            <div>
            <label htmlFor="time" className="block text-sm font-semibold text-ink">Horário</label>
            <select
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1 w-full rounded-xl border-2 border-soft bg-surface px-3 py-3 text-ink outline-none focus:border-primary"
            >
                <option value="">Escolha um horário</option>
                {TIMES.map((t) => (
                <option key={t} value={t}>{t}</option>
                ))}
            </select>
            </div>

            <p className="text-xs text-muted">
            Em breve aqui vão aparecer só os horários livres.
            </p>

            <button
            type="button"
            disabled={!date || !time}
            onClick={() => {
                setSlot({ date, time });
                navigate("/seus-dados");
            }}
            className="w-full rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
            Continuar
            </button>
        </div>
        </main>
    );
}