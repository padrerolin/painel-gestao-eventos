"use client";

import { create } from "zustand";
import type { Checkin, EventDetail, Participant } from "@/lib/types";
import { evaluateCheckin, type BlockedReason } from "@/lib/rules";

/** Mutação local de um participante (sobreposta aos dados da API). */
interface ParticipantOverlay {
  status: Participant["status"];
  checkin_count: number;
}

/** Camada de simulação acumulada para um evento. */
interface EventOverlay {
  participants: Record<string, ParticipantOverlay>;
  appendedCheckins: Checkin[];
  checkinDelta: number;
  errorDelta: number;
}

export type CheckinOutcome =
  | { ok: true; action: Checkin["action"] }
  | { ok: false; reason: BlockedReason };

interface CheckinStore {
  overlays: Record<string, EventOverlay>;
  /** Registra (ou tenta registrar) um check-in/checkout e atualiza o overlay. */
  register: (event: EventDetail, participant: Participant) => CheckinOutcome;
  /** Reseta a simulação de um evento, voltando aos dados originais da API. */
  resetEvent: (eventId: string) => void;
}

const EMPTY_OVERLAY: EventOverlay = {
  participants: {},
  appendedCheckins: [],
  checkinDelta: 0,
  errorDelta: 0,
};

// Contador monotônico só para gerar ids únicos de check-ins simulados.
let simCounter = 0;

function nextCheckinId(eventId: string): string {
  simCounter += 1;
  return `${eventId}-SIM-${simCounter}`;
}

/**
 * Resolve o estado EFETIVO de um participante = dados da API + overlay local.
 */
function effectiveParticipant(
  base: Participant,
  overlay: EventOverlay | undefined,
): Participant {
  const o = overlay?.participants[base.id];
  return o ? { ...base, status: o.status, checkin_count: o.checkin_count } : base;
}

export const useCheckinStore = create<CheckinStore>((set, get) => ({
  overlays: {},

  register: (event, participant) => {
    const overlay = get().overlays[event.id];
    const current = effectiveParticipant(participant, overlay);
    const decision = evaluateCheckin(event.status, current);

    const base: EventOverlay = overlay ?? EMPTY_OVERLAY;
    const timestamp = new Date().toISOString();

    if (!decision.ok) {
      // Registra a tentativa com erro (alimenta o card "Tentativas com Erro").
      const failed: Checkin = {
        id: nextCheckinId(event.id),
        event_id: event.id,
        participant_id: participant.id,
        timestamp,
        success: false,
        action: "entry",
        error_reason: decision.reason,
      };
      set((state) => ({
        overlays: {
          ...state.overlays,
          [event.id]: {
            ...base,
            appendedCheckins: [failed, ...base.appendedCheckins],
            errorDelta: base.errorDelta + 1,
          },
        },
      }));
      return { ok: false, reason: decision.reason };
    }

    const isEntry = decision.action === "entry";
    const newCount = isEntry ? current.checkin_count + 1 : current.checkin_count;
    const success: Checkin = {
      id: nextCheckinId(event.id),
      event_id: event.id,
      participant_id: participant.id,
      timestamp,
      success: true,
      action: decision.action,
      error_reason: null,
    };

    set((state) => ({
      overlays: {
        ...state.overlays,
        [event.id]: {
          ...base,
          participants: {
            ...base.participants,
            [participant.id]: {
              status: decision.nextStatus,
              checkin_count: newCount,
            },
          },
          appendedCheckins: [success, ...base.appendedCheckins],
          checkinDelta: base.checkinDelta + (isEntry ? 1 : 0),
        },
      },
    }));

    return { ok: true, action: decision.action };
  },

  resetEvent: (eventId) =>
    set((state) => {
      const next = { ...state.overlays };
      delete next[eventId];
      return { overlays: next };
    }),
}));

/**
 * Aplica o overlay de simulação sobre o detalhe vindo da API, produzindo o
 * estado efetivo que alimenta cards, gráficos e tabela.
 */
export function applyOverlay(
  detail: EventDetail,
  overlay: EventOverlay | undefined,
): EventDetail {
  if (!overlay) return detail;

  const participants = detail.participants.map((p) =>
    effectiveParticipant(p, overlay),
  );
  const checkinCount = detail.checkin_count + overlay.checkinDelta;

  return {
    ...detail,
    participants,
    checkins: [...overlay.appendedCheckins, ...detail.checkins],
    checkin_count: checkinCount,
    error_count: detail.error_count + overlay.errorDelta,
    entry_rate:
      detail.expected_count > 0 ? checkinCount / detail.expected_count : 0,
  };
}
