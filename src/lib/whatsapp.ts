import { SALON_NAME } from "../config";
import { formatLongDate, formatTime } from "./format";

// O que as mensagens usam. Serve para os agendamentos (Pedidos/Agenda)
// e para as clientes canceladas por um bloqueio.
type MessageData = {
  customerName: string;
  startsAt: string;
  items: { serviceName: string }[];
};

// wa.me pede só os números, com o código do país (FAQ oficial do WhatsApp)
export function whatsappLink(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

function when(a: MessageData) {
  return `${formatLongDate(a.startsAt)}, às ${formatTime(a.startsAt)}`;
}

function services(a: MessageData) {
  return a.items.map((i) => i.serviceName).join(", ");
}

export function confirmationMessage(a: MessageData) {
  return [
    `Oi, ${firstName(a.customerName)}! Seu horário no ${SALON_NAME} está confirmado ✅`,
    "",
    `📅 ${when(a)}`,
    `💅 ${services(a)}`,
    "",
    "Até lá!",
  ].join("\n");
}

export function declineMessage(a: MessageData) {
  return [
    `Oi, ${firstName(a.customerName)}! Infelizmente não vou conseguir te atender ${when(a)}.`,
    "",
    "Quer escolher outro horário? Me chama aqui que a gente combina 😊",
  ].join("\n");
}

export function reminderMessage(a: MessageData) {
  return [
    `Oi, ${firstName(a.customerName)}! Passando para lembrar do seu horário no ${SALON_NAME} 💅`,
    "",
    `📅 ${when(a)}`,
    `💅 ${services(a)}`,
    "",
    "Te espero!",
  ].join("\n");
}

export function cancellationMessage(a: MessageData) {
  return [
    `Oi, ${firstName(a.customerName)}! Infelizmente precisei cancelar o seu horário de ${when(a)}.`,
    "",
    "Me desculpe pelo transtorno! Quer remarcar? Me chama aqui que a gente encontra outro horário 😊",
  ].join("\n");
}