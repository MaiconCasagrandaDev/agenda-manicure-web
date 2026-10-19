// Formata como dinheiro brasileiro: 35 → "R$ 35,00"
const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
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
