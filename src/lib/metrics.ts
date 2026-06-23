import type { Checkin, EventDetail } from "./types";

/** Métricas dos 4 cards principais do dashboard. */
export interface EventMetrics {
  expected: number;
  checkins: number;
  errors: number;
  /** Taxa de entrada = check-ins / esperados (0–1). */
  entryRate: number;
  /** Quantidade de participantes atualmente "inside" (derivado). */
  currentlyInside: number;
}

export function computeMetrics(event: EventDetail): EventMetrics {
  const expected = event.expected_count;
  const entryRate = expected > 0 ? event.checkin_count / expected : 0;
  const currentlyInside = event.participants.filter(
    (p) => p.status === "inside",
  ).length;

  return {
    expected,
    checkins: event.checkin_count,
    errors: event.error_count,
    entryRate,
    currentlyInside,
  };
}

export interface EntryTimePoint {
  /** Rótulo de horário (HH:mm) para o eixo X. */
  time: string;
  timestamp: number;
  /** Total acumulado de entradas bem-sucedidas até o momento. */
  cumulative: number;
}

/**
 * Série temporal de entradas bem-sucedidas (acumulado), ordenada por horário.
 * Alimenta o gráfico "Evolução de entradas ao longo do tempo".
 */
export function buildEntriesOverTime(checkins: Checkin[]): EntryTimePoint[] {
  const entries = checkins
    .filter((c) => c.success && c.action === "entry")
    .map((c) => ({ ...c, ms: new Date(c.timestamp).getTime() }))
    .sort((a, b) => a.ms - b.ms);

  let cumulative = 0;
  return entries.map((c) => {
    cumulative += 1;
    return {
      time: new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(c.ms),
      timestamp: c.ms,
      cumulative,
    };
  });
}

export interface SuccessErrorSlice {
  label: string;
  value: number;
  key: "success" | "error";
}

/** Proporção sucesso x erro de todas as tentativas registradas. */
export function buildSuccessErrorBreakdown(
  checkins: Checkin[],
): SuccessErrorSlice[] {
  const success = checkins.filter((c) => c.success).length;
  const error = checkins.length - success;
  return [
    { label: "Sucesso", value: success, key: "success" },
    { label: "Erro", value: error, key: "error" },
  ];
}
