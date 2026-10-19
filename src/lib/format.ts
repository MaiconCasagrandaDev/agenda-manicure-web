// Formata como dinheiro brasileiro: 35 → "R$ 35,00"
const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

const TIME_ZONE = "America/Sao_Paulo";

const longDate = new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
});

const shortTime = new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
});

export function formatPrice(value: string | number) {
    return currency.format(Number(value));
}

// Minutos em texto: 40 → "40 min", 60 → "1h", 90 → "1h30"
export function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    if (hours === 0) return `${rest} min`;
    if (rest === 0) return `${hours}h`;
    return `${hours}h${String(rest).padStart(2, "0")}`;
}

// "2026-10-21T17:00:00.000Z" → "Quarta-feira, 21 de outubro"
export function formatLongDate(iso: string) {
    const text = longDate.format(new Date(iso));
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// "2026-10-21T17:00:00.000Z" → "14:00"
export function formatTime(iso: string) {
    return shortTime.format(new Date(iso));
}
