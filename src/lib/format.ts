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

const WEEKDAYS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

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

// 3 → "Quarta"
export function weekdayName(weekday: number) {
  return WEEKDAYS[weekday] ?? "";
}

// "2026-10-21" → "21/10"
export function shortDate(date: string) {
  return `${date.slice(8, 10)}/${date.slice(5, 7)}`;
}

// "2026-10-21" → "Quarta, 21/10"
export function formatSlotDate(date: string) {
  // Meio-dia em UTC: o dia da semana não muda em nenhum fuso do Brasil
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  return `${weekdayName(weekday)}, ${shortDate(date)}`;
}

const dateInBrazil = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// Hoje em Brasília → "2026-10-21" (mesmo que o celular esteja em outro fuso)
export function todayInBrazil() {
  const parts = dateInBrazil.formatToParts(new Date());
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

// "2026-10-21" + 1 → "2026-10-22" (cuida da virada de mês e de ano)
export function addDaysToDate(date: string, days: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
