import type { EventDetail, EventsResponse } from "./types";

/**
 * Opção A do desafio: leitura via GitHub Pages (somente GET).
 * Os check-ins são simulados no cliente (ver store/checkin-store).
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://ThiagoLifters.github.io/api_test";

async function fetchJson<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new Error("Não foi possível conectar à API. Verifique sua conexão.");
  }
  if (!res.ok) {
    throw new Error(`Falha ao carregar dados (HTTP ${res.status}).`);
  }
  return (await res.json()) as T;
}

export function getEvents(): Promise<EventsResponse> {
  return fetchJson<EventsResponse>(`${API_BASE_URL}/api/events.json`);
}

export function getEvent(id: string): Promise<EventDetail> {
  return fetchJson<EventDetail>(`${API_BASE_URL}/api/events/${id}.json`);
}
