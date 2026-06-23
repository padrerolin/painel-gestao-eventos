import type { EventStatus, ParticipantStatus, ParticipantType } from "./types";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}

export function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso));
}

/** Converte uma taxa (0–1) em percentual inteiro legível. */
export function formatPercent(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

export const EVENT_STATUS_LABEL: Record<EventStatus, string> = {
  active: "Ativo",
  closed: "Encerrado",
  cancelled: "Cancelado",
};

export const PARTICIPANT_STATUS_LABEL: Record<ParticipantStatus, string> = {
  inside: "Dentro",
  outside: "Fora",
};

export const PARTICIPANT_TYPE_LABEL: Record<ParticipantType, string> = {
  vip: "VIP",
  normal: "Normal",
};
