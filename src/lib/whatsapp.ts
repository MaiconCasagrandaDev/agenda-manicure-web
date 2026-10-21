import type { AdminAppointment } from "../api/adminAppointments";
import { SALON_NAME } from "../config";
import { formatLongDate, formatTime } from "./format";

// wa.me pede só os números, com o código do país (FAQ oficial do WhatsApp)
export function whatsappLink(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

function when(a: AdminAppointment) {
  return `${formatLongDate(a.startsAt)}, às ${formatTime(a.startsAt)}`;
}

function services(a: AdminAppointment) {
  return a.items.map((i) => i.serviceName).join(", ");
}

export function confirmationMessage(a: AdminAppointment) {
  return [
    `Oi, ${firstName(a.customerName)}! Seu horário no ${SALON_NAME} está confirmado ✅`,
    "",
    `📅 ${when(a)}`,
    `💅 ${services(a)}`,
    "",
    "Até lá!",
  ].join("\n");
}

export function declineMessage(a: AdminAppointment) {
  return [
    `Oi, ${firstName(a.customerName)}! Infelizmente não vou conseguir te atender ${when(a)}.`,
    "",
    "Quer escolher outro horário? Me chama aqui que a gente combina 😊",
  ].join("\n");
}

export function reminderMessage(a: AdminAppointment) {
  return [
    `Oi, ${firstName(a.customerName)}! Passando para lembrar do seu horário no ${SALON_NAME} 💅`,
    "",
    `📅 ${when(a)}`,
    `💅 ${services(a)}`,
    "",
    "Te espero!",
  ].join("\n");
}